import re
import os
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Field:
    name: str
    type: str
    nullable: bool = True
    required: bool = False

@dataclass
class TypeDef:
    name: str
    fields: List[Field]
    is_enum: bool = False
    enum_values: List[str] = None

@dataclass
class Operation:
    name: str
    type: str  # 'Query' or 'Mutation'
    params: List[Field]
    return_type: str

class NgRxGenerator:
    def __init__(self):
        self.base_fields = [
            'active', 'createdAt', 'createdBy', 'createdById', 
            'deletedAt', 'deletedBy', 'deletedId', 'id', 
            'isDeleted', 'uid', 'updatedAt', 'updatedBy'
        ]
    
    def parse_graphql_schema(self, schema: str) -> Tuple[List[TypeDef], List[Operation]]:
        """Parse GraphQL schema and extract types and operations"""
        types = []
        operations = []
        
        # Clean schema - remove comments and normalize whitespace
        schema = re.sub(r'#.*', '', schema)  # Remove comments
        schema = re.sub(r'\s+', ' ', schema)  # Normalize whitespace
        
        # Parse types and enums
        type_pattern = r'type\s+(\w+)\s*\{\s*([^}]+)\s*\}'
        enum_pattern = r'enum\s+(\w+)\s*\{\s*([^}]+)\s*\}'
        
        # Parse types
        for match in re.finditer(type_pattern, schema, re.IGNORECASE):
            type_name = match.group(1)
            type_body = match.group(2)
            fields = self._parse_fields(type_body)
            types.append(TypeDef(name=type_name, fields=fields))
        
        # Parse enums
        for match in re.finditer(enum_pattern, schema, re.IGNORECASE):
            enum_name = match.group(1)
            enum_body = match.group(2)
            enum_values = [v.strip() for v in enum_body.strip().split() if v.strip()]
            types.append(TypeDef(name=enum_name, fields=[], is_enum=True, enum_values=enum_values))
        
        # Parse operations - handle both formats
        # Format 1: Mutation.operationName(params): ReturnType
        mutation_pattern = r'Mutation\.(\w+)\s*\(\s*([^)]*)\s*\)\s*:\s*(\w+(?:_\w+)*)'
        query_pattern = r'Query\.(\w+)(?:\s*\(\s*([^)]*)\s*\))?\s*:\s*(.+?)(?=\s*(?:Query\.|Mutation\.|$))'
        
        for match in re.finditer(mutation_pattern, schema):
            op_name = match.group(1)
            params_str = match.group(2).strip()
            return_type = match.group(3)
            params = self._parse_params(params_str)
            operations.append(Operation(name=op_name, type='Mutation', params=params, return_type=return_type))
        
        for match in re.finditer(query_pattern, schema):
            op_name = match.group(1)
            params_str = match.group(2) or ''
            return_type = match.group(3).strip()
            params = self._parse_params(params_str)
            operations.append(Operation(name=op_name, type='Query', params=params, return_type=return_type))
        
        return types, operations
    
    def _parse_fields(self, fields_str: str) -> List[Field]:
        """Parse field definitions from type body"""
        fields = []
        # Split on newlines and also handle inline fields separated by spaces
        field_lines = []
        for line in fields_str.strip().split('\n'):
            line = line.strip()
            if not line:
                continue
            # Handle multiple fields on same line separated by spaces
            if ':' in line:
                field_lines.append(line)
        
        # Also handle space-separated fields
        if not field_lines and fields_str.strip():
            # Try splitting by spaces and looking for field:type patterns
            parts = fields_str.strip().split()
            current_field = ""
            for part in parts:
                if ':' in part and current_field:
                    field_lines.append(current_field + ' ' + part)
                    current_field = ""
                elif ':' in part:
                    field_lines.append(part)
                else:
                    if current_field:
                        current_field += ' ' + part
                    else:
                        current_field = part
            if current_field:
                field_lines.append(current_field)
        
        for line in field_lines:
            if not line or ':' not in line:
                continue
            
            # Parse field: name: Type or name: Type!
            field_match = re.match(r'(\w+)\s*:\s*(.+)', line.strip())
            if field_match:
                field_name = field_match.group(1)
                field_type = field_match.group(2).strip()
                
                # Check if required (ends with !)
                required = field_type.endswith('!')
                if required:
                    field_type = field_type[:-1]
                
                # Check if array
                is_array = field_type.startswith('[') and field_type.endswith(']')
                if is_array:
                    field_type = field_type[1:-1]
                
                fields.append(Field(name=field_name, type=field_type, required=required))
        
        return fields
    
    def _parse_params(self, params_str: str) -> List[Field]:
        """Parse parameter definitions"""
        params = []
        if not params_str.strip():
            return params
        
        # Handle both newline and comma separated parameters
        param_parts = []
        if '\n' in params_str:
            param_parts = [p.strip() for p in params_str.split('\n') if p.strip()]
        else:
            # Handle comma-separated or space-separated parameters
            param_parts = [p.strip() for p in re.split(r'[,\s]+', params_str) if p.strip() and ':' in p]
        
        for param in param_parts:
            param = param.strip()
            if not param or ':' not in param:
                continue
            
            param_match = re.match(r'(\w+)\s*:\s*(.+)', param)
            if param_match:
                param_name = param_match.group(1)
                param_type = param_match.group(2).strip()
                
                required = param_type.endswith('!')
                if required:
                    param_type = param_type[:-1]
                
                params.append(Field(name=param_name, type=param_type, required=required))
        
        return params
    
    def generate_model_file(self, entity_name: str, types: List[TypeDef]) -> str:
        """Generate the model TypeScript file"""
        # Find main type and input type
        main_type = next((t for t in types if t.name == entity_name), None)
        input_type = next((t for t in types if t.name == f"{entity_name}DtoInput"), None)
        enums = [t for t in types if t.is_enum]
        
        content = "import { BaseEntity } from '../../base-entity/base-entity.model';\n\n"
        
        # Generate main interface
        if main_type:
            content += f"export interface {entity_name} extends BaseEntity {{\n"
            for field in main_type.fields:
                if field.name not in self.base_fields:
                    ts_type = self._graphql_to_ts_type(field.type)
                    optional = "" if field.required else "?"
                    content += f"  {field.name}{optional}: {ts_type};\n"
            content += "}\n\n"
        
        # Generate input interface
        if input_type:
            content += f"export interface {entity_name}DtoInput {{\n"
            for field in input_type.fields:
                ts_type = self._graphql_to_ts_type(field.type)
                optional = "" if field.required else "?"
                content += f"  {field.name}{optional}: {ts_type};\n"
            content += "}\n\n"
        
        # Generate enums
        for enum_type in enums:
            if enum_type.name in [field.type for field in (main_type.fields if main_type else [])]:
                content += f"export enum {enum_type.name} {{\n"
                for value in enum_type.enum_values:
                    content += f"  {value} = '{value}',\n"
                content += "}\n"
        
        return content
    
    def generate_actions_file(self, entity_name: str, operations: List[Operation]) -> str:
        """Generate the actions TypeScript file"""
        snake_name = self._camel_to_snake(entity_name)
        kebab_name = self._camel_to_kebab(entity_name)
        plural_name = self._pluralize_entity_name(entity_name)
        plural_snake = self._camel_to_snake(plural_name)
        
        content = f"import {{ {entity_name}, {entity_name}DtoInput }} from './{kebab_name}.model';\n"
        content += "import { createActionGroup, emptyProps, props } from '@ngrx/store';\n"
        content += "import { Update } from '@ngrx/entity';\n\n"
        
        content += f"export const {entity_name}Actions = createActionGroup({{\n"
        content += f"  source: '{entity_name}/API',\n"
        content += "  events: {\n"
        
        # Standard CRUD actions
        content += f"    'Load {plural_name}': props<{{ {plural_snake}: {entity_name}[] }}>(),\n"
        content += f"    'Add {entity_name}': props<{{ {snake_name}: {entity_name} }}>(),\n"
        content += f"    'Upsert {entity_name}': props<{{ {snake_name}: {entity_name} }}>(),\n"
        content += f"    'Add {plural_name}': props<{{ {plural_snake}: {entity_name}[] }}>(),\n"
        content += f"    'Upsert {plural_name}': props<{{ {plural_snake}: {entity_name}[] }}>(),\n"
        content += f"    'Update {entity_name}': props<{{ {snake_name}: Update<{entity_name}> }}>(),\n"
        content += f"    'Update {plural_name}': props<{{ {plural_snake}: Update<{entity_name}>[] }}>(),\n"
        content += f"    'Delete {entity_name}': props<{{ id: number }}>(),\n"
        content += f"    'Delete {plural_name}': props<{{ ids: number[] }}>(),\n"
        content += f"    'Clear {entity_name}': emptyProps(),\n"
        content += f"    'Clear {plural_name}': emptyProps(),\n\n"
        
        content += "    // API\n"
        
        # Add API actions based on operations
        for op in operations:
            if op.name.startswith('delete'):
                content += f"    'Delete {entity_name} Api': props<{{ uid: string }}>(),\n"
            elif op.name.startswith('save'):
                content += f"    'Save {entity_name}': props<{{ input: {entity_name}DtoInput }}>(),\n"
        
        content += "  },\n"
        content += "});\n"
        
        return content
    
    def generate_reducer_file(self, entity_name: str) -> str:
        """Generate the reducer TypeScript file"""
        snake_name = self._camel_to_snake(entity_name)
        kebab_name = self._camel_to_kebab(entity_name)
        plural_name = self._pluralize_entity_name(entity_name)
        plural_snake = self._camel_to_snake(plural_name)
        feature_key = plural_snake
        
        content = "import { createFeature, createReducer, on } from '@ngrx/store';\n"
        content += "import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';\n"
        content += f"import {{ {entity_name} }} from './{kebab_name}.model';\n"
        content += f"import {{ {entity_name}Actions }} from './{kebab_name}.actions';\n\n"
        
        content += f"export const {feature_key}FeatureKey = '{feature_key}';\n\n"
        content += f"export type State = EntityState<{entity_name}>;\n\n"
        content += f"export const adapter: EntityAdapter<{entity_name}> = createEntityAdapter<{entity_name}>();\n\n"
        content += "export const initialState: State = adapter.getInitialState({\n"
        content += "  // additional entity state properties\n"
        content += "});\n\n"
        
        content += "export const reducer = createReducer(\n"
        content += "  initialState,\n"
        content += f"  on({entity_name}Actions.add{entity_name}, (state, action) =>\n"
        content += f"    adapter.addOne(action.{snake_name}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.upsert{entity_name}, (state, action) =>\n"
        content += f"    adapter.upsertOne(action.{snake_name}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.add{plural_name}, (state, action) =>\n"
        content += f"    adapter.addMany(action.{plural_snake}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.upsert{plural_name}, (state, action) =>\n"
        content += f"    adapter.upsertMany(action.{plural_snake}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.update{entity_name}, (state, action) =>\n"
        content += f"    adapter.updateOne(action.{snake_name}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.update{plural_name}, (state, action) =>\n"
        content += f"    adapter.updateMany(action.{plural_snake}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.delete{entity_name}, (state, action) =>\n"
        content += "    adapter.removeOne(action.id, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.delete{plural_name}, (state, action) =>\n"
        content += "    adapter.removeMany(action.ids, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.load{plural_name}, (state, action) =>\n"
        content += f"    adapter.setAll(action.{plural_snake}, state)\n"
        content += "  ),\n"
        content += f"  on({entity_name}Actions.clear{plural_name}, state => adapter.removeAll(state))\n"
        content += ");\n\n"
        
        content += f"export const {feature_key}Feature = createFeature({{\n"
        content += f"  name: {feature_key}FeatureKey,\n"
        content += "  reducer,\n"
        content += f"  extraSelectors: ({{ select{plural_name}State }}) => ({{\n"
        content += f"    ...adapter.getSelectors(select{plural_name}State),\n"
        content += "  }),\n"
        content += "});\n\n"
        content += f"export const {{ selectIds, selectEntities, selectAll, selectTotal }} = {feature_key}Feature;\n"
        
        return content
    
    def generate_selectors_file(self, entity_name: str) -> str:
        """Generate the selectors TypeScript file"""
        snake_name = self._camel_to_snake(entity_name)
        kebab_name = self._camel_to_kebab(entity_name)
        plural_name = self._pluralize_entity_name(entity_name)
        plural_snake = self._camel_to_snake(plural_name)
        feature_key = plural_snake
        
        content = "import { createSelector } from '@ngrx/store';\n"
        content += f"import {{ {feature_key}FeatureKey }} from './{kebab_name}.reducer';\n"
        content += f"import * as from{entity_name} from './{kebab_name}.reducer';\n"
        content += "import { AppState } from '../../../index';\n"
        content += f"import {{ {entity_name} }} from './{kebab_name}.model';\n"
        content += "import { formatDates } from '@shared/data/data.helpers';\n\n"
        
        content += f"export const current{plural_name}state = (state: AppState) => state[{feature_key}FeatureKey];\n\n"
        
        content += f"export const select{entity_name}FromReducer = createSelector(\n"
        content += f"  current{plural_name}state,\n"
        content += f"  from{entity_name}.selectAll\n"
        content += ");\n\n"
        
        content += f"export const select{plural_name} = createSelector(select{entity_name}FromReducer, items => {{\n"
        content += "  return items?.map(item => {\n"
        content += "    return {\n"
        content += "      ...item,\n"
        content += "      modActive: item?.active ? 'Yes' : 'No',\n"
        content += "    };\n"
        content += "  });\n"
        content += "});\n\n"
        
        content += f"export const map{entity_name} = (item: {entity_name}) => {{\n"
        content += "  return {\n"
        content += "    ...item,\n"
        content += "    ...formatDates(item), // adds createdAtMod,...etc,\n"
        content += "    activeMod: item?.active ? 'Active' : 'In Active',\n"
        content += "  };\n"
        content += "};\n\n"
        
        content += f"export const select{entity_name}ById = (id: number) =>\n"
        content += f"  createSelector(select{plural_name}, items => items.find(item => item.id === id));\n\n"
        
        content += f"export const select{entity_name}ByUid = (uid: string) =>\n"
        content += f"  createSelector(select{plural_name}, items => items.find(item => item.uid === uid));\n"
        
        return content
    
    def generate_effects_file(self, entity_name: str, operations: List[Operation]) -> str:
        """Generate the effects TypeScript file"""
        kebab_name = self._camel_to_kebab(entity_name)
        snake_name = self._camel_to_snake(entity_name)
        
        content = "import { Injectable } from '@angular/core';\n"
        content += "import { Actions, createEffect, ofType } from '@ngrx/effects';\n"
        content += "import { concatMap } from 'rxjs/operators';\n"
        content += f"import {{ {entity_name}Actions }} from './{kebab_name}.actions';\n"
        content += "import { FetchService } from '@shared';\n"
        content += f"import * as fromGql from './{kebab_name}.graphql';\n\n"
        
        content += "@Injectable()\n"
        content += f"export class {entity_name}Effects {{\n"
        
        # Generate effects for each operation
        for op in operations:
            if op.name.startswith('delete'):
                effect_name = f"delete{entity_name}Api$"
                action_name = f"delete{entity_name}Api"
                gql_const = self._camel_to_screaming_snake(op.name)
                success_action = f"{entity_name}Actions.delete{entity_name}"
                
                content += f"  {effect_name} = createEffect(\n"
                content += "    () => {\n"
                content += f"      return this.actions$.pipe(ofType({entity_name}Actions.{action_name})).pipe(\n"
                content += "        concatMap(({ uid }) => {\n"
                content += "          return this.fetchService.getResponseFromMutation({\n"
                content += f"            mutation: fromGql.{gql_const},\n"
                content += f"            errorMessage: 'Error on Deleting {entity_name}',\n"
                content += "            variables: { uid },\n"
                content += f"            successAction: ({{ id }}) => {success_action}({{ id }}),\n"
                content += "          });\n"
                content += "        })\n"
                content += "      );\n"
                content += "    },\n"
                content += "    { dispatch: false }\n"
                content += "  );\n\n"
            
            elif op.name.startswith('save'):
                effect_name = f"save{entity_name}$"
                action_name = f"save{entity_name}"
                gql_const = self._camel_to_screaming_snake(op.name)
                success_action = f"{entity_name}Actions.upsert{entity_name}"
                
                content += f"  {effect_name} = createEffect(\n"
                content += "    () => {\n"
                content += f"      return this.actions$.pipe(ofType({entity_name}Actions.{action_name})).pipe(\n"
                content += "        concatMap(({ input }) => {\n"
                content += "          return this.fetchService.getResponseFromMutation({\n"
                content += f"            mutation: fromGql.{gql_const},\n"
                content += f"            errorMessage: 'Error on Saving {entity_name}',\n"
                content += "            variables: { input },\n"
                content += f"            successAction: {snake_name} =>\n"
                content += f"              {success_action}({{ {snake_name} }}),\n"
                content += "          });\n"
                content += "        })\n"
                content += "      );\n"
                content += "    },\n"
                content += "    { dispatch: false }\n"
                content += "  );\n\n"
        
        content += "  constructor(private actions$: Actions, private fetchService: FetchService) {}\n"
        content += "}\n"
        
        return content
    
    def generate_graphql_file(self, entity_name: str, operations: List[Operation], types: List[TypeDef]) -> str:
        """Generate the GraphQL TypeScript file"""
        snake_name = self._camel_to_snake(entity_name)
        camel_name = entity_name[0].lower() + entity_name[1:]  # camelCase version
        
        # Get custom fields (excluding base fields)
        main_type = next((t for t in types if t.name == entity_name), None)
        custom_fields = []
        if main_type:
            custom_fields = [f.name for f in main_type.fields if f.name not in self.base_fields]
        
        content = "import { baseGqlFields, pageGqlFields, responseGqlFields } from '@shared';\n"
        content += "import gql from 'graphql-tag';\n\n"
        
        # Generate field list using camelCase
        content += "export const " + camel_name + "GqlFields = `\n"
        for field in custom_fields:
            content += f"  {field}\n"
        content += "  ${baseGqlFields}\n"
        content += "`;\n\n"
        
        # Generate mutations
        content += "//  mutations\n"
        for op in operations:
            if op.type == 'Mutation':
                # Convert operation name to SCREAMING_SNAKE_CASE
                const_name = self._camel_to_screaming_snake(op.name)
                
                content += f"export const {const_name} = gql`\n"
                content += f"   mutation {op.name}"
                
                if op.params:
                    param_defs = []
                    for param in op.params:
                        param_type = param.type
                        if param.required:
                            param_type += "!"
                        param_defs.append(f"${param.name}: {param_type}")
                    
                    params_str = ", ".join(param_defs)
                    content += f"({params_str})"
                
                content += " {\n"
                content += f"     {op.name}"
                if op.params:
                    var_list = ", ".join([f"{p.name}: ${p.name}" for p in op.params])
                    content += f"({var_list})"
                content += " {\n"
                
                # Use pageGqlFields if "Pageable" is in return type, otherwise responseGqlFields
                if 'Pageable' in op.return_type:
                    content += "      ${pageGqlFields(" + camel_name + "GqlFields)}\n"
                else:
                    content += "      ${responseGqlFields(" + camel_name + "GqlFields)}\n"
                
                content += "     }\n"
                content += "   }\n"
                content += " `;\n\n"
        
        # Generate queries
        content += "// queries\n"
        for op in operations:
            if op.type == 'Query':
                # Convert operation name to SCREAMING_SNAKE_CASE
                const_name = self._camel_to_screaming_snake(op.name)
                
                content += f"export const {const_name} = gql`\n"
                content += f"   query {op.name}"
                
                if op.params:
                    param_defs = []
                    for param in op.params:
                        param_type = param.type
                        if param.required:
                            param_type += "!"
                        param_defs.append(f"${param.name}: {param_type}")
                    params_str = ", ".join(param_defs)
                    content += f"({params_str})"
                
                content += " {\n"
                content += f"     {op.name}"
                
                if op.params:
                    var_list = ", ".join([f"{p.name}: ${p.name}" for p in op.params])
                    content += f"({var_list})"
                
                content += " {\n"
                
                if 'Pageable' in op.return_type or 'Pageable' in op.name:
                    content += "      ${pageGqlFields(" + camel_name + "GqlFields)}\n"
                elif op.return_type.startswith('['):
                    content += "      ${" + camel_name + "GqlFields}\n"
                else:
                    content += "      ${responseGqlFields(" + camel_name + "GqlFields)}\n"
                
                content += "     }\n"
                content += "   }\n"
                content += " `;\n\n"
        
        return content.rstrip() + "\n"
    
    def _get_plural(self, word: str) -> str:
        """Convert singular word to plural with proper English rules"""
        word = word.lower()
        
        # Special cases
        special_cases = {
            'child': 'children',
            'person': 'people',
            'man': 'men',
            'woman': 'women',
            'tooth': 'teeth',
            'foot': 'feet',
            'mouse': 'mice',
            'goose': 'geese'
        }
        
        if word in special_cases:
            return special_cases[word]
        
        # Words ending in 'y' preceded by a consonant
        if word.endswith('y') and len(word) > 1 and word[-2] not in 'aeiou':
            return word[:-1] + 'ies'
        
        # Words ending in 's', 'ss', 'sh', 'ch', 'x', 'z'
        if word.endswith(('s', 'ss', 'sh', 'ch', 'x', 'z')):
            return word + 'es'
        
        # Words ending in 'f' or 'fe'
        if word.endswith('f'):
            return word[:-1] + 'ves'
        elif word.endswith('fe'):
            return word[:-2] + 'ves'
        
        # Words ending in 'o' preceded by a consonant
        if word.endswith('o') and len(word) > 1 and word[-2] not in 'aeiou':
            return word + 'es'
        
        # Default: just add 's'
        return word + 's'

    def _pluralize_entity_name(self, entity_name: str) -> str:
        """Convert entity name to plural, preserving case"""
        # Split camelCase words
        words = re.findall(r'[A-Z][a-z]*|[a-z]+', entity_name)
        if not words:
            return entity_name + 's'
        
        # Pluralize the last word
        last_word = words[-1]
        plural_last = self._get_plural(last_word)
        
        # Capitalize first letter to match original case
        if last_word[0].isupper():
            plural_last = plural_last.capitalize()
        
        # Replace last word with plural
        words[-1] = plural_last
        return ''.join(words)
    
    def _graphql_to_ts_type(self, graphql_type: str) -> str:
        """Convert singular word to plural with proper English rules"""
        word = graphql_type.lower()
        
        # Special cases
        special_cases = {
            'child': 'children',
            'person': 'people',
            'man': 'men',
            'woman': 'women',
            'tooth': 'teeth',
            'foot': 'feet',
            'mouse': 'mice',
            'goose': 'geese'
        }
        
        if word in special_cases:
            return special_cases[word]
        
        # Words ending in 'y' preceded by a consonant
        if word.endswith('y') and len(word) > 1 and word[-2] not in 'aeiou':
            return word[:-1] + 'ies'
        
        # Words ending in 's', 'ss', 'sh', 'ch', 'x', 'z'
        if word.endswith(('s', 'ss', 'sh', 'ch', 'x', 'z')):
            return word + 'es'
        
        # Words ending in 'f' or 'fe'
        if word.endswith('f'):
            return word[:-1] + 'ves'
        elif word.endswith('fe'):
            return word[:-2] + 'ves'
        
        # Words ending in 'o' preceded by a consonant
        if word.endswith('o') and len(word) > 1 and word[-2] not in 'aeiou':
            return word + 'es'
        
        # Default: just add 's'
        return word + 's'

    def _pluralize_entity_name(self, entity_name: str) -> str:
        """Convert entity name to plural, preserving case"""
        # Split camelCase words
        words = re.findall(r'[A-Z][a-z]*|[a-z]+', entity_name)
        if not words:
            return entity_name + 's'
        
        # Pluralize the last word
        last_word = words[-1]
        plural_last = self._get_plural(last_word)
        
        # Capitalize first letter to match original case
        if last_word[0].isupper():
            plural_last = plural_last.capitalize()
        
    def _camel_to_snake(self, name: str ) -> str:
        """Convert CamelCase to snake_case"""
        return re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name).lower()
    
    def _camel_to_kebab(self, name: str) -> str:
        """Convert CamelCase to kebab-case"""
        return re.sub('(.)([A-Z][a-z]+)', r'\1-\2', name).lower()
    
    def _camel_to_screaming_snake(self, name: str) -> str:
        """Convert CamelCase to SCREAMING_SNAKE_CASE"""
        if not name:
            return name
        return self._camel_to_snake(name).upper()
    
    def _to_title_case(self, name: str) -> str:
        """Convert to Title Case"""
        return ''.join(word.capitalize() for word in re.split(r'[_\-\s]+', name))
    
    def _to_title_case_with_spaces(self, name: str) -> str:
        """Convert camelCase to Title Case With Spaces"""
        # Insert space before capital letters
        spaced = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)
        return spaced.title()
    
    def generate_files(self, entity_name: str, schema: str, output_dir: str = "."):
        """Generate all NgRx files for the given entity"""
        print(f"Parsing schema for {entity_name}...")
        types, operations = self.parse_graphql_schema(schema)
        
        # Debug output
        print(f"Found {len(types)} types:")
        for t in types:
            if t.is_enum:
                print(f"  - Enum {t.name}: {t.enum_values}")
            else:
                print(f"  - Type {t.name}: {len(t.fields)} fields")
        
        print(f"Found {len(operations)} operations:")
        for op in operations:
            print(f"  - {op.type} {op.name}: {len(op.params)} params -> {op.return_type}")
        
        kebab_name = self._camel_to_kebab(entity_name)
        
        # Ensure output directory exists
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        files = {
            f"{kebab_name}.model.ts": self.generate_model_file(entity_name, types),
            f"{kebab_name}.actions.ts": self.generate_actions_file(entity_name, operations),
            f"{kebab_name}.reducer.ts": self.generate_reducer_file(entity_name),
            f"{kebab_name}.selectors.ts": self.generate_selectors_file(entity_name),
            f"{kebab_name}.effects.ts": self.generate_effects_file(entity_name, operations),
            f"{kebab_name}.graphql.ts": self.generate_graphql_file(entity_name, operations, types)
        }
        
        for filename, content in files.items():
            filepath = Path(output_dir) / filename
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Generated: {filepath}")

