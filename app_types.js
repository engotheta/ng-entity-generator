const fs = require("fs");
const path = require("path");

/**
 * Analyzes Angular store folder and extracts types with their queries/mutations
 * @param {string} projectPath - Absolute or relative path to Angular project
 * @returns {Array} List of analyzed types with their properties and queries
 */
function analyzeStoreTypes(projectPath, entitiesPath = "") {
  const storePath = path.join(projectPath, entitiesPath);

  if (!fs.existsSync(storePath)) {
    throw new Error(`Store folder not found at: ${storePath}`);
  }

  const results = [];
  const typeDefinitions = new Map(); // Store type definitions for matching
  const queryDefinitions = new Map(); // Store queries by file

  // Step 1: Recursively find all .model.ts and .graphql.ts files
  let modelsNames = ["model", "entity", "interface"];
  let gqlNames = ["graphql", "gql"];

  //prettier-ignore
  const modelFiles = modelsNames.reduce((f, n) => f.concat( findFiles(storePath, `.${n}.ts`)) ,[]);
  //prettier-ignore
  const graphqlFiles = gqlNames.reduce((f, n) => f.concat( findFiles(storePath, `.${n}.ts`)) ,[]);

  // Step 2: Parse model files for type definitions
  modelFiles.forEach((filePath) => {
    const types = parseModelFile(filePath, storePath);

    types.forEach((type, index) => {
      typeDefinitions.set(type.name, type);

      type.fields = type.fields.map((field) => ({
        ...field,
        isEnum: !!types.find((t) => t.kind === "enum" && t.name === field.type),
      }));

      results.push(type);
    });
  });

  // Step 3: Parse graphql files for queries/mutations
  graphqlFiles.forEach((filePath) => {
    const queries = parseGraphqlFile(filePath, storePath);
    queryDefinitions.set(filePath, queries);
  });

  // Step 4: Match queries/mutations to types
  results.forEach((type) => {
    if (type.kind === "interface" || type.kind === "class") {
      type.queries = findRelatedQueries(type, queryDefinitions);
    }
  });

  return results;
}

/**
 * Recursively find files with specific extension
 */
function findFiles(dir, extension) {
  let files = [];

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(findFiles(fullPath, extension));
    } else if (item.endsWith(extension)) {
      files.push(fullPath);
    }
  });

  return files;
}

/**
 * Parse model file and extract types
 */
function parseModelFile(filePath, storePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath =
    "@store/" + path.relative(storePath, filePath).replace(/\\/g, "/");
  const types = [];

  // Extract interfaces
  const interfaceRegex =
    /export\s+interface\s+(\w+)\s*(?:extends\s+[\w\s,<>]+)?\s*{([^}]*)}/gs;
  let match;

  while ((match = interfaceRegex.exec(content)) !== null) {
    const [, name, body] = match;
    types.push({
      name,
      kind: "interface",
      path: relativePath,
      fields: parseFields(body),
      queries: [],
    });
  }

  // Extract classes
  const classRegex =
    /export\s+class\s+(\w+)\s*(?:extends\s+[\w\s,<>]+)?(?:\s+implements\s+[\w\s,<>]+)?\s*{([^}]*)}/gs;

  while ((match = classRegex.exec(content)) !== null) {
    const [, name, body] = match;
    types.push({
      name,
      kind: "class",
      path: relativePath,
      fields: parseFields(body),
      queries: [],
    });
  }

  // Extract enums
  const enumRegex = /export\s+enum\s+(\w+)\s*{([^}]*)}/gs;

  while ((match = enumRegex.exec(content)) !== null) {
    const [, name, body] = match;
    types.push({
      name,
      kind: "enum",
      path: relativePath,
      fields: parseEnumFields(body),
    });
  }

  // Extract type aliases
  const typeRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;

  while ((match = typeRegex.exec(content)) !== null) {
    const [, name, definition] = match;
    types.push({
      name,
      kind: "type",
      path: relativePath,
      definition: definition.trim(),
      fields: [],
    });
  }

  return types;
}

/**
 * Parse fields from interface/class body
 */
function parseFields(body) {
  const fields = [];
  const fieldRegex = /(\w+)(\??):\s*([^;]+);/g;
  let match;

  while ((match = fieldRegex.exec(body)) !== null) {
    const [, name, optional, type] = match;
    fields.push({
      name,
      type: type.trim(),
      optional: optional === "?",
    });
  }

  return fields;
}

