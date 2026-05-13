/**
 * Entity Files Generator for Angular/TypeScript
 * Generates Entity's Comps, interface, gql file files from GraphQL schema definitions
 */

const fs = require("fs");
const path = require("path");
const { analyzeStoreTypes } = require("./app_types.js");
const { ALL } = require("dns");

let ID_KEY = "uuid";

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

class EntityGenerator {
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

    this.dtoSuffixes = [
      "DtoInput",
      "Dto",
      "Input",
      "RequestInput",
      "InputInput",
      "CreateDto",
      "CreateDtoInput",
      "UpdateDtoInput",
    ];

    this.dtoPrefix = ["create"];
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

  _getDtoTypeByEntityName(types, entityName, force = false) {
    //prettier-ignore
    let type = types.find((t) =>  this.dtoSuffixes.some((s) => t.name.endsWith(`${entityName}${s}`)));
    //prettier-ignore
    if(!type) type = types.find((t) =>  this.dtoPrefix.some((s) => t.name.startsWith(`${s}${entityName}`)));

    //prettier-ignore
    if (!type && force) type = this._getDtoType(types, `${entityName}${this.dtoSuffixes[0]}`, force);

    //prettier-ignore
    if(!type && force) type = types.find((t) =>  this.dtoSuffixes.some((s) => t.name.toLowerCase().includes(`${s.toLowerCase()}`)));

    if (!type && force) type = types[0];

    return type;
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
      let suffix =  this.dtoSuffixes.find(s => typeName.endsWith(s)) ?? '';
      let typeName_ = typeName.substring(0, typeName.length -  suffix.length );
      let subTypes = this._generateSubNames(typeName_).map(s => `${s}${suffix}`);
      // console.log('sdfdsfdsfdsfdsf ',typeName_, subTypes)
      let i = 0;
      //prettier-ignore
      for (  i = 0; i < subTypes.length && !dto; i++) dto = getType(subTypes[i]);
      console.log(subTypes?.[i - 1] );
    }

