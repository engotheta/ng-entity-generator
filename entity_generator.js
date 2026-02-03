/**
 * NgRx File Generator for Angular/TypeScript
 * Generates NgRx store files from GraphQL schema definitions
 */

const fs = require("fs");
const path = require("path");
const { analyzeStoreTypes } = require("./app_types.js");
const { ALL } = require("dns");

class Field {
  constructor(name, type, nullable = true, required = false, isArray = false) {
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.required = required;
    this.isArray = isArray;
  }
}

class TypeDef {
  constructor(name, fields, isEnum = false, enumValues = null) {
    this.name = name;
    this.fields = fields;
    this.isEnum = isEnum;
    this.enumValues = enumValues;
  }
}

class Operation {
  constructor(name, type, params, returnType) {
    this.name = name;
    this.type = type;
    this.params = params;
    this.returnType = returnType;
  }
}

const upsertsDeletes = [
  `save`,
  `update`,
  `restore`,
  `archive`,
  `delete`,
  `deactivate`,
];

class NgRxGenerator {
  constructor() {
    this.baseFields = [
      "active",
      "createdAt",
      "createdBy",
      "createdById",
      "deletedAt",
      "deletedBy",
      "deletedId",
      "id",
      "isDeleted",
      "uid",
      "updatedAt",
      "updatedBy",
    ];
  }

  parseGraphqlSchema(schema) {
    const types = [];
    const operations = [];

    // Parse types
    const typePattern = /type\s+(\w+)\s*\{([^}]+)\}/gm;
    let match;

    while ((match = typePattern.exec(schema)) !== null) {
      const typeName = match[1];
      const typeBody = match[2];
      const fields = this._parseFields(typeBody);
      types.push(new TypeDef(typeName, fields));
    }

