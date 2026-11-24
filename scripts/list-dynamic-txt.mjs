import fs from "node:fs";

const rows = JSON.parse(
  fs.readFileSync("C:/Users/aleja/AppData/Local/Temp/opencode/dynamic-left.json", "utf8")
);

fs.writeFileSync(
  "C:/Users/aleja/AppData/Local/Temp/opencode/dynamic-left.txt",
  rows
    .map((row) => `${row.file}:${row.line} [${row.kind}] ${row.text}`)
    .join("\n"),
  "utf8"
);
