import * as fs from "fs";
import * as path from "path";
// import { generateFromString } from "./generator/entity_generator.js";
import { generateFromString } from "./generator/entity_generator_gasco.js";

// can be file or folder
const schemas = ["schemas/current"];

const outputDir = "generated";

function processFile(path) {
  console.log(`Generating files for ${path} ...`);
  const fileContent = fs.readFileSync(path, "utf8");

  // Split the file content into entries using a separator (e.g., "-----")
  const entries = fileContent
    .split(/-{10,}/g)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  entries.forEach((entry, i) => {
    let msg = `Processing entry ${i + 1}/${entries.length} from ${path}...`;
    console.log(msg);
    generateFromString(entry, outputDir);
  });

  console.log(`Files for ${path} generated`);
}

function getGqlFilesFromFolder(folderPath) {
  const files = [];
  const items = fs.readdirSync(folderPath).sort();

  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) files.push(...getGqlFilesFromFolder(fullPath));
    else if (stat.isFile() && fullPath.endsWith(".gql")) files.push(fullPath);
  }

  return files;
}

function processPath(src) {
  if (!fs.existsSync(src)) return console.warn(`Path not found: ${src}`);

  const stat = fs.statSync(src);
  if (stat.isFile()) return processFile(src);

  if (stat.isDirectory()) {
    console.log(`Reading folder recursively: ${src}`);
    const gqlFiles = getGqlFilesFromFolder(src);
    gqlFiles.forEach((filePath) => processFile(filePath));
    return;
  }

  console.warn(`Skipped unsupported path: ${src}`);
}

schemas.forEach((src) => processPath(src));
