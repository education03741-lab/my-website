const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "app", "(site)");

const replacements = [
  [/from\s+["']\.\.?\/(\.\.\/)*components\//g, 'from "@/app/components/'],
  [/from\s+["']\.\.?\/(\.\.\/)*data\//g, 'from "@/app/data/'],
  [/from\s+["']\.\.?\/(\.\.\/)*sanity\/lib\//g, 'from "@/sanity/lib/'],
  [/from\s+["']\.\.?\/(\.\.\/)*context\//g, 'from "@/app/context/'],
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      let content = fs.readFileSync(fullPath, "utf8");
      let original = content;
      for (const [pattern, replacement] of replacements) {
        content = content.replace(pattern, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Fixed imports in:", path.relative(__dirname, fullPath));
      }
    }
  }
}

if (!fs.existsSync(targetDir)) {
  console.error("Could not find app/(site) folder.");
  process.exit(1);
}

walk(targetDir);
console.log("Done.");
