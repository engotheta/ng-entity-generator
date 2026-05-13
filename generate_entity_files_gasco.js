import * as fs from "fs";
// import { generateFromString } from "./generator/entity_generator.js";
import { generateFromString } from "./generator/entity_generator_gasco.js";

let schemas = [
  "schemas/plant-water-reading.gql",
  "schemas/plant-export-reading.gql",
  "schemas/plant-received-data.gql",
];

schemas.forEach((src) => {
  console.log(`Generating files for ${src} ...`);

  const fileContent = fs.readFileSync(src, "utf8");

  // Split by 10 or more consecutive dashes
  const entries = fileContent
    .split(/-{10,}/g)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  entries.forEach((entry, index) => {
    console.log(`Processing entry ${index + 1}...`);
    generateFromString(entry, "generated");
  });

  console.log(`Files for ${src} generated`);
});
