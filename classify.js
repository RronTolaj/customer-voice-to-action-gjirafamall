#!/usr/bin/env node
/*
 * classify.js — CLI që kategorizon feedback-un e klientëve dhe e krahason
 *               me etiketat manuale (ground truth).
 *
 * Përdorimi:
 *   node classify.js                          # përdor shtigjet default
 *   node classify.js --input data/raw/x.csv --output data/processed/y.csv
 *   node classify.js --check                  # dështon nëse output ndryshon nga ai i ruajtur (parity/CI)
 *
 * Kërkon vetëm Node.js standard — asnjë varësi e jashtme.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { classify, CATS, PRIORITY } = require("./classifier.js");

// ---------- CSV utils (pa varësi) ----------
function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const rows = []; let field = "", row = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift().map(function (h) { return h.trim(); });
  return rows.filter(function (r) { return r.length > 1 || r[0]; })
    .map(function (r) { const o = {}; head.forEach(function (h, i) { o[h] = r[i] !== undefined ? r[i] : ""; }); return o; });
}
function csvCell(v) { v = (v == null ? "" : String(v)); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
function toCSV(rows, cols) {
  return cols.join(",") + "\n" + rows.map(function (r) { return cols.map(function (c) { return csvCell(r[c]); }).join(","); }).join("\n");
}

// ---------- Argumentet ----------
function arg(name, def) { const i = process.argv.indexOf(name); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const INPUT = arg("--input", path.join("data", "raw", "gjirafamall_komente.csv"));
const OUTPUT = arg("--output", path.join("data", "processed", "gjirafamall_komente_kategorizuara.csv"));
const CHECK = process.argv.indexOf("--check") > -1;

// ---------- Përpuno ----------
const raw = fs.readFileSync(INPUT, "utf8");
const data = parseCSV(raw);
const OUT_COLS = ["Data","Burimi","Autori","Teksti","Vleresimi","Kategoria_Manuale","Kategoria_Auto","Confidence","Reason","Perputhet"];

const out = data.map(function (r) {
  const res = classify(r.Teksti);
  const manual = r.Kategoria || r.Kategoria_Manuale || "";
  return {
    Data: r.Data, Burimi: r.Burimi, Autori: r.Autori, Teksti: r.Teksti, Vleresimi: r.Vleresimi,
    Kategoria_Manuale: manual,
    Kategoria_Auto: res.category,
    Confidence: res.confidence,
    Reason: res.reason,
    Perputhet: (manual && manual === res.category) ? "1" : "0"
  };
});

const csv = "﻿" + toCSV(out, OUT_COLS);

// ---------- Modaliteti --check (parity/CI) ----------
if (CHECK) {
  if (!fs.existsSync(OUTPUT)) { console.error("CHECK dështoi: mungon " + OUTPUT); process.exit(1); }
  const existing = fs.readFileSync(OUTPUT, "utf8");
  const norm = function (s) { return s.replace(/\r\n/g, "\n"); }; // tolerant ndaj CRLF/LF
  if (norm(existing) === norm(csv)) { console.log("✓ CHECK: output-i përputhet me " + OUTPUT); process.exit(0); }
  else { console.error("✗ CHECK: output-i NUK përputhet me skedarin e ruajtur (rregullat kanë ndryshuar?)"); process.exit(1); }
}

// ---------- Shkruaj ----------
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, csv);

// ---------- Raporti i validimit ----------
const total = out.length;
const withManual = out.filter(function (r) { return r.Kategoria_Manuale; });
const agree = withManual.filter(function (r) { return r.Perputhet === "1"; }).length;
const acc = withManual.length ? (100 * agree / withManual.length).toFixed(1) : "0";

function dist(key) { const c = {}; out.forEach(function (r) { const v = r[key]; if (v) c[v] = (c[v] || 0) + 1; }); return c; }
const man = dist("Kategoria_Manuale"), auto = dist("Kategoria_Auto");

console.log("");
console.log("  Customer Voice to Action — raporti i kategorizimit");
console.log("  " + "-".repeat(56));
console.log("  Input:   " + INPUT);
console.log("  Output:  " + OUTPUT);
console.log("  Komente: " + total + "   |   me etiketë manuale: " + withManual.length);
console.log("  Përputhje auto vs. manual: " + agree + "/" + withManual.length + "  (" + acc + "%)");
console.log("");
console.log("  Kategoria                            Manual   Auto");
console.log("  " + "-".repeat(56));
CATS.forEach(function (c) {
  if (!man[c] && !auto[c]) return;
  console.log("  " + c.padEnd(36) + String(man[c] || 0).padStart(5) + String(auto[c] || 0).padStart(7));
});
console.log("");
const mism = withManual.filter(function (r) { return r.Perputhet === "0"; });
console.log("  Mospërputhjet (" + mism.length + "):");
mism.forEach(function (r) {
  console.log("   • " + (r.Autori || "?").padEnd(22) + " manual=" + r.Kategoria_Manuale + "  →  auto=" + r.Kategoria_Auto + "  [" + r.Reason + "]");
});
console.log("");
console.log("  Shënim: etiketat manuale janë ground truth; auto është eksperimental.");
console.log("  U shkrua: " + OUTPUT);
console.log("");
