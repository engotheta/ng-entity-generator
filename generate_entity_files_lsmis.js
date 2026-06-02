import * as fs from "fs";
// import { generateFromString } from "./generator/entity_generator.js";
// import { generateFromString } from "./generator/entity_generator_gasco.js";
import { generateFromString } from "./generator/entity_generator_lsmis.js";

let schemas = [
  "schemas/agreement-monitoring.gql",
  "schemas/milestone-challange.gql",
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
