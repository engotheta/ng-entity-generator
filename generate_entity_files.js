import * as fs from "fs";
import { generateFromString } from "./generator/entity_generator.js";

let schemas = ["schemas/schema.gql"];

schemas.forEach((src) => {
  console.log(`Generating files for ${src} ...`);
  let schema = fs.readFileSync(src, "utf8");
  generateFromString(schema, "generated");
  console.log(`files for ${src} Generated`);
});
