/*
 * classifier.js — motori i kategorizimit (rregulla fjalë-kyçe të peshuara)
 * ------------------------------------------------------------------------
 * I njëjti modul përdoret nga:
 *   - classify.js  (CLI me Node.js)
 *   - index.html   (demo interaktiv në browser)
 * Kështu rregullat jetojnë në NJË vend të vetëm — pa dyfishim, pa drift.
 *
 * Pesha e fjalëve:  2 = sinjal i fortë/specifik · 1 = i moderuar · 0.5 = i përgjithshëm/ambigu
 * Teksti normalizohet para krahasimit (shkronja të vogla, hiqen theksat: ç→c, ë→e),
 * prandaj fjalët-kyçe shkruhen në ASCII të vogël.
 */
(function (root) {
  "use strict";

  const RULES = {
    "Dergesa/Vonesa": [
      ["vones",2],["vonu",2],["vonoh",2],["vonon",2],
      ["derges",1],["dergon",1],["dergoj",1],["korier",2],["posta",0.5],
      ["porosi",1],["porosit",1],["nuk vjen",2],["prap nuk vjen",2],
      ["nuk arrin",2],["arrin brenda",1],["shtye",2],["shtyerje",2],
      ["14 dite",2],["dy jave",2],["2 jave",2],["3 jave",1],["tri jave",1],
      ["koha e dergeses",2],["delivery",2],["late delivery",2],["shipping",1],
      ["arrive",1],["arrival",2],["delay",2],["didn't came",2],["hasn't shown",2],
      ["anuluar",1],["anulova",1],["anulu",1]
    ],
    "App bugs/Performanca": [
      ["crash",2],["bug",2],["lag",2],["ngec",2],["dridh",2],["nuk punon",2],
      ["nuk fuksionon",2],["s'funksionon",2],["stuck",2],["gets stuck",2],
      ["glitch",2],["ngadal",2],["ngadalsum",2],["program i ngadal",2],
      ["update",1],["version",1],["versioni",1],["spo i qet fotot",2],
      ["fotot e produkteve",1],["uninstall",1],["aplikacion qe nuk",2],["iphone",0.5]
    ],
    "Sherbimi ndaj klientit": [
      ["customer care",2],["customer support",1],["customer service",1],
      ["support team",1],["sherbim",1],["sherbimi",1],["sherbimin",1],
      ["staf",2],["call center",2],["nuk pergjigjet",2],["pergjeresi",1],
      ["fjale boshe",2],["premtime boshe",2],["no communication",2],
      ["contacted support",2],["no help",2],["arsyetime",1],["kerkim falje",1],
      ["zgjidhje",1],["no effort",2]
    ],
    "Cilesia/Autenticiteti i produktit": [
      ["fallc",2],["origjinal",1],["origjinale",1],["trajnost",2],["damaged",2],
      ["without cable",2],["containing only",2],["no manual",2],["quality",0.5],
      ["kualitative",1],["fake",2],["nuk eshte ashtu",1]
    ],
    "Cmime & Zbritje": [
      ["cmim",2],["zbritje",1],["oferta",1],["popust",2],["discount",2],
      ["misleading prices",2],["kurse",1],["price",1],["extra discount",1]
    ],
    "Sugjerime": [
      ["duheni me bo",2],["duhet me",1],["bojeni",2],["sygjerim",2],["sugjerim",2],
      ["do me pelqente",2],["propozoj",1],["suggest",2],["te ishte me",2],
      ["do te ishte",1],["ndryshoje",1]
    ],
    "Pozitiv i pergjithshem": [
      ["perfekt",2],["super",1],["the best",2],["best",1],["excellent",2],
      ["amazing",2],["i mir",1],["e mir",1],["i mire",1],["e mire",1],["tmira",1],
      ["recommend",2],["rekomand",2],["faliminderit",1],["kenaqur",2],
      ["professional",1],["proffesional",1],["trustworthy",2],["i shpejt",1],
      ["te shpejt",1],["easy",1],["praktik",1],["lovely",2],["great",1],["xix",2],
      ["reliable",2],["10/10",2],["5 stars",2],["sigurt",1],["highly recommend",2],
      ["happy",1],["fast delivery",2],["mos hezitoni",1],["thanks",1],
      ["me i mire",2],["shum i mir",1],["shume mire",1]
    ]
  };

  // Prioriteti në barazim rezultati: problemet operacionale para pozitivit,
  // që mjeti të FLAG-ojë për shqyrtim njerëzor në vend që të supozojë "pozitiv".
  const PRIORITY = ["Dergesa/Vonesa","App bugs/Performanca","Sherbimi ndaj klientit",
    "Cilesia/Autenticiteti i produktit","Cmime & Zbritje","Sugjerime","Pozitiv i pergjithshem"];

  const CATS = PRIORITY.concat(["Tjeter/Paqarte"]);

  function normalize(s) {
    return (s == null ? "" : String(s)).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, ""); // heq theksat
  }

  function classify(text) {
    const t = normalize(text);
    const scores = {}, hits = {};
    for (const cat in RULES) {
      let s = 0; const matched = [];
      for (const pair of RULES[cat]) {
        const kw = pair[0], w = pair[1];
        if (w > 0 && t.includes(normalize(kw))) { s += w; matched.push(kw); }
      }
      scores[cat] = s; hits[cat] = matched;
    }
    let max = 0;
    for (const c in scores) if (scores[c] > max) max = scores[c];
    if (max === 0) {
      return { category: "Tjeter/Paqarte", confidence: "E ulet", reason: "asnjë fjalë-kyçe", scores };
    }
    const top = PRIORITY.filter(function (c) { return scores[c] === max; });
    const cat = top[0];
    const sorted = Object.keys(scores).map(function (k) { return scores[k]; }).sort(function (a, b) { return b - a; });
    const margin = max - (sorted[1] || 0);
    let conf = "E mesme";
    if (max >= 2 && margin >= 2) conf = "E larte";
    else if (max < 1 || top.length > 1) conf = "E ulet";
    return { category: cat, confidence: conf, reason: hits[cat].join(", ") || "—", scores };
  }

  const api = { RULES: RULES, PRIORITY: PRIORITY, CATS: CATS, normalize: normalize, classify: classify };

  if (typeof module !== "undefined" && module.exports) module.exports = api; // Node
  else root.Classifier = api;                                               // Browser
})(typeof self !== "undefined" ? self : this);