    return dto;
  }

  _getListOperationFromAll(entityName, force = false) {
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

  _getFindOperation(entityName, operations) {
    let entityTitle = this._toTitleCase(entityName);

    let queryPart = [
      `find${entityName}`,
      `get${entityName}By`,
      `view${entityName}`,
      `${entityName}By`,
      `get${entityName}`,
    ];

    //prettier-ignore
    let fOperations = operations?.filter((o) => {
     return queryPart.some(x => o.name.toLowerCase().includes(x.toLowerCase()))
    }).sort((a,b) => queryPart.findIndex(s => a.name.includes(s)) - queryPart.findIndex(s => b.name.includes(s)));

    let fOperation = fOperations?.[0];
    let titles = entityTitle.split(" ");

    if (!fOperation && titles.length >= 2) {
      for (const title of titles) {
        fOperation = this._getFindOperation(title, operations);
        if (!!fOperation) return fOperation;
      }
    }

    return fOperation;
  }

  _getFindOperationName(entityName, operations) {
    //prettier-ignore
    let fOperation = this._getFindOperation(entityName, operations);
    //prettier-ignore
    return !!fOperation ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getListOperation(entityName, operations) {
    let entityPlural = this._toPlural(entityName);
    let entityTitle = this._toTitleCase(entityName);

    let queryPart = [
      `${entityName}Pageable`,
      `${entityPlural}Pageable`,
      `all${entityName}`,
      `all${entityPlural}`,
      `getAll${entityPlural}`,
      `get${entityPlural}`,
      `search${entityName}`,
      `${entityPlural}`,
    ];

    //prettier-ignore
    let fOperations = operations?.filter((o) => {
       return queryPart.some(x => o.name.toLowerCase().includes(x.toLowerCase()))

      
      
     
    });

    fOperations =
      fOperations ??
      operations?.filter((o) => {
        let returnMatch =
          o.type === "Query" &&
          ["list", "page"].some((str) =>
            [str, entityName.toLowerCase()].every((s) =>
              o.returnType.toLowerCase().includes(s),
            ),
          );

        return returnMatch;
      });

    //prettier-ignore
    let fOperation = fOperations?.[0];
    let titles = entityTitle.split(" ");

    if (!fOperation && titles.length >= 2) {
      for (const title of titles) {
        //prettier-ignore
        fOperation = this._getListOperation(title, operations)
        if (!!fOperation) return fOperation;
      }
    }

    //prettier-ignore
    return  fOperation ;
  }

  _getListOperationName(entityName, operations) {
    let fOperation = this._getListOperation(entityName, operations);
    //prettier-ignore
    return  fOperation ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getOperationByVerbs(entityName, operations, verbs) {
    let entityPlural = this._toPlural(entityName);
    let entityTitle = this._toTitleCase(entityName);

    const entities = [entityName, entityPlural];
    //prettier-ignore
    const queryPart = verbs.flatMap((verb) => entities.map((entity) => `${verb}${entity}`));

    //prettier-ignore
    let fOperations = operations?.filter((o) => {
      let nameMatch = queryPart.some(x => o.name.toLowerCase().includes(x.toLowerCase()))
      return nameMatch  
    }).sort((a,b) => verbs.findIndex(v => a.name.includes(v)) - verbs.findIndex(v => b.name.includes(v)));

    let fOperation = fOperations?.[0];
    let titles = entityTitle.split(" ");

    if (!fOperation && titles.length >= 2) {
      for (const title of titles) {
        //prettier-ignore
        fOperation = this._getOperationByVerbs(title, operations, verbs)
        if (!!fOperation) return fOperation;
      }
    }

    return fOperation;
  }

  _getDeleteOperation(entityName, operations) {
    const verbs = ["delete", "remove"];
    return this._getOperationByVerbs(entityName, operations, verbs);
  }

  _getDeleteOperationName(entityName, operations) {
    let fOperation = this._getDeleteOperation(entityName, operations);
    //prettier-ignore
    return !!fOperation?.name ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getCreateOperation(entityName, operations) {
    const verbs = ["create", "add", "save", "createUpdate", "createOrUpdate"];

    return this._getOperationByVerbs(entityName, operations, verbs);
  }

  _getCreateOperationName(entityName, operations) {
    let fOperation = this._getCreateOperation(entityName, operations);
    //prettier-ignore
    return !!fOperation?.name ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _getUpdateOperation(entityName, operations) {
    const verbs = ["update"];
    return this._getOperationByVerbs(entityName, operations, verbs);
  }

  _getUpdateOperationName(entityName, operations) {
    let fOperation = this._getUpdateOperation(entityName, operations);
    //prettier-ignore
    return !!fOperation?.name ? this._toScreamingSnake(fOperation?.name) : undefined;
  }

  _removeTabsFromEachLine(str, tabCount = 1, skipedLines = []) {
    const tabs = " ".repeat(tabCount);
    if (!Array.isArray(skipedLines)) skipedLines = [skipedLines];

    return str
      ?.split("\n")
      .map((line, index) => {
        if (skipedLines.includes(index)) return line;

        // remove only the specified number of leading tabs
        if (line.startsWith(tabs)) {
          return line.slice(tabs.length);
        }

        // fallback → remove as many leading tabs as exist up to tabCount
        let removed = 0;
        let i = 0;

        while (removed < tabCount && line[i] === " ") {
          i++;
          removed++;
        }

        return line.slice(i);
      })
      .join("\n");
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
      Float: "FieldType.decimal",
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
      UUID: "string",
      Long: "number",
      Float: "number",
      Boolean: "boolean",
      LocalDateTime: "string",
      BigDecimal: "number",
      LocalDate: "string",
      OffsetDateTime: "string",
    };

    return typeMapping[graphqlType] || graphqlType;
  }

  _toSnake(name) {
    return (
      name
        // Replace separators with space
        ?.replace(/[-_\s]+/g, " ")
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
      ?.replace(/[-_\s]+/g, " ")
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
        ?.replace(/[-_]+/g, " ")
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
    return this._toSnake(name)?.toUpperCase();
  }

  _toCamelCase(str) {
    return (
      str
        // Replace non-alphanumeric separators with spaces
        ?.replace(/[-_]+/g, " ")
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
    if (!type) return [];
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

  GQL_TYPES = [
    "String",
    "Int",
    "Float",
    "Integer",
    "Boolean",
    "ID",
    "LocalDate",
    "LocalDateTime",
    "BigDecimal",
    "Long",
    "UUID",
    "OffsetDateTime",
    "Instant",
  ];

  _isGqlType(type) {
    const gqlScalars = new Set(this.GQL_TYPES);

    return gqlScalars.has(type);
  }

  _getNonGraphQLTypes(type) {
    let types = type.fields.filter((f) => !f.isEnum).map((field) => field.type);
    return types.filter((key) => !this._isGqlType(key));
  }

  generateInterfaceFile(entityName, types, includeNotInMain = true) {
    let types_ = [...types];
    // prettier-ignore
    if(!includeNotInMain) types_ = types_.filter(t => t.name.includes(entityName))

    const mainType = types_.find((t) => t.name === entityName);
    const enums = types_.filter((t) => t.isEnum);
    const inputs = types_.filter((t) => t.name.includes("Dto"));
    // prettier-ignore
    const otherTypes = types_.filter((t)=>  !t.name.includes('Dto') && !t.isEnum); // && !t.name.endsWith('Response')

    let imports = "";

    // ignoring base entity since no standards
    // let imports =  `import { BaseEntity } from "@shared/utilities/data.interfaces";\n`;

    let content = "";

    let addField = (field) => {
      const tsType = this._graphqlToTsType(field.type);
      // prettier-ignore
      if(!['string','number','boolean'].includes(tsType) && !types_.find(t => t.name === tsType)) {
        let otherType =  ALL_TYPES.find(t => t.name === tsType);
        //remove the .ts part
        if(!!otherType && !imports.includes(tsType)){
          imports +=`import { ${tsType} } from '${otherType.path.slice(0,-3)}'\n`
        };
      }
      const optional = field.required ? "" : "?";
      const tsType_ = field.isArray ? `${tsType}[]` : tsType;
      content += `  ${field.name}${optional}: ${tsType_};\n`;
    };

    //
    otherTypes.forEach((type) => {
      // content += `export interface ${type.name} extends BaseEntity {\n`;
      content += `export interface ${type.name} {\n`;

      //put all no reserving basefields // if (!this.baseFields.includes(field.name))
      let fields = type.fields;

      //merge some types ie. typeResponseType etc
      let typeRes = types_.find((t) => t.name === `${type.name}Response`);
      if (!!typeRes) {
        //prettier-ignore
        typeRes.fields.forEach(f => !fields.find(f_ => f_.name === f.name) && fields.push(f))
      }

      for (const field of fields) addField(field);

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

    let allTypes_ = [
      ...new Set(
        operations.map(
          (o) =>
            `${o.returnType
              .replace("Response_", "")
              .replace("Page_", "")
              .replace("List_", "")
              .replace("[", "")
              .replace("]", "")}=${o.returnType}`,
        ),
      ),
    ];

    let allReturnTypes = [];

    for (let str of allTypes_) {
      if (!allReturnTypes.find((s) => s.split("=")[0] === str.split("=")[0])) {
        allReturnTypes.push(str);
      }
    }

    // ignore types

    // sort longer to shorter
    allReturnTypes = allReturnTypes
      .sort((a, b) => b.length - a.length)

      .filter(
        (r) =>
          !this.GQL_TYPES.some(
            (t) => t.toLowerCase() === r.split("=")?.[0]?.toLowerCase(),
          ),
      )
      .filter(
        (r) =>
          !["page_"].some((t) =>
            r.split("=")?.[0]?.toLowerCase()?.startsWith(t.toLowerCase()),
          ),
      );

    //prettier-ignore
    console.log("--------------------Return Typers-------------------", allReturnTypes );

    let imports = `import { baseGqlFields } from '@shared/utilities/data.gql';\n`;
    imports += `import { gql } from '@apollo/client/core';\n`;
    imports += `import { responseGqlFields } from '@shared/utilities/data.gql';\n`;

    let content = ``;

    // Generate all Types seen in return type field list

    let initiatedTypes = [];

    for (const returnType of allReturnTypes) {
      const entityName_ = returnType.split("=")[0];
      const type_ = types.find((t) => t.name === entityName_);

      const camelName_ = this._toCamelCase(entityName_);

      //prettier-ignore
      // .filter((f) => !this.baseFields.includes(f.name)) // put the whole fields
      const fields = type_ ? type_.fields : [];

      if (fields.length) {
        initiatedTypes.push(returnType);

        content += `export const ${camelName_}GqlFields = \`\n`;

        for (const field of fields) {
          //prettier-ignore
          if (this._isGqlType(field.type) || field.isEnum)  content += `  ${field.name}\n`;
        else {
          
          //prettier-ignore
          let fieldType = types.find((t) => t.name === field.type) ??  ALL_TYPES.find((t) => t.name === field.type);
          let primitives = ["string", "boolean", "number",'UUID'];

          let keys =
            fieldType?.fields
              .filter((f) => primitives.includes(this._graphqlToTsType(f.type)))
              .map((f) => f.name)
              .filter((k) => !!this._isBusinessKey(k)) ?? [];

          keys = this._sortByReference(keys, this._getNameKeys(fieldType));
          // .filter((k) => !!this._isNameKey(k)) ?? [];

          // console.log(keys);
          let commonKeys = []; // ['uid']; // dont put uid for now
          let innerKeys = [...keys.slice(0, 6),...commonKeys]; //TODO: get innerFields by type in the whole context
        
          if(innerKeys.length){
            content += `  ${field.name}{\n`;
            innerKeys.forEach((key) => (content += `    ${key}\n`));
            content += `  }\n`;
          }
    
        }
        }

        // content += "  ${baseGqlFields}\n"; // avaoid put base
        content += "`;\n\n";
      }
    }

    //

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

      //set return type
      //prettier-ignore
      let entityName_ = initiatedTypes.find(a => op.returnType === a.split('=')[1] )?.split('=')?.[0];

      if (!entityName_) {
        //prettier-ignore
        entityName_ =  initiatedTypes.find((a) => op.returnType.includes(a.split("=")[0]))?.split("=")?.[0];
      }

      if (!entityName_ && initiatedTypes.length === 1) {
        entityName_ = initiatedTypes[0].split("=")[0];
      }

      console.log(
        "---------------------entityName------s-----",
        entityName_,
        op.returnType,
      );

      const camelName_ = this._toCamelCase(entityName_ ?? entityName);

      //prettier-ignore
      if (op.returnType.includes("Response_Page")) content += `      \${responseGqlFields(pageGqlFields(${camelName_}GqlFields))}\n`;
      else if (op.returnType.includes("Page")) content += `      \${pageGqlFields(${camelName_}GqlFields)}\n`;
      //prettier-ignore
      else if (op.returnType.includes("Boolean"))  content += `      \${plainResponseGqlFields}\n`;
      //prettier-ignore
      else if (op.returnType.includes("String")) content += `      \${plainResponseGqlFields}\n`;
      //prettier-ignore
      else if (op.returnType.startsWith("["))  content += `      \${${camelName_}GqlFields}\n`;
      else content += `      \${responseGqlFields(${camelName_}GqlFields)}\n`;

      let ctypes = [
        "plainResponseGqlFields",
        "pageGqlFields",
        "responseGqlFields",
      ];

      ctypes.forEach((type) => {
        if (content.includes(type) && !imports.includes(type)) {
          imports += `import { ${type} } from '@shared/fetch/graphql.constants';\n`;
        }
      });

      content += "    }\n";
      content += "  }\n";
      content += " `;\n\n";
    }

    return imports + "\n" + content;
  }

  generateEntityListComp(entityName, operations, types) {
    const kebabName = this._toKebab(entityName);
    const kebabPlural = this._toPlural(kebabName);
    const titleName = this._toTitleCase(entityName);
    const titlePlural = this._toPlural(titleName);
    const entityPlural = this._toPlural(entityName);
    const camelName = this._toCamelCase(entityName);

    const listQueryName = this._getListOperationName(entityName, operations);
    const mainType = types.find((t) => t.name === entityName);

    let businessKeys = this._getBusinessKeys(mainType);
    let nameKeys = this._getNameKeys(mainType);

    let imports = "";
    imports += `import { Component, OnInit } from '@angular/core';\n`;
    imports += `import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';\n`;
    imports += `import { BaseComponent } from '@shared/components/base-componet/base-component';\n`;
    imports += `import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';\n`;
    imports += `import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';\n`;
    imports += `import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';\n`;
    imports += `\n`;

    imports += `import { ${listQueryName} } from './${kebabName}.graphql';\n`;
    imports += `import { ${camelName}UpsertBtn } from './${kebabName}.form';\n`;
    imports += `import { ${camelName}TableBtns, ${camelName}$ } from './${kebabName}.form';\n`;

    let content = "";
    content += `@Component({\n`;
    content += `  selector: 'app-${kebabPlural}',\n`;
    content += `  imports: [DataGridComponent, PageHeaderComponent],\n`;
    content += "  template: ` \n";
    content += `    <div class="size-full flex-1 flex flex-col gap-3 ">\n`;
    content += `      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />\n`;
    content += `      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />\n`;
    content += `    </div>\n`;
    content += "  `,\n";
    content += `})\n`;
    content += `export class ${entityPlural}Component extends BaseComponent {\n`;
    content += `  override title: string = '${titlePlural} Management';\n`;
    content += `  override subtitle: string = '${titlePlural} List';\n`;
    content += `  override actionButtons: ActionButton[] = [${camelName}UpsertBtn(this)];\n`;
    content += "\n";

    //prettier-ignore
    content += `  keyColumns: GridKeyColumn[] = ['index',${businessKeys.slice(0,6).map(k => "'"+k+"'").join(', ')}, 'actions'];\n`;
    content += "\n";

    content += `  gridParameter: GridParameter = {\n`;
    content += `     title: this.route.snapshot.data['name'],\n`;
    content += `     icon: this.route.snapshot.data['icon'],\n`;
    content += `     keyColumns: this.keyColumns,\n`;
    content += `     actionButtons: ${camelName}TableBtns(this),\n`;
    content += `     reloadActions$: [${camelName}$],\n`;
    content += `     fetchParameter: { query: ${listQueryName} },\n`;
    content += `   };\n`;

    content += "\n";

    content += `}\n`;
    content += "\n";

    return imports + `\n` + content;
  }

  generateFormFile(entityName, operations, types) {
    const kebabName = this._toKebab(entityName);
    const kebabPlural = this._toPlural(kebabName);
    const camelName = this._toCamelCase(entityName);
    const titleName = this._toTitleCase(entityName);

    const inputType = this._getDtoTypeByEntityName(types, entityName, true);

    // console.log(
    //   "----------------------------input--------type-------",
    //   inputType,
    // );

    const mainType = types.find((t) => t.name === entityName);

    const idKey = mainType?.fields.find(
      (f) => !!["uuid", "uid"].find((s) => f.name.toLowerCase() === s),
    )?.name;

    const createOperation = this._getCreateOperation(entityName, operations);
    const deleteOperation = this._getDeleteOperation(entityName, operations);
    const updateOperation = this._getUpdateOperation(entityName, operations);

    const createOperationName = this._toScreamingSnake(createOperation?.name);
    const updateOperationName = this._toScreamingSnake(updateOperation?.name);
    const deleteOperationName = this._toScreamingSnake(deleteOperation?.name);

    let imports = "";
    let content = "";

    imports += `import { Subject } from 'rxjs';\n`;
    imports += `import { MORE_BTN } from '@shared/components/data-grid/data-grid.constants';\n`;
    imports += `import { FormComponent } from '@shared/components/generic-form/form.component';\n`;
    imports += `import { FormParameters } from '@shared/components/generic-form/form.interface';\n`;
    imports += `import { BaseComponent } from '@shared/components/base-componet/base-component';\n`;
    imports += `import { getDeleteBtnProps } from '@shared/components/view-component/view.helpers';\n`;
    imports += `import { getUpsertBtnProps } from '@shared/components/view-component/view.helpers';\n`;
    imports += `import { navigateRelativeTo } from '@shared/components/view-component/view.helpers';\n`;
    imports += `import { VALIDATOR_REQUIRED } from '@shared/components/generic-form/form-constants';\n`;
    imports += `import { FieldConfig, FieldType } from '@shared/components/generic-form/field.interface';\n`;
    imports += `import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';\n`;
    imports += `\n`;

    imports += `import { ${createOperationName}, ${deleteOperationName} } from './${kebabName}.graphql';\n`;

    if (updateOperationName) {
      imports += `import { ${updateOperationName}  } from './${kebabName}.graphql';\n`;
    }

    imports += `import { ${entityName} } from './${kebabName}.interface';\n`;

    //////////////
    content += `//Listener for all ${entityName} actions \n`;
    content += `export const ${camelName}$ = new Subject<${entityName} | any>();\n`;
    content += `\n`;

    content += `export const get${entityName}FormFields = (comp: BaseComponent): FieldConfig[] => [\n`;

    ////add the fields contents
    const fieldsContents = this.getFormFieldsContents(
      inputType?.fields,
      types,
      entityName,
    );

    content += fieldsContents[0]; // add the fields
    imports += fieldsContents[1]; // add the fields

    content += `];\n`;
    content += `\n`;

    content += `export function ${camelName}UpsertBtn(comp: BaseComponent):ActionButton {\n`;
    content += `  return {\n`;

    content += `    click: (data?: ${entityName}) => {\n`;
    content += `      const formParameter: FormParameters = {\n`;
    content += `        model: {...data},\n`;
    content += `        title: '${titleName}',\n`;
    content += `        fields: get${entityName}FormFields(comp),\n`;
    content += `        closeAction$: ${camelName}$,\n`;
    content += `\n`;

    let createVariables = `${createOperation?.params?.map((p) => `${p.name}:value`).join(", ")}`;

    let updateVariables = `${updateOperation?.params
      ?.map((p) =>
        ["id", "uid"].some((s) => p.name.endsWith(s))
          ? `${p.name}:data.${idKey}`
          : `${p.name}:value`,
      )
      .join(", ")}`;

    content += `        onSubmit: async (value: any) => {\n`;
    content += `          await comp.fs.fetch({\n`;
    content += `            notify: true,\n`;

    if (!updateOperationName) {
      content += `            variables: { ${createVariables}},\n`;
      content += `            mutation: ${createOperationName},\n`;
    } else {
      content += `            variables: !!data ? {${updateVariables}} : {${createVariables}},\n`;
      content += `            mutation: !!data ? ${updateOperationName} : ${createOperationName},\n`;
    }

    content += `            successFn: (res) => ${camelName}$.next(res?.data),\n`;
    content += `          });\n`;
    content += `        },\n`;
    content += `      };\n`;
    content += `\n`;
    content += `      comp.vs?.openModal(FormComponent, formParameter, '96%');\n`;
    content += `    },\n`;
    content += `    permissions: [],\n`;
    content += `    ...getUpsertBtnProps('${titleName}'),\n`;
    content += `  };\n`;
    content += `}\n`;
    content += `\n`;

    content += `export function ${camelName}ViewBtn(comp: BaseComponent):ActionButton {\n`;
    content += `  return {\n`;
    content += `    icon: 'view',\n`;
    content += `    label: 'View ${titleName}',\n`;
    content += `    click: (data: ${entityName}) => navigateRelativeTo(comp, '${kebabPlural}', data?.uid),\n`;
    content += `    permissions: [],\n`;
    content += `  };\n`;
    content += `}\n`;
    content += `\n`;

    let businessKeys = this._getBusinessKeys(mainType);
    let nameKeys = this._getNameKeys(mainType);

    content += ` export function ${camelName}DeleteBtn(comp: BaseComponent):ActionButton {\n`;
    content += `  return {\n`;

    content += `\n`;

    let variables = deleteOperation?.params
      ?.map((p) => `${p.name}:data.${idKey}`)
      .join(", ");

    let varsProps = !!deleteOperation ? variables : `${idKey}: data.${idKey}`;
    content += `    click: async (data: ${entityName}) => {\n`;
    content += `      await comp.fs.fetch({\n`;
    content += `        notify: true,\n`;
    content += `        loadingOn: 'content',\n`;
    content += `        variables: {${varsProps}},\n`;
    content += `        mutation: ${deleteOperationName},\n`;
    content += `        finalFn: (res) => ${camelName}$.next(res?.data),\n`;
    content += `      });\n`;
    content += `    },\n`;
    content += `    ...getDeleteBtnProps('${titleName}', '${nameKeys[0] ?? "name"}'),\n`;
    content += `    permissions: [],\n`;
    content += `  };\n`;
    content += `}\n`;
    content += `\n`;

    content += `export function ${camelName}TableBtns(comp: BaseComponent):ActionButton[] {\n`;
    content += `  return  [\n`;
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

  getFormFieldsContents(fields, types, entityName) {
    const kebabName = this._toKebab(entityName);

    let fieldContent = "";
    let imports = "";

    fields?.forEach((field) => {
      let inputType_ = this._graphqlToFormType(field);
      let fieldContentExtra = "";
      let innerfieldContent = "";

      //prettier-ignore
      let isObjOrObjArray = !this._isGqlType(field.type) && !field.isEnum;

      if (isObjOrObjArray) {
        let typeName = field.type;
        let dtoType = this._getDtoType(types, typeName, true);
        let innerFields = dtoType?.fields ?? [];

        //prettier-ignore
        inputType_ = field.isArray ? 'FieldType.formGroupArray':'FieldType.formGroup';

        // console.log(
        //   "-------------------innerFields--------------",
        //   typeName,
        //   innerFields,
        // );

        //TODO:  this cause infinite loop if there is a circular reference between types, need to handle it by keeping track of visited types and breaking the loop or limiting the depth
        //prettier-ignore
        let contents_ = '' ///this._addTabsToEachLine(this.getFormFieldsContents(innerFields, types)[0], 2, [0]);

        innerfieldContent += `    fields:[\n`;
        innerfieldContent += `    ${contents_}`;
        innerfieldContent += `],\n`;
      }

      let textareas = ["description", "summary", "remark"];
      if (textareas.includes(field.name)) inputType_ = "FieldType.textarea";

      let datesSuffix = ["Date", "At"];
      //prettier-ignore
      if ( datesSuffix.some(s => field.name.endsWith(s))) inputType_ = "FieldType.date";

      if (field.type)
        if (field.isEnum) {
          //handle enum population & import
          inputType_ = "FieldType.select";
          fieldContentExtra += `    options: enumToObjectArray(${field.type})`;

          if (!imports.includes("enumToObjectArray")) {
            imports += `import { enumToObjectArray } from '@shared/utilities/object.helpers';\n`;
          }

          if (!imports.includes(field.type)) {
            imports += `import {  ${field.type}} from './${kebabName}.interface';\n`;
          }
        }

      //prettier-ignore
      if ( ['uuid',"uid",'id'].includes(field.name)) fieldContentExtra += `    visible: false,\n`;

      if (["Uuid", "Uid", "Id"].some((str) => field.name.endsWith(str))) {
        inputType_ = "FieldType.select";
        //prettier-ignore
        let fieldType = field.name.charAt(0).toUpperCase() + field.name.slice(1,-3) // remove Uid
        //ignore imports TODO: work imports

        console.log(" ************************", fieldType);

        let listQuery = this._getListOperationFromAll(fieldType, true);

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
      fieldContent += `    type: ${inputType_},\n`;
      // prettier-ignore
      fieldContent += `    validations: ${field.required ? '[VALIDATOR_REQUIRED]':'[]'},\n`;
      // prettier-ignore
      if(fulls.some(s => inputType_?.includes(s) ) || (fields.length <= 4 && !fieldContentExtra.includes('visible: false'))){
        fieldContent += `    class: "col-span-full",\n`;
      }

      fieldContent += fieldContentExtra;
      fieldContent += innerfieldContent;
      fieldContent += `  },\n`;
    });

    return [fieldContent, imports];
  }

  generateEntityComp(entityName, operations, types) {
    const kebabName = this._toKebab(entityName);
    const titleName = this._toTitleCase(entityName);
    const camelName = this._toCamelCase(entityName);

    const mainType = types.find((t) => t.name === entityName);
    //prettier-ignore
    const findOperationName = this._getFindOperationName(entityName, operations);
    const findOperation = this._getFindOperation(entityName, operations);

    const businessKeys = this._getBusinessKeys(mainType);
    const nameKeys = this._getNameKeys(mainType);

    let nonGqlTypes = this._getNonGraphQLTypes(mainType);
    //prettier-ignore
    const arrayFields = mainType.fields.filter((f) => f.isArray && nonGqlTypes.includes(f.type) );

    let imports = "";

    //prettier-ignore

    imports += `import { Component, OnInit } from "@angular/core";\n`;
    imports += `import { CommonModule } from "@angular/common";\n`;
    imports += `import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";\n`;
    imports += `import { BaseComponent } from "@shared/components/base-componet/base-component";\n`;
    imports += `import { ContentParameter } from "@shared/components/view-component/view-interface";\n`;
    imports += `import { FetchParameter } from "@shared/fetch/fetch.interface";\n`;
    imports += `import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";\n`;
    imports += `import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";\n`;

    imports += `\n`;
    imports += `import { ${entityName} } from "./${kebabName}.interface";\n`;
    //prettier-ignore
    if (findOperationName) imports += `import { ${findOperationName} } from "./${kebabName}.graphql";\n`;
    imports += `import { ${camelName}UpsertBtn, ${camelName}$ } from "./${kebabName}.form";\n`;

    let content = "";
    content += `@Component({\n`;
    content += `  selector: 'app-${kebabName}.',\n`;
    content += `  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],\n`;
    content += "  template: `\n";
    content += `    <!--  -->\n`;
    content += `    <div class="size-full flex-1 flex flex-col gap-2">\n`;
    content += `      <page-header\n`;
    content += `        [title]="title"\n`;
    content += `        [subtitle]="subtitle"\n`;
    content += `        [actionButtons]="actionButtons"\n`;

    content += `        [data]="${camelName}"\n`;

    content += `      />\n`;

    content += `      <contents-view class="block grow" [contents]="contents" />\n`;
    content += `    </div>\n`;
    content += "   `\n";
    content += `})\n`;

    content += `export class ${entityName}Component extends BaseComponent implements OnInit {\n`;
    content += `  override title = '${titleName}';\n`;
    content += `  override subtitle = '${titleName} Management';\n`;

    content += `\n`;
    content += `  ${camelName}: ${entityName} | undefined;\n`;
    content += `  override contents: ContentParameter[] = [];\n`;

    content += `  override actionButtons: ActionButton[] = [${camelName}UpsertBtn(this)];\n`;
    content += `\n`;

    let uid = `this.route.snapshot?.paramMap?.get('${camelName}Uid')`;

    //prettier-ignore
    let variables = findOperation?.params?.map((p) => `${p.name}:${uid}`).join(", ");

    content += `  fetchParameter: FetchParameter = {\n`;
    content += `    loadingOn: 'no-content',\n`;
    content += `    query: ${findOperationName},\n`;
    content += `    successFn:(res) => this.title = res?.data?.${nameKeys?.[0] ?? "name"},\n`;
    content += `    variables: { ${!!findOperation ? variables : "uid:" + uid}},\n`;
    content += `  };\n`;
    content += `\n`;

    let items = this.getContentContents(entityName, mainType, arrayFields);
    imports += items[1];

    content += `  async ngOnInit(): Promise<void> {\n`;
    content += `    await this.setContents();\n`;
    content += `    this.subs.add(${camelName}$.subscribe(() => this.setContents()));\n`;
    content += `  }\n`;
    content += `\n`;

    content += `  async setContents() {\n`;
    content += `    this.${camelName} = await this.fs.fetch(this.fetchParameter);\n`;
    content += `\n`;

    content += items[0];
    content += `  }\n`;

    content += `\n`;
    content += `}\n`;
    //------------------------------------
    return imports + `\n` + content;
  }

  getContentContents(entityName, mainType, arrayFields) {
    const camelName = this._toCamelCase(entityName);
    let content = "";
    let imports = "";

    content += `    this.contents = [\n`;
    content += `      {\n`;
    content += `        type: 'details',\n`;
    content += `        icon: 'notes',\n`;
    content += `        showUndefined: true,\n`;
    content += `        entity: this.${camelName},\n`;
    content += `        fetchParameter: this.fetchParameter,\n`;

    if (arrayFields.length) {
      //prettier-ignore
      let items =   this.getEntityChildrenContents(entityName, mainType, arrayFields)
      content += items[0];
      imports += items[1];
    }

    content += `      },\n`;
    content += `    ];\n`;

    return [content, imports];
  }

  getEntityChildrenContents(entityName, mainType, arrayFields) {
    const camelName = this._toCamelCase(entityName);

    if (!arrayFields.length) return "";
    let content = "";
    let imports = "";

    content += `        children: [\n`;

    arrayFields.forEach((field) => {
      const childEntityName = field.type;
      const childCamel = this._toCamelCase(childEntityName);
      const childTitle = this._toTitleCase(childEntityName);
      const childKebab = this._toKebab(childEntityName);
      //ignore imports TODO: work imports

      const childListOp = this._getListOperationFromAll(childEntityName);
      //prettier-ignore
      const childListOpName =  childListOp?.constantName ?? undefined;
      //prettier-ignore
      const childTypeDetails = ALL_TYPES.find((t) => t.name === childEntityName);
      //prettier-ignore
      let childPrefixPath = childTypeDetails?.path?.split("/")?.slice(0, -1)?.join("/");

      if (childPrefixPath) {
        imports += `import { ${childEntityName}UpsertBtn } from "./${childKebab}.form";\n`;
        imports += `import { ${childEntityName}TableBtns } from "./${childKebab}.form";\n`;
        imports += `import { ${childEntityName} } from "${childPrefixPath}/${childKebab}.interface";\n`;
      }
      //prettier-ignore
      if (childListOp) imports += `import { ${childListOpName} } from "${childListOp.path} ";\n`;

      let uid = `this.route.snapshot?.paramMap?.get('${camelName}Uid')`;
      //prettier-ignore
      // let childVariables = findOperation?.params?.map((p) => `${p.name}:${uid}`).join(", ");
      let childDefaultVar = `uid:${uid}`;

      // console.log("----------child-------------------", childTypeDetails);

      const businessKeys = this._getBusinessKeys(childTypeDetails);

      content += `          {\n`;
      content += `            type: "table",\n`;
      content += `            slug: "${childKebab}",\n`;
      content += `            label: "${childTitle}",\n`;
      content += `            icon: "circle",\n`;
      //prettier-ignore
      content += `            keyColumns: [${businessKeys.slice(0,6).map(k => "'"+k+"'").join(', ')}],\n`;
      // content += `            headerButtons: [ ${childCamel}UpsertBtn(this) ], \n`;
      // content += `            actionButtons: ${childCamel}TableBtns(this),\n`;
      // content += `            reloadActions$: [${childCamel}$],\n`;
      // content += `            fetchParameter: { query: ${childListOpName}, variables:{${childVariables ? variables : childDefaultVar}} },\n`;
      content += `            gridData: this.${camelName}?.${field.name} ?? [],\n`;
      content += `          },\n`;
    });

    content += `        ],\n`;

    return [content, imports];
  }

  generateFiles(schema, outputDir = ".", entityName) {
    //get entities lop schema for entities

    const { types, operations } = this.parseGraphqlSchema(schema);

    //for now just use the first entity non enum non dto
    //later to do this, getMainTypes ->, getDtos, getEnums -> types , operates

    if (!entityName) {
      MAIN_TYPE = entityName = types.find(
        (t) =>
          !t.isEnum &&
          !["dto", "input"].some((s) => t.name.toLowerCase().includes(s)),
      )?.name;
    }

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

    ALL_TYPES = [...modTypes, ...ALL_TYPES];

    //prettier-ignore
    console.log( "*****************************",  entityName,  "*******************************",  );

    const kebabName = this._toKebab(entityName);
    const kebabPlural = this._toPlural(kebabName);
    const entityDir = path.join(outputDir, `${kebabPlural}`);

    const entityFiles = {
      //prettier-ignore
      [`${kebabName}.graphql.ts`]: this.generateGraphqlFile( entityName, operations, modTypes ),
      //prettier-ignore
      [`${kebabName}.form.ts`]: this.generateFormFile(entityName,operations, modTypes  ),
      //prettier-ignore
      [`${kebabName}.component.ts`]: this.generateEntityComp(entityName, operations, modTypes ),
      //prettier-ignore
      [`${kebabPlural}.component.ts`]: this.generateEntityListComp(entityName, operations, modTypes ),
      //prettier-ignore
      [`${kebabName}.interface.ts`]: this.generateInterfaceFile(entityName, modTypes),
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
    const generator = new EntityGenerator();
    generator.generateFiles(entityName, schema, outputDir);
    console.log(`\nSuccessfully generated NgRx files for ${entityName}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Module exports
//prettier-ignore
function generateFromString(schema, outputDir = ".", entityName, projectAppPath ) {
  if(!projectAppPath) projectAppPath= "X:/Work/WorkY/Apps/GASCO/gasco-frontend/src/app";
  ALL_TYPES = analyzeStoreTypes(projectAppPath);
  // console.log(ALL_TYPES);

  const generator = new EntityGenerator();
  generator.generateFiles(schema, outputDir, entityName);
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

    schemas.forEach((src) => {
      console.log(`Generating files for ${src} ...`);
      let schema = fs.readFileSync(src, "utf8");
      generateFromString(schema, "generated", undefined, undefined);
      console.log(`files for ${src} Generated`);
    });
  }
}

module.exports = {
  EntityGenerator,
  generateFromString,
  Field,
  TypeDef,
  Operation,
};
