function mergeFieldStrings(fieldsStrings) {
  const fieldMap = new Map();

  // Parse each field string and extract components
  fieldsStrings.forEach((fieldStr) => {
    const parts = fieldStr.trim().split(/\s+/);
    const fields = [];
    const modifiers = [];

    // Separate field names from modifiers
    for (const part of parts) {
      if (part.includes("(")) {
        modifiers.push(part);
      } else if (part === "as" || part === "pipe") {
        modifiers.push(part);
      } else if (
        modifiers.length > 0 &&
        (modifiers[modifiers.length - 1] === "as" ||
          modifiers[modifiers.length - 1] === "pipe")
      ) {
        modifiers.push(part);
      } else if (!part.endsWith(",")) {
        fields.push(part);
      }
    }

    // Process each field name
    fields.forEach((field) => {
      const cleanField = field.replace(/,/g, "");
      if (!fieldMap.has(cleanField)) {
        fieldMap.set(cleanField, {
          fieldName: cleanField,
          as: null,
          classes: [],
          valueClasses: [],
          pipe: null,
        });
      }

      const fieldData = fieldMap.get(cleanField);

      // Extract modifiers
      let i = 0;
      while (i < modifiers.length) {
        const mod = modifiers[i];

        if (mod === "as" && i + 1 < modifiers.length) {
          fieldData.as = modifiers[i + 1];
          i += 2;
        } else if (mod === "pipe" && i + 1 < modifiers.length) {
          fieldData.pipe = modifiers[i + 1].replace(/[()]/g, "");
          i += 2;
        } else if (mod.startsWith("class(")) {
          const classContent = mod.match(/class\(([^)]+)\)/)?.[1];
          if (classContent) fieldData.classes.push(classContent);
          i++;
        } else if (mod.startsWith("valueClass(")) {
          const valueClassContent = mod.match(/valueClass\(([^)]+)\)/)?.[1];
          if (valueClassContent) fieldData.valueClasses.push(valueClassContent);
          i++;
        } else {
          i++;
        }
      }
    });
  });

  // Build merged field strings
  const result = [];
  fieldMap.forEach((data) => {
    let fieldStr = data.fieldName;

    if (data.as) {
      fieldStr += ` as ${data.as}`;
    }

    if (data.valueClasses.length > 0) {
      fieldStr += ` valueClass(${data.valueClasses.join(" ")})`;
    }

    if (data.classes.length > 0) {
      fieldStr += ` class(${data.classes.join(" ")})`;
    }

    if (data.pipe) {
      fieldStr += ` pipe(${data.pipe})`;
    }

    result.push(fieldStr);
  });

  return result;
}

// Test
let fieldsStrings = [
  "financialYear, active, status valueClass(bg-white p-2 rounded-lg)",
  "description class(col-md-12)",
  "financialYear as Year pipe(number)",
  "status valueClass(text-warning)",
];

console.log(mergeFieldStrings(fieldsStrings));