    // Parse enums
    const enumPattern = /enum\s+(\w+)\s*\{([^}]+)\}/gm;

    while ((match = enumPattern.exec(schema)) !== null) {
      const enumName = match[1];
      const enumBody = match[2];

      const enumValues = enumBody
        .trim()
        .split("\n")
        .map((v) => v.trim())
        .filter((v) => v);

      types.push(new TypeDef(enumName, [], true, enumValues));
    }

    // Parse mutations
    const mutationPattern = /Mutation\.(\w+)\(([^)]*)\):\s*(\w+)/gm;
    while ((match = mutationPattern.exec(schema)) !== null) {
      const opName = match[1];
      const paramsStr = match[2];
      const returnType = match[3];
      const params = this._parseParams(paramsStr);
      operations.push(new Operation(opName, "Mutation", params, returnType));
    }

    // Parse queries
    const queryPattern = /Query\.(\w+)(?:\(([^)]*)\))?:\s*(.+)/gm;

    while ((match = queryPattern.exec(schema)) !== null) {
      const opName = match[1];
      const paramsStr = match[2] || "";
      const returnType = match[3];
      const params = this._parseParams(paramsStr);
      operations.push(new Operation(opName, "Query", params, returnType));
    }

    operations.sort((a, b) => a.type.localeCompare(b.type));

    return { types, operations };
  }

  _parseFields(fieldsStr) {
    const fields = [];
    const lines = fieldsStr.trim().split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const fieldMatch = trimmedLine.match(/(\w+):\s*(.+)/);

      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        let fieldType = fieldMatch[2].trim();

        const required = fieldType.endsWith("!");
        if (required) fieldType = fieldType.slice(0, -1);

        const isArray = fieldType.startsWith("[") && fieldType.endsWith("]");
        if (isArray) fieldType = fieldType.slice(1, -1);
        //prettier-ignore
        fields.push(new Field(fieldName, fieldType, !required, required, isArray));
      }
    }

    return fields;
  }

  _parseParams(paramsStr) {
    const params = [];
    if (!paramsStr.trim()) return params;

    const paramLines = paramsStr.split("\n");

    for (const param of paramLines) {
      const trimmedParam = param.trim();
      if (!trimmedParam) continue;

      const paramMatch = trimmedParam.match(/(\w+):\s*(.+)/);
      if (paramMatch) {
        const paramName = paramMatch[1];
        let paramType = paramMatch[2].trim();

        const required = paramType.endsWith("!");
        if (required) paramType = paramType.slice(0, -1);
        params.push(new Field(paramName, paramType, !required, required));
      }
    }

    return params;
  }

  _getSingleQueryName(entityName, operations) {
    let queryPart = [`find${entityName}`, `get${entityName}By`];
    //prettier-ignore
    let fOperations = operations?.filter((o) => queryPart.some(x => o.name.includes(x)));
    //prettier-ignore
    let fOperation = fOperations.find((o) => o.name.includes("find")) ?? fOperations?.[0];
    //prettier-ignore
    return !!fOperation ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getDtoTypeByEntityName(types, entityName, force = false) {
    let suffixes = ["DtoInput", "Dto"];
    //prettier-ignore
    let type = types.find((t) =>  suffixes.some((s) => t.name === `${entityName}${s}`) );
    //prettier-ignore
    if (!type && force) return this._getDtoType(types, `${entityName}${suffixes[0]}`, force);
    else return type
  }

  _getDtoType(types, typeName, force = false) {
    let getType = (name) => {
      let availType =
        types.find((t) => t.name === name) ??
        ALL_TYPES.find((t) => t.name === name);

      return availType;
    };

    let dto = getType(typeName);

    //prettier-ignore
    if (force && !dto  ) {
      let suffix = ['DtoInput','Dto'].find(s => typeName.endsWith(s)) ?? '';
      let typeName_ = typeName.substring(0, typeName.length -  suffix.length );
      let subTypes = this._generateSubNames(typeName_).map(s => `${s}${suffix}`);
      console.log('sdfdsfdsfdsfdsf ',typeName_, subTypes)
      let i = 0;
      //prettier-ignore
      for (  i = 0; i < subTypes.length && !dto; i++) dto = getType(subTypes[i]);
      console.log(subTypes?.[i - 1] );
    }

    return dto;
  }

  _getListQueryNameFromAll(entityName, force = false) {
    let getOperation = (typeName) => {
      let queryPart = [
        `${typeName}Pageable`,
        `all${typeName}`,
        `getAll${typeName}`,
      ];

      //prettier-ignore
      let operations = ALL_TYPES.find((t) => t.name === typeName)?.queries ?? [];
      //prettier-ignore
      let fOperations = operations?.filter((o) => queryPart.some(x => o.name.includes(x)));
      //prettier-ignore
      let fOperation = fOperations.find((o) => o.name.includes("Page")) ?? fOperations?.[0];

      return fOperation;
    };

    let operation = getOperation(entityName);

    let nonForcedSuffix = ["Item"];

    //prettier-ignore
    if (force && !operation && !nonForcedSuffix.some(s => entityName.endsWith(s))) {
      let subTypes = this._generateSubNames(entityName);
      //prettier-ignore

      if(!!subTypes.find(s => s.includes(MAIN_TYPE)) ) subTypes = []; // skip if entity is part
      let i = 0;
      //prettier-ignore
      for (  i = 0; i < subTypes.length && !operation; i++) operation = getOperation(subTypes[i]);
      console.log(subTypes?.[i - 1], MAIN_TYPE);
    }

    return operation;
  }

  _generateSubNames(name) {
    // Split name into words (camelCase, snake_case, kebab-case, or spaced)
    const words = name
      .replace(/([a-z])([A-Z])/g, "$1 $2") // break camelCase
      .split(/[\s\-_]+/) // split by space, -, _
      .filter(Boolean);

    const results = new Set();

    // Generate all combinations of size 1..n
    function combine(arr, size, prefix = []) {
      if (prefix.length === size) {
        results.add(prefix.join(""));
        return;
      }

      for (let i = 0; i < arr.length; i++) {
        if (!prefix.includes(arr[i])) {
          combine(arr.slice(i + 1), size, [...prefix, arr[i]]);
        }
      }
    }

    // For every combination length (n → 1)
    for (let size = words.length; size >= 1; size--) combine(words, size);

    // Return sorted by length (desc), then alphabetically
    return Array.from(results).sort(
      (a, b) => b.length - a.length || a.localeCompare(b),
    );
  }

  _getListQueryName(entityName, operations) {
    let entityPlural = this._toPlural(entityName);

    let queryPart = [
      `${entityName}Pageable`,
      `${entityPlural}Pageable`,
      `all${entityName}`,
      `all${entityPlural}`,
      `getAll${entityPlural}`,
      `get${entityPlural}`,
      `${entityPlural}`,
    ];

    //prettier-ignore
    let fOperations = operations?.filter((o) => {

      let nameMatch = queryPart.some(x => o.name.toLowerCase().includes(x.toLowerCase()))

      let returnMatch = 
        o.type === 'Query' &&
        ['list', 'page' ].some(str => [str,entityName.toLowerCase() ]
        .every( s =>  o.returnType.toLowerCase().includes(s)))
      
      return nameMatch || returnMatch
    });

    //prettier-ignore
    let fOperation =   fOperations?.[0];

    //prettier-ignore
    return !!fOperation ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getDeleteQueryName(entityName, operations) {
    let entityPlural = this._toPlural(entityName);

    const verbs = ["delete", "remove"];
    const entities = [entityName, entityPlural];

    //prettier-ignore
    const queryPart = verbs.flatMap((verb) => entities.map((entity) => `${verb}${entity}`));

    //prettier-ignore
    let fOperations = operations?.filter((o) => {
      let nameMatch = queryPart.some(x => o.name.toLowerCase().includes(x.toLowerCase()))
      return nameMatch  
    });

    //prettier-ignore
    let fOperation =   fOperations?.[0];

    //prettier-ignore
    return !!fOperation ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getCreateQueryName(entityName, operations) {
    let entityPlural = this._toPlural(entityName);
    let entityTitle = this._toTitleCase(entityName);

    const verbs = ["create", "add", "save"];
    const entities = [entityName, entityPlural];
    //prettier-ignore
    const queryPart = verbs.flatMap((verb) => entities.map((entity) => `${verb}${entity}`));

    //prettier-ignore
    let fOperations = operations?.filter((o) => {
      let nameMatch = queryPart.some(x => o.name.toLowerCase().includes(x.toLowerCase()))
      return nameMatch  
    });

    //prettier-ignore
    let fOperation =   fOperations?.[0];

    let titles = entityTitle.split(" ");

    if (!fOperation && titles.length >= 2) {
      for (const title of titles) {
        let name = this._getCreateQueryName(title, operations);
        // end here
        if (!!name) return name;
      }
    }

    return !!fOperation ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _addTabsToEachLine(str, tabCount = 1, skipedLines = []) {
    const tabs = "\t".repeat(tabCount);
    if (!Array.isArray(skipedLines)) skipedLines = [skipedLines];

    return str
      .split("\n")
      .map((line, index) => (skipedLines.includes(index) ? line : tabs + line))
      .join("\n");
  }

  _graphqlToFormType(field) {
    let graphqlType = field.type;

    const typeMapping = {
      String: "FieldType.input",
      Int: "FieldType.input",
      Long: "FieldType.number",
      Float: "FieldType.number",
      Boolean: "FieldType.checkbox",
      LocalDateTime: "FieldType.datetime",
      BigDecimal: "FieldType.number",
      LocalDate: "FieldType.date",
    };

    return typeMapping[graphqlType] || "FieldType.input";
  }

  _graphqlToTsType(graphqlType) {
    const typeMapping = {
      String: "string",
      Int: "number",
      Long: "number",
      Float: "number",
      Boolean: "boolean",
      LocalDateTime: "string",
      BigDecimal: "number",
      LocalDate: "string",
    };
    return typeMapping[graphqlType] || graphqlType;
  }

  _toSnake(name) {
    return (
      name
        // Replace separators with space
        .replace(/[-_\s]+/g, " ")
        // Insert space before PascalCase boundaries
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // Normalize: lowercase + snake
        .trim()
        .split(/\s+/)
        .join("_")
        .toLowerCase()
    );
  }

  _toKebab(name) {
    return name
      .replace(/[-_\s]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim()
      .split(/\s+/)
      .join("-")
      .toLowerCase();
  }

  _toTitleCase(str) {
    return (
      str
        // Replace underscores, hyphens with space
        .replace(/[-_]+/g, " ")
        // Put space between lower & upper (camel/Pascal case → spaced)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // Put space between consecutive uppers followed by lower (e.g. "NASAProject" → "NASA Project")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
        // Normalize spaces
        .trim()
        .split(/\s+/)
        // Capitalize each word
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    );
  }

  _toScreamingSnake(name) {
    return this._toSnake(name).toUpperCase();
  }

  _toCamelCase(str) {
    return (
      str
        // Replace non-alphanumeric separators with spaces
        .replace(/[-_]+/g, " ")
        // Insert space before capital letters (PascalCase → spaced)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // Trim & split by spaces
        .trim()
        .split(/\s+/)
        // Lowercase first word, capitalize others
        .map((word, i) => {
          if (i === 0) return word.toLowerCase();
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("")
    );
  }

  _toPlural(str) {
    const pluralizeWord = (word) => {
      let specialCases = {
        child: "children",
        person: "people",
        man: "men",
        woman: "women",
        tooth: "teeth",
        foot: "feet",
        mouse: "mice",
        goose: "geese",
        species: "species",
        series: "series",
      };

      for (const [key, value] of Object.entries(specialCases)) {
        specialCases[this._toTitleCase(key)] = this._toTitleCase(value);
        specialCases[key.toUpperCase()] = value.toUpperCase();
      }

      if (specialCases[word]) return specialCases[word];

      if (word.match(/(s|ss|sh|ch|x|z)$/)) return word + "es";
      if (word.endsWith("f")) return word.slice(0, -1) + "ves";
      if (word.endsWith("fe")) return word.slice(0, -2) + "ves";

      // city -> cities, cowboy -> cowboys
      if (/[^aeiou]y$/i.test(word)) return word.replace(/y$/i, "ies");
      // bus -> buses, box -> boxes
      else if (/s$|x$|z$|ch$|sh$/i.test(word)) return word + "es";
      else return word + "s"; // cat -> cats
    };

    // Detect separator style
    const snake = str.includes("_");
    const kebab = str.includes("-");
    const hasSpaces = str.includes(" ");

    // Split into words (works for camelCase too)
    let words = str
      .replace(/[-_]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .trim()
      .split(/\s+/);

    if (words.length === 0) return str;

    // Pluralize last word
    words[words.length - 1] = pluralizeWord(words[words.length - 1]);

    // Reconstruct based on original style
    if (snake) return words.map((w) => w.toLowerCase()).join("_");
    else if (kebab) return words.map((w) => w.toLowerCase()).join("-");
    else if (hasSpaces) {
      // Keep Title Case if original was title
      return words
        .map((w, i) =>
          /^[A-Z]/.test(str.split(" ")[i] || "")
            ? w.charAt(0).toUpperCase() + w.slice(1)
            : w.toLowerCase(),
        )
        .join(" ");
    } else {
      // Assume camelCase or PascalCase
      return words
        .map((w, i) => {
          // camelCase
          let hasCamel = i === 0 && /^[a-z]/.test(str[0]);
          if (hasCamel) return w.charAt(0).toLowerCase() + w.slice(1);
          return w.charAt(0).toUpperCase() + w.slice(1); // PascalCase
        })
        .join("");
    }
  }

  _isBusinessKey(key) {
    const excludePatterns = [
      /^id$/i,
      /uid/i,
      /^_id$/i,
      /created/i,
      /updated/i,
      /deleted/i,
      /active/i,
      /status/i,
      /flag/i,
      /migrated/i,
      /version/i,
      /timestamp/i,
    ];

    return !excludePatterns.some((p) => p.test(key));
  }

  _getBusinessKeys(type, sort = true) {
    let keys = type.fields.map((field) => field.name);
    keys = keys.filter((key) => this._isBusinessKey(key));
    if (sort) keys = this._sortByReference([...keys], this._getNameKeys(type));
    return keys;
  }

  _isNameKey(key) {
    const patterns = [
      /name/i,
      /full.?name/i,
      /first.?name/i,
      /last.?name/i,
      /title/i,
      /label/i,
      /username/i,
      /nickname/i,
      /alias/i,
      /code/i,
      /display.?name/i,
      /description/i,
    ];

    return patterns.some((p) => p.test(key));
  }

  _sortByReference(list, reference) {
    const orderMap = new Map(reference.map((val, idx) => [val, idx]));

    return [...list].sort((a, b) => {
      const aIndex = orderMap.has(a) ? orderMap.get(a) : Infinity;
      const bIndex = orderMap.has(b) ? orderMap.get(b) : Infinity;
      return aIndex - bIndex;
    });
  }

  _getNameKeys(type) {
    let keys = type?.fields.map((field) => field.name) ?? [];
    let order = ["title", "name", "label"];

    return [...keys]
      .filter((key) => this._isNameKey(key))
      .sort((a, b) => {
        const aIndex = order.findIndex((o) => a.toLowerCase().includes(o));
        const bIndex = order.findIndex((o) => b.toLowerCase().includes(o));
        //prettier-ignore
        return ( (aIndex === -1 ? Infinity : aIndex) -  (bIndex === -1 ? Infinity : bIndex) );
      });
  }

  _isGqlType(type) {
    const gqlScalars = new Set([
      "String",
      "Int",
      "Float",
      "Boolean",
      "ID",
      "LocalDate",
      "LocalDateTime",
      "BigDecimal",
      "Long",
    ]);

    return gqlScalars.has(type);
  }

  _getNonGraphQLTypes(type) {
    let types = type.fields.filter((f) => !f.isEnum).map((field) => field.type);
    return types.filter((key) => !this._isGqlType(key));
  }

  generateInterfaceFile(entityName, types, includeNotInMain = true) {
    // prettier-ignore
    if(!includeNotInMain) types = types.filter(t => t.name.includes(entityName))

    const mainType = types.find((t) => t.name === entityName);
    const enums = types.filter((t) => t.isEnum);
    const inputs = types.filter((t) => t.name.includes("Dto"));
    // prettier-ignore
    const otherTypes = types.filter((t)=>  !t.name.includes('Dto') && !t.isEnum);

    let imports = `import { BaseEntity } from '../../base-entity/base-entity.model';\n`;

    let content = "";

    let addField = (field) => {
      const tsType = this._graphqlToTsType(field.type);
      // prettier-ignore
      if(!['string','number','boolean'].includes(tsType) && !types.find(t => t.name === tsType)) {
        let otherType =  ALL_TYPES.find(t => t.name === tsType);
        //remove the .ts part
        if(!!otherType && !imports.includes(tsType)){
          imports +=`import { ${tsType} } from '${otherType.path.slice(0,-3)}'\n`
        };
      }
      const optional = field.required ? "" : "?";
      content += `  ${field.name}${optional}: ${tsType};\n`;
    };

    //
    otherTypes.forEach((type) => {
      content += `export interface ${type.name} extends BaseEntity {\n`;
      for (const field of type.fields) {
        if (!this.baseFields.includes(field.name)) addField(field);
      }
      content += "}\n\n";
    });

    // Generate input interface
    inputs.forEach((type) => {
      content += `export interface ${type.name} {\n`;
      for (const field of type.fields) addField(field);
      content += "}\n\n";
    });

    // Generate enums
    for (const enumType of enums) {
      const mainFields = mainType ? mainType.fields : [];

      if (
        includeNotInMain ||
        mainFields.some((f) => f.type === enumType.name)
      ) {
        content += `export enum ${enumType.name} {\n`;
        // prettier-ignore
        for (const value of enumType.enumValues) content += `  ${value} = '${value}',\n`;
        content += "}\n";
      }
    }

    return imports + `\n` + content;
  }

  generateGraphqlFile(entityName, operations, types) {
    const camelName = this._toCamelCase(entityName);

    // Get custom fields (excluding base fields)
    const mainType = types.find((t) => t.name === entityName);

    const fields = mainType
      ? mainType.fields.filter((f) => !this.baseFields.includes(f.name))
      : [];

    let imports = `import { baseGqlFields } from '@shared';\n`;
    imports += "import gql from 'graphql-tag';\n";

    let content = ``;

    // Generate field list
    content += `export const ${camelName}GqlFields = \`\n`;

    for (const field of fields) {
      if (this._isGqlType(field.type) || field.isEnum) {
        content += `  ${field.name}\n`;
      } else {
        let fieldType =
          types.find((t) => t.name === field.type) ??
          ALL_TYPES.find((t) => t.name === field.type);

        let primitives = ["string", "boolean", "number"];

        let keys =
          fieldType?.fields
            .filter((f) => primitives.includes(this._graphqlToTsType(f.type)))
            .map((f) => f.name)
            .filter((k) => !!this._isBusinessKey(k)) ?? [];

        keys = this._sortByReference(keys, this._getNameKeys(fieldType));
        // .filter((k) => !!this._isNameKey(k)) ?? [];

        // console.log(keys);

        content += `  ${field.name}{\n`;
        let innerKeys = [...keys.slice(0, 6), "uid"]; //TODO: get innerFields by type in the whole context

        innerKeys.forEach((key) => (content += `    ${key}\n`));
        content += `  }\n`;
      }
    }

    content += "  ${baseGqlFields}\n";
    content += "`;\n\n";

    // Generate mutations
    let type = " ";
    content += `//  ${type}\n`;

    for (const op of operations) {
      if (type !== op.type) {
        content += `//  ${this._toPlural((type = op.type))}\n`;
      }

      const constName = this._toScreamingSnake(op.name);
      let paramsStr = "";
      let variablesStr = "";

      if (op.params.length > 0) {
        const paramDefs = op.params.map((p) => {
          let paramType = p.type;
          if (p.required) paramType += "!";
          return `$${p.name}: ${paramType}`;
        });

        paramsStr = paramDefs.join(", ");
        variablesStr = `(${paramsStr})`;
      }

      content += `export const ${constName} = gql\`\n`;
      content += `  ${type.toLowerCase()} ${op.name}${variablesStr}{\n`;
      content += `   ${op.name}`;

      if (op.params.length > 0) {
        const varList = op.params
          .map((p) => `${p.name}: $${p.name}`)
          .join(", ");
        content += `(${varList})`;
      }

      content += " {\n";
      //prettier-ignore
      if (op.returnType.includes("Page")) content += `      \${pageGqlFields(${camelName}GqlFields)}\n`;
      //prettier-ignore
      else if (op.returnType.includes("Boolean"))  content += `      \${booleanResponseGqlFields}\n`;
      //prettier-ignore
      else if (op.returnType.includes("String")) content += `      \${responseStringGqlFields}\n`;
      //prettier-ignore
      else if (op.returnType.startsWith("["))  content += `      \${${camelName}GqlFields}\n`;
      else content += `      \${responseGqlFields(${camelName}GqlFields)}\n`;

      let ctypes = [
        "booleanResponseGqlFields",
        "pageGqlFields",
        "responseGqlFields",
        "responseStringGqlFields",
      ];

      ctypes.forEach((type) => {
        if (content.includes(type) && !imports.includes(type)) {
          imports += `import { ${type} } from '@shared';\n`;
        }
      });

      content += "    }\n";
      content += "  }\n";
      content += " `;\n\n";
    }

    return imports + "\n" + content;
  }

  generateEntityListComp(entityName, operations, types, entityGroup) {
    const kebabName = this._toKebab(entityName);
    const kebabPlural = this._toPlural(kebabName);
    const titleName = this._toTitleCase(entityName);
    const titlePlural = this._toPlural(titleName);
    const entityPlural = this._toPlural(entityName);
    const camelName = this._toCamelCase(entityName);

    const entityGroup_ = !!entityGroup ? `${entityGroup}/` : ``;
    const listQueryName = this._getListQueryName(entityName, operations);
    const mainType = types.find((t) => t.name === entityName);

    let businessKeys = this._getBusinessKeys(mainType);
    let nameKeys = this._getNameKeys(mainType);

    let imports = "";
    imports += `import { Component, OnInit } from '@angular/core';\n`;
    imports += `import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';\n`;
    imports += `import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';\n`;
    imports += `import { BaseComponent } from '@common/components/base-componet/base-component';\n`;
    imports += `import { DataGridComponent } from '@common/components/data-grid/data-grid.component';\n`;
    imports += `import { PageHeaderComponent } from '@common/page-header.component';\n`;
    imports += `import { ${listQueryName} } from './${kebabName}.gql';\n`;
    imports += `import { ${camelName}UpsertBtn } from './${kebabName}.form';\n`;
    imports += `import { ${camelName}TableBtns, ${camelName}$ } from './${kebabName}.form';\n`;

    let content = "";
    content += `@Component({\n`;
    content += `  selector: 'app-${kebabPlural}',\n`;
    content += `  imports: [DataGridComponent, PageHeaderComponent],\n`;
    content += "  template: ` \n";
    content += `    <div class="flex-1 flex flex-col gap-3 ">\n`;
    content += `      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />\n`;
    content += `      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />\n`;
    content += `    </div>\n`;
    content += "  `,\n";
    content += `})\n`;
    content += `export class ${entityPlural}Component extends BaseComponent implements OnInit {\n`;
    content += `  override title: string = '${titlePlural} Management';\n`;
    content += `  override subtitle: string = '${titlePlural} List';\n`;
    content += `  override actionButtons: ActionButton[] = [${camelName}UpsertBtn(this)];\n`;
    content += "\n";

    content += `  gridParameter: GridParameter | undefined;\n`;
    content += "\n";

    //prettier-ignore
    content += `  keyColumns: GridKeyColumn[] = [${businessKeys.slice(0,6).map(k => "'"+k+"'").join(', ')}];\n`;
    content += "\n";

    content += `  ngOnInit(): void {\n`;
    content += `    this.setGridParameter();\n`;
    content += `  }\n`;
    content += "\n";

    content += `  setGridParameter() {\n`;
    content += `    this.gridParameter = {\n`;
    content += `      title: '${titlePlural}',\n`;
    content += `      icon: 'info_circle',\n`;
    content += `      keyColumns: this.keyColumns,\n`;
    content += `      actionButtons: ${camelName}TableBtns(this),\n`;
    content += `      reloadActions$: [${camelName}$],\n`;
    content += `      fetchParameter: { query: ${listQueryName} },\n`;
    content += `    };\n`;
    content += `  }\n`;
    content += `}\n`;
    content += "\n";

    return imports + `\n` + content;
  }

  generateFormFile(entityName, operations, types, entityGroup = undefined) {
    const kebabName = this._toKebab(entityName);
    const kebabPlural = this._toPlural(kebabName);
    const camelName = this._toCamelCase(entityName);
    const titleName = this._toTitleCase(entityName);
    const screamingSnake = this._toScreamingSnake(entityName);

    const entityGroup_ = !!entityGroup ? `${entityGroup}/` : ``;
    const inputType = this._getDtoTypeByEntityName(types, entityName, true);

    const deleteQueryName = this._getDeleteQueryName(entityName, operations);
    const createQueryName = this._getCreateQueryName(entityName, operations);

    let imports = "";
    let content = "";

    imports += `import { getDeleteBtnProps } from '@common/components/contents-view/view.helpers';\n`;
    imports += `import { getUpsertBtnProps } from '@common/components/contents-view/view.helpers';\n`;
    imports += `import { navigateRelativeTo } from '@common/components/contents-view/view.helpers';\n`;
    imports += `import { FieldConfig, FieldType } from '@common/components/generic-form/field.interface';\n`;
    imports += `import { VALIDATOR_REQUIRED } from '@common/components/generic-form/form-constants';\n`;
    imports += `import { FormComponent } from '@common/components/generic-form/form.component';\n`;
    imports += `import { FormParameters } from '@common/components/generic-form/form.interface';\n`;
    imports += `import { MORE_BTN } from '@common/table/data-grid-constants';\n`;
    imports += `import { ActionButton } from '@common/table/resusable-table-action-button-action-interface';\n`;
    imports += `import { BaseComponent } from '@common/components/base-componet/base-component';\n`;
    imports += `import { Subject } from 'rxjs';\n`;
    imports += `import { ${createQueryName}, ${deleteQueryName} } from './${kebabName}.gql';\n`;
    imports += `import { ${entityName} } from './${kebabName}.interface';\n`;

    //////////////

    let getFieldsContent = (fields) => {
      let fieldContent = "";

      fields?.forEach((field) => {
        let inputType = this._graphqlToFormType(field);
        let fieldContentExtra = "";
        let innerfieldContent = "";

        //prettier-ignore
        let isObjOrObjArray = !this._isGqlType(field.type) && !field.isEnum;

        if (isObjOrObjArray) {
          let typeName = field.type;
          let dtoType = this._getDtoType(types, typeName, true);
          let innerFields = dtoType?.fields ?? [];

          //prettier-ignore
          inputType = field.isArray ? 'FieldType.formGroupArray':'FieldType.formGroup';
          //prettier-ignore
          let contents_ = this._addTabsToEachLine(getFieldsContent(innerFields), 2, [0])

          innerfieldContent += `    fields:[\n`;
          innerfieldContent += `    ${contents_}`;
          innerfieldContent += `],\n`;
        }

        let textareas = ["description", "summary", "remark"];
        if (textareas.includes(field.name)) inputType = "FieldType.textarea";

        if (field.type)
          if (field.isEnum) {
            //handle enum population & import
            inputType = "FieldType.select";
            fieldContentExtra += `    options: enumToObjectArray(${field.type})`;

            if (!imports.includes("enumToObjectArray")) {
              imports += `import { enumToObjectArray } from '@common/utilities/object.helpers';\n`;
            }

            if (!imports.includes(field.type)) {
              imports += `import {  ${field.type}} from './${kebabName}.interface';\n`;
            }
          }

        //prettier-ignore
        if ( ["uid",'id'].includes(field.name)) fieldContentExtra += `    visible: false,\n`;

        if (["Uid", "Id"].some((str) => field.name.endsWith(str))) {
          inputType = "FieldType.select";
          //prettier-ignore
          let fieldType = field.name.charAt(0).toUpperCase() + field.name.slice(1,-3) // remove Uid
          //ignore imports TODO: work imports

          console.log(" ************************", fieldType);

          let listQuery = this._getListQueryNameFromAll(fieldType, true);

          //prettier-ignore
          let listQueryName =  listQuery?.constantName ?? `ALL_${this._toScreamingSnake(fieldType)}_PAGEABLE`;

          let typeDetails = ALL_TYPES.find((t) => t.name === fieldType);

          // "@store/entities/accounting/fee/fee.model.ts"
          //prettier-ignore
          let prefixPath = typeDetails?.path?.split("/")?.slice(0, -1)?.join("/");

          let kebab = this._toKebab(fieldType);

          //prettier-ignore
          let nameKeys =  typeDetails?.fields
          ?.filter( (f) =>  ["string", "number"].includes(f.type) && this._isNameKey(f.name))
          .map( f => f.name)

          let nameKeysStr = nameKeys?.map((k) => `"${k}"`).join(", ");

          //prettier-ignore
          // if (prefixPath)   imports += `import { map${fieldType} } from "${prefixPath}/${kebab}.selectors";\n`;
          //prettier-ignore
          if (listQuery) imports += `import {  ${listQueryName} } from "${listQuery.path.slice(0,-3)}";\n`;

          fieldContentExtra += `    optionsVariables : {\n`;
          fieldContentExtra += `      fetchParameter:{ query:${listQueryName} },\n`;
          //prettier-ignore
          // fieldContentExtra += `      mapFunction: (o:any) => ({...o }),\n`;
          //prettier-ignore
          // if (nameKeysStr)  fieldContentExtra += `      searchKeys: [${nameKeysStr}],\n`;
          // else  fieldContentExtra += `      searchKeys: [],// TODO: put in nameFields\n`;
          fieldContentExtra += `    }\n`;
        }

        let fulls = ["textarea", "FormGroup", "formGroup"];

        fieldContent += `  {\n`;
        fieldContent += `    key: "${field.name}",\n`;
        fieldContent += `    type: ${inputType},\n`;
        // prettier-ignore
        fieldContent += `    validations: ${field.required ? '[VALIDATOR_REQUIRED]':'[]'},\n`;
        // prettier-ignore
        if(fulls.some(s => inputType?.includes(s) )) fieldContent += `    class: "col-span-full",\n`;

        fieldContent += fieldContentExtra;
        fieldContent += innerfieldContent;
        fieldContent += `  },\n`;
      });

      return fieldContent;
    };

    content += `export const ${camelName}$ = new Subject<${entityName} | any>();\n`;
    content += `\n`;

    content += `export const get${entityName}FormFields = (comp: BaseComponent): FieldConfig[] => [\n`;
    content += getFieldsContent(inputType?.fields); // add the fields
    content += `];\n`;
    content += `\n`;

    content += `export const get${entityName}Form = (comp: BaseComponent, data?: any): FormParameters => ({\n`;
    content += `  fields: get${entityName}FormFields(comp),\n`;
    content += `  title: '${titleName}',\n`;
    content += `  model: data,\n`;
    content += `\n`;

    content += `   onSubmit: async (data: any) => {\n`;
    content += `     await comp.fs.fetch({\n`;
    content += `      notify: true,\n`;
    content += `      variables: { ${camelName}Dto: data },\n`;
    content += `      successFn: (res) => ${camelName}$.next(res?.data),\n`;
    content += `      mutation: ${createQueryName},\n`;
    content += `   });\n`;
    content += `   },\n`;
    content += ` });\n`;
    content += `\n`;

    content += ` export async function open${entityName}Form(comp: BaseComponent, ${camelName}?: any) {\n`;
    content += `  comp.vs?.openDialog({\n`;
    content += `    component: FormComponent,\n`;
    content += `    data: get${entityName}Form(comp, ${camelName}),\n`;
    content += `    width: '96%',\n`;
    content += `   maxWidth: '720px',\n`;
    content += `    closeAction$: ${camelName}$,\n`;
    content += `   });\n`;
    content += ` }\n`;
    content += `\n`;

    content += `export function ${camelName}ViewBtn(comp: BaseComponent) {\n`;
    content += `  return <ActionButton>{\n`;
    content += `    label: 'View ${titleName}',\n`;
    content += `    icon: 'view',\n`;
    content += `    click: (data: ${entityName}) => navigateRelativeTo(comp, '${kebabPlural}', data?.uid),\n`;
    content += `    permissions: [],\n`;
    content += `  };\n`;
    content += `}\n`;
    content += `\n`;

    content += `export function ${camelName}UpsertBtn(comp: BaseComponent) {\n`;
    content += `  return <ActionButton>{\n`;
    content += `    ...getUpsertBtnProps('${titleName}'),\n`;
    content += `    click: (data?: ${entityName}) => open${entityName}Form(comp, data),\n`;
    content += `    permissions: [],\n`;
    content += `  };\n`;
    content += `}\n`;
    content += `\n`;

    content += ` export function ${camelName}DeleteBtn(comp: BaseComponent) {\n`;
    content += `  return <ActionButton>{\n`;
    content += `    ...getDeleteBtnProps('${titleName}', 'name'),\n`;
    content += `    permissions: [],\n`;
    content += `\n`;

    content += `    click: async (data: ${entityName}) => {\n`;
    content += `      await comp.fs.fetch({\n`;
    content += `        notify: true,\n`;
    content += `        loadingOn: 'content',\n`;
    content += `        variables: { ${camelName}Uid: data.uid },\n`;
    content += `        finalFn: (res) => ${camelName}$.next(res?.data),\n`;
    content += `        mutation: ${deleteQueryName},\n`;
    content += `      });\n`;
    content += `    },\n`;
    content += `  };\n`;
    content += `}\n`;
    content += `\n`;

    content += `export function ${camelName}TableBtns(comp: BaseComponent) {\n`;
    content += `  return <ActionButton[]>[\n`;
    content += `    {\n`;
    content += `      ...MORE_BTN,\n`;
    content += `      buttons: [\n`;
    content += `        ${camelName}ViewBtn(comp),\n`;
    content += `        ${camelName}UpsertBtn(comp),\n`;
    content += `        ${camelName}DeleteBtn(comp),\n`;
    content += `      ],\n`;
    content += `    },\n`;
    content += `  ];\n`;
    content += `}\n`;
    content += `\n`;

    return imports + "\n" + content;
  }

  generateEntityComp(entityName, operations, types, entityGroup) {
    const kebabName = this._toKebab(entityName);
    const titleName = this._toTitleCase(entityName);
    const camelName = this._toCamelCase(entityName);

    const entityGroup_ = !!entityGroup ? `${entityGroup}/` : ``;
    const mainType = types.find((t) => t.name === entityName);
    let queryName = this._getSingleQueryName(entityName, operations);

    let imports = "";
    imports += `import { Component, OnInit } from "@angular/core";\n`;
    imports += `import { ANIMATION, QueryParameter, COMMON_FIELD_STRINGS, HIGHLIGHT  } from "@shared";\n`;
    imports += `import { ActionListener  } from "@shared";\n`;
    imports += `import { BaseComponent } from "@shared/view/base-component";\n`;
    imports += `import { cloneDeep } from "@apollo/client/utilities";\n`;
    imports += `import { ViewParameter } from "@shared/components/view-component/view-interface";\n`;
    imports += `import { ContentParameter } from "@shared/components/view-component/view-interface";\n`;
    imports += `import { get${entityName}UpsertButton } from "./${kebabName}.form";\n`;
    imports += `import { ${entityName}Actions } from "@store/entities/${entityGroup_}${kebabName}/${kebabName}.actions";\n`;
    imports += `import { ${entityName} } from "@store/entities/${entityGroup_}${kebabName}/${kebabName}.model";\n`;
    imports += `import { map${entityName} } from "@store/entities/${entityGroup_}${kebabName}/${kebabName}.selectors";\n`;

    //prettier-ignore
    if (queryName) imports += `import { ${queryName} } from "@store/entities/${entityGroup_}${kebabName}/${kebabName}.graphql";\n`;

    let content = "";
    content += `@Component({\n`;
    content += `  selector: "app-${kebabName}",\n`;
    //prettier-ignore
    content +="   template: "+ "`"+ `<view-component [viewParameter]="viewParameter"></view-component>`+ "`\n"
    content += `})\n`;
    content += `export class ${entityName}Component extends BaseComponent implements OnInit {\n`;
    content += `  title = "${titleName}";\n`;
    content += `  animation = ANIMATION;\n`;
    content += `  viewParameter: ViewParameter;\n\n`;

    content += `  ${camelName}: ${entityName};\n`;
    content += `  reloadActions = [ ${entityName}Actions.upsert${entityName} ];\n\n`;

    content += `  async ngOnInit(): Promise<void> {\n`;
    content += `    await this.loadData();\n`;
    content += `    this.setContentParameters();\n`;
    content += `    this.onNavigateToSelf(() => this.ngOnInit());\n`;
    content += `  }\n\n`;

    content += `  async loadData() {\n`;
    content += `    let query = ${queryName};\n`;
    content += `    let qp: QueryParameter = { mapFunction: map${entityName} };\n`;
    content += `    let uid = this.route.snapshot?.paramMap?.get("uid");\n`;
    content += `    this.${camelName} = cloneDeep(await this.fs.getData(qp, query, uid));\n`;
    content += `  }\n\n`;

    let nameKeys = this._getNameKeys(mainType);
    //prettier-ignore
    let highlightLine =   nameKeys?.length  ? "`"  +  nameKeys.join(', ')   + " valueClass(${HIGHLIGHT})`,\n": ''

    content += `  setContentParameters() {\n`;
    content += `    let data = {${camelName}Uid:this.${camelName}.uid};\n`;
    //prettier-ignore
    content += `    let subtitle = this.${camelName}.${this._getNameKeys(mainType)?.[0]};\n\n`;

    content += `    let contentsParameters: ContentParameter[] = [\n`;
    content += `      {\n`;
    content += `        icon: "item",\n`;
    content += `        type: "details",\n`;
    content += `        slug: "${kebabName}",\n`;
    content += `        name: subtitle,\n`;

    content += `        headerButtons: [get${entityName}UpsertButton(this, false, "edit")],\n`;
    content += `        entity: this.${camelName},\n\n`;
    content += `        fieldsStrings:[\n`;
    content += `          ${highlightLine}`;
    content += `          ...COMMON_FIELD_STRINGS,\n`;
    content += `        ],\n\n`;

    content += `        children: [\n`;

    let nonGqlTypes = this._getNonGraphQLTypes(mainType);
    //prettier-ignore
    let arrayFields = mainType.fields.filter((f) => f.isArray && nonGqlTypes.includes(f.type) );

    arrayFields.forEach((field) => {
      let type = field.type;
      //ignore imports TODO: work imports

      let listQuery = this._getListQueryNameFromAll(type);
      //prettier-ignore
      let listQueryName =  listQuery?.constantName ?? `ALL_${this._toScreamingSnake(type)}_PAGEABLE`;
      let typeDetails = ALL_TYPES.find((t) => t.name === type);

      // "@store/entities/accounting/fee/fee.model.ts" //dont put .ts if using @

      let prefixPath = typeDetails?.path?.split("/")?.slice(0, -1)?.join("/");
      let kebab = this._toKebab(type);

      // console.log(listQuery, prefixPath);

      if (prefixPath) {
        imports += `import { get${type}UpsertButton } from "./${kebab}.form";\n`;
        imports += `import { get${type}Buttons } from "./${kebab}.form";\n`;
        imports += `import { ${type}Actions } from "${prefixPath}/${kebab}.actions";\n`;
        imports += `import { ${type} } from "${prefixPath}/${kebab}.model";\n`;
        imports += `import { map${type} } from "${prefixPath}/${kebab}.selectors";\n`;
      }
      //prettier-ignore
      if (listQuery) imports += `import { ${listQueryName} } from "${listQuery.path} ";\n`;

      content += `          {\n`;
      content += `            type: "table",\n`;
      content += `            slug: "${this._toKebab(type)}",\n`;
      content += `            name: "${this._toTitleCase(type)}",\n`;
      content += `            icon: "item",\n`;
      //prettier-ignore
      content += `            columnsKeys: [${this._getBusinessKeys(mainType).slice(0,6).map(k => "'"+k+"'").join(', ')}],\n`;
      content += `            searchStatesValues: [{ key: "${camelName}.uid", value: this.${camelName}.uid }],\n`;
      content += `            mapFunction: map${type},\n`;
      content += `            actionButtons: get${type}Buttons(this, data),\n`;
      content += `            headerButtons: [get${type}UpsertButton(this, false, "add", data)], \n`;
      //prettier-ignore
      content += `            query: ${listQueryName}, //TODO: put query\n`;
      //prettier-ignore
      content += `            reloadActions: [${type}Actions.upsert${type}, ${type}Actions.delete${type}],\n`;
      content += `          },\n`;
    });

    content += `        ],\n`;
    content += `      },\n`;
    content += `    ];\n\n`;

    content += `    //set view\n`;
    content += `    this.viewParameter = {\n`;
    content += `      animation: this.animation,\n`;
    content += `      title: this.title,\n`;
    //prettier-ignore
    content += `      subtitle: subtitle,\n`;
    content += `      contentsParameters,\n`;
    content += `    };\n`;
    content += `  }\n\n`;

    content += `  listenToActions() {\n`;
    content += `    const listeners: ActionListener[] = [\n`;
    content += `      { actions: [...this.reloadActions], callback: () => this.loadData()},\n`;
    content += `    ];\n\n`;

    content += `    this.addActionListeners(listeners);\n`;
    content += `  }\n`;

    content += `}\n`;

    return imports + `\n` + content;
  }

  generateFiles(schema, outputDir = ".", entityName, groupName) {
    //get entities lop schema for entities

    const { types, operations } = this.parseGraphqlSchema(schema);

    //for now just use the first entity non enum non dto
    //later to do this, getMainTypes ->, getDtos, getEnums -> types , operates
    //prettier-ignore
    if (!entityName)  MAIN_TYPE = entityName = types.find((t) => !t.isEnum && !t.name.includes("Dto"))?.name;
    //prettier-ignore
    if (!entityName) MAIN_TYPE = entityName = types.find((t) => !t.isEnum && !t.name.includes("Dto"))?.name;
    //prettier-ignore
    if (!entityName) MAIN_TYPE = entityName = types.find((t) => !t.isEnum )?.name;
    if (!entityName) console.log("Entity Not Found");

    //set enumfields properly
    const modTypes = types.map((type) => ({
      ...type,
      fields: type.fields.map((field) => ({
        ...field,
        isEnum: !!types.find((t) => t.isEnum && t.name === field.type),
      })),
    }));

    //prettier-ignore
    console.log( "*****************************", entityName, "*******************************" );

    const kebabName = this._toKebab(entityName);
    const kebabPlural = this._toPlural(kebabName);
    const entityDir = path.join(outputDir, `${kebabName}`);

    const entityFiles = {
      //prettier-ignore
      [`${kebabName}.interfaces.ts`]: this.generateInterfaceFile(entityName, modTypes),
      //prettier-ignore
      [`${kebabName}.graphql.ts`]: this.generateGraphqlFile( entityName, operations, modTypes ),
      //prettier-ignore
      [`${kebabName}.form.ts`]: this.generateFormFile(entityName,operations, modTypes, groupName),
      //prettier-ignore
      [`${kebabName}.component.ts`]: this.generateEntityComp(entityName, operations, modTypes, groupName),
      //prettier-ignore
      [`${kebabPlural}.component.ts`]: this.generateEntityListComp(entityName, operations, modTypes,groupName),
    };

    const fileDirs = [{ dir: entityDir, files: entityFiles }];

    // Ensure output directory exists
    [outputDir, ...fileDirs.map((f) => f.dir)].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    fileDirs.forEach(({ dir, files }) => {
      for (const [filename, content] of Object.entries(files)) {
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, content, "utf8");
        console.log(`Generated: ${filepath}`);
      }
    });
  }
}

// CLI functionality
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    //prettier-ignore
    console.log( "Usage: node ngrx-generator.js <entity_name> <schema_file> [-o <output_dir>]"  );
    //prettier-ignore
    console.log(  "Example: node ngrx-generator.js TaxRate schema.graphql -o ./output" );
    process.exit(1);
  }

  const entityName = args[0];
  const schemaFile = args[1];

  let outputDir = ".";

  const outputIndex = args.indexOf("-o");
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputDir = args[outputIndex + 1];
  }

  try {
    const schema = fs.readFileSync(schemaFile, "utf8");
    const generator = new NgRxGenerator();
    generator.generateFiles(entityName, schema, outputDir);
    console.log(`\nSuccessfully generated NgRx files for ${entityName}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Module exports
function generateFromString(schema, outputDir = ".", entityName, groupName) {
  const generator = new NgRxGenerator();
  generator.generateFiles(schema, outputDir, entityName, groupName);
}

let ALL_TYPES = [];
let MAIN_TYPE = undefined;

// Run as CLI or example
if (require.main === module) {
  if (process.argv.length > 2) {
    main();
  } else {
    // Generate example files

    let schemas = ["schemas/schema.gql"];

    let contextPath = "X:/Work/WorkY/Apps/LSMIS/lsmis-frontend/src/app";
    ALL_TYPES = analyzeStoreTypes(contextPath);

    schemas.forEach((src) => {
      console.log(`Generating files for ${src} ...`);
      let schema = fs.readFileSync(src, "utf8");
      generateFromString(schema, "generated", undefined, "accounts");
      console.log(`files for ${src} Generated`);
    });
  }
}

module.exports = {
  NgRxGenerator,
  generateFromString,
  Field,
  TypeDef,
  Operation,
};