/**
 * Parse enum fields
 */
function parseEnumFields(body) {
  const fields = [];
  const fieldRegex = /(\w+)\s*=\s*(['"]?)([^,}\n]+)\2/g;
  let match;

  while ((match = fieldRegex.exec(body)) !== null) {
    const [, name, , value] = match;
    fields.push({
      name,
      value: value.trim(),
    });
  }

  return fields;
}

/**
 * Parse GraphQL file for query/mutation definitions
 */
function parseGraphqlFile(filePath, storePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath =
    "@store/" + path.relative(storePath, filePath).replace(/\\/g, "/");
  const queries = [];

  // Match export const QUERY_NAME = gql`...`
  const queryRegex =
    /export\s+const\s+(\w+)\s*=\s*gql`\s*(query|mutation)\s+(\w+)\s*(\([^)]*\))?\s*{[^}]*}/gs;
  let match;

  while ((match = queryRegex.exec(content)) !== null) {
    const [fullMatch, constName, type, name, params] = match;

    queries.push({
      constantName: constName,
      type,
      name,
      parameters: parseQueryParameters(params || ""),
      path: relativePath,
      definition: fullMatch.trim(),
    });
  }

  return queries;
}

/**
 * Parse query/mutation parameters
 */
function parseQueryParameters(paramsString) {
  const params = [];

  if (!paramsString || paramsString === "()") {
    return params;
  }

  // Remove parentheses and split by comma
  const paramStr = paramsString.slice(1, -1).trim();
  const paramRegex = /\$(\w+):\s*([^,]+)/g;
  let match;

  while ((match = paramRegex.exec(paramStr)) !== null) {
    const [, name, type] = match;
    params.push({
      name,
      type: type.trim(),
    });
  }

  return params;
}

/**
 * Find queries/mutations related to a type
 */
function findRelatedQueries(type, queryDefinitions) {
  const relatedQueries = [];
  const typeName = type.name.toLowerCase();

  queryDefinitions.forEach((queries, filePath) => {
    queries.forEach((query) => {
      const name = query.name.toLowerCase();

      // Check if query/mutation name contains type name
      // e.g., "Account" matches "allAccountsPageable", "createAccount", etc.
      if (
        name.includes(typeName) ||
        name.includes(typeName + "s") ||
        name.includes(typeName.slice(0, -1))
      ) {
        // Handle plurals
        relatedQueries.push(query);
      }
    });
  });

  return relatedQueries;
}

/**
 * Pretty print results
 */
function printResults(results) {
  console.log("\n=== STORE TYPE ANALYSIS ===\n");

  results.forEach((type) => {
    console.log(`\n${type.kind.toUpperCase()}: ${type.name}`);
    console.log(`Path: ${type.path}`);

    if (type.fields && type.fields.length > 0) {
      console.log("Fields:");
      type.fields.forEach((field) => {
        if (type.kind === "enum") {
          console.log(`  - ${field.name} = ${field.value}`);
        } else {
          console.log(
            `  - ${field.name}${field.optional ? "?" : ""}: ${field.type}`,
          );
        }
      });
    }

    if (type.definition) {
      console.log(`Definition: ${type.definition}`);
    }

    if (type.queries && type.queries.length > 0) {
      console.log("\nRelated Queries/Mutations:");
      type.queries.forEach((query) => {
        console.log(`  - ${query.type.toUpperCase()}: ${query.name}`);
        console.log(`    Constant: ${query.constantName}`);
        console.log(`    Path: ${query.path}`);
        if (query.parameters.length > 0) {
          console.log(`    Parameters:`);
          query.parameters.forEach((param) => {
            console.log(`      - $${param.name}: ${param.type}`);
          });
        }
      });
    }

    console.log("---");
  });
}

// Example usage
if (require.main === module) {
  // Get project path from command line or use current directory
  let path = "X:Work/WorkY/Apps/TLS/tls-frontend/src/app";
  const projectPath = process.argv[2] || path || process.cwd();

  try {
    const results = analyzeStoreTypes(projectPath);
    // printResults(results);

    // Optionally save to JSON file
    fs.writeFileSync("store-analysis.json", JSON.stringify(results, null, 2));
    console.log("\nResults saved to store-analysis.json");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = { analyzeStoreTypes, printResults };