def main():
    """Main function to run the generator"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate NgRx files from GraphQL schema')
    parser.add_argument('entity_name', help='Entity name (e.g., ClientCategory)')
    parser.add_argument('schema_file', help='Path to GraphQL schema file')
    parser.add_argument('-o', '--output', default='.', help='Output directory (default: current directory)')
    
    args = parser.parse_args()
    
    # Read schema file
    try:
        with open(args.schema_file, 'r') as f:
            schema = f.read()
    except FileNotFoundError:
        print(f"Error: Schema file '{args.schema_file}' not found")
        return 1
    except Exception as e:
        print(f"Error reading schema file: {e}")
        return 1
    
    # Generate files
    try:
        generator = NgRxGenerator()
        generator.generate_files(args.entity_name, schema, args.output)
        print(f"\nSuccessfully generated NgRx files for {args.entity_name}")
    except Exception as e:
        print(f"Error generating files: {e}")
        return 1
    
    return 0

# Example usage as a module
def generate_from_string(entity_name: str, schema: str, output_dir: str = "."):
    """Generate files from schema string"""
    generator = NgRxGenerator()
    generator.generate_files(entity_name, schema, output_dir)

if __name__ == "__main__":
    # Example usage with the provided schema
    example_schema = """
type ClientCategory {
  active: Boolean
  clientCategoryGroup: ClientCategoryGroup
  code: String
  createdAt: LocalDateTime
  createdBy: User
  createdById: Long
  deletedAt: LocalDateTime
  deletedBy: Long
  deletedId: Long
  id: Long
  isDeleted: Boolean
  migrated: Boolean
  name: String
  uid: String
  updatedAt: LocalDateTime
  updatedBy: Long
}

type ClientCategoryDtoInput {
  clientCategoryGroup: ClientCategoryGroup!
  code: String!
  name: String!
  uid: String
}

enum ClientCategoryGroup {
  BOTH
  PROVIDER
  RECEIVER
}

Mutation.saveClientCategory(
  input: ClientCategoryDtoInput!
): Response_ClientCategory

Mutation.deleteClientCategory(
  uid: String!
): Response_ClientCategory

Query.allClientCategoryPageable(
  pageableParam: PageableParamInput
  active: Boolean
): Page_ClientCategory

Query.findClientCategory(
  uid: String!
): Response_ClientCategory

Query.allClientCategory: [ClientCategory]
    """
    
    # You can run this directly or use command line arguments
    import sys
    if len(sys.argv) > 1:
        main()
    else:
        # Generate example files
        print("Generating example files for ClientCategory...")
        generate_from_string("ClientCategory", example_schema, "./generated")
        print("Example files generated in './generated' directory")