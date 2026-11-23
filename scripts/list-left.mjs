import fs from "node:fs";

const rows = JSON.parse(
  fs.readFileSync(
    "C:/Users/aleja/AppData/Local/Temp/opencode/strings-clean.json",
    "utf8"
  )
);

fs.writeFileSync(
  "C:/Users/aleja/AppData/Local/Temp/opencode/strings-left.txt",
  rows.map((row) => `[${row.count}] ${row.text}  -> ${row.files[0]}`).join("\n"),
  "utf8"
);

console.log(rows.length);
