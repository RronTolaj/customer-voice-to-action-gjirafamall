# Customer Voice to Action — GjirafaMall

Use-case për Gjirafa: mbledh zërin e klientit, e organizon, ndërton një mjet që
përshpejton kategorizimin, dhe e kthen në gjetje e veprime.

**Produkti i zgjedhur:** GjirafaMall (platforma e blerjeve online).

---

## Objektivi

Qindra komente klientësh vijnë çdo muaj nga app-store, Facebook, Google, etj., por rrallë
lexohen në mënyrë sistematike. Ky projekt merr një kampion realist prej **60 komentesh reale
publike**, i kategorizon, dhe tregon se si një mjet i thjeshtë mund ta përshpejtojë këtë punë
nga qindra në mijëra komente — pa "AI kuti e zezë", me rregulla që kushdo mund t'i lexojë.

---

## Dataset-i

**60 komente reale, publike**, secili me: `Data · Burimi · Autori · Teksti · Vlerësimi`.

| Burimi | Komente |
|---|---:|
| Google Play | 19 |
| App Store (US, AL, CH, DE, IT, GB, MK) | 12 |
| Facebook | 16 |
| Google Maps (profili "Gjirafa, Inc") | 13 |
| **Gjithsej** | **60** |

Teksti është ruajtur **fjalë-për-fjalë** (pa përkthim, pa ndreqje drejtshkrimore) — përfshirë
gabimet e klientëve, sepse ato janë pjesë e të dhënave.

---

## Metodologjia (si u mblodhën)

1. U hapën faqet publike dhe u kopjuan komentet me tekst (jo vetëm yje).
2. U përjashtuan: komente për produkte individuale (jo për platformën), përmbajtje
   "tag a friend", dhe çdo gjë që nuk ishte feedback real.
3. Çdo koment u verifikua te burimi. Një burim i pasaktë (screenshot i gjeneruar nga një AI
   tjetër, me rating e emra të gabuar) u refuzua pas verifikimit — shih [AI_LOG.md](AI_LOG.md).

---

## Kategoritë (8)

`Pozitiv i pergjithshem` · `Dergesa/Vonesa` · `App bugs/Performanca` ·
`Sherbimi ndaj klientit` · `Cilesia/Autenticiteti i produktit` · `Cmime & Zbritje` ·
`Sugjerime` · `Tjeter/Paqarte`

Shpërndarja (etiketa manuale):

| Kategoria | Komente | % |
|---|---:|---:|
| Pozitiv i pergjithshem | 32 | 53% |
| **Dergesa/Vonesa** | **12** | **20%** |
| **App bugs/Performanca** | **7** | **12%** |
| Sherbimi ndaj klientit | 3 | 5% |
| Cilesia/Autenticiteti i produktit | 3 | 5% |
| Cmime & Zbritje | 1 | 2% |
| Sugjerime | 1 | 2% |
| Tjeter/Paqarte | 1 | 2% |

---

## Top 3 problemet (nga ky dataset)

1. **Dergesa/Vonesa — 12 komente (kategoria negative #1).** Porosi që vonohen javë të tëra,
   data që shtyhen pa njoftim. P.sh.: *"Dy jave vones ne porosi…"*, *"Extremely disappointed
   with delivery date… it didn't came."*
2. **App bugs/Performanca — 7.** App që ngec, dridhet, crash gjatë promocioneve. P.sh.:
   *"versioni i ri shume lag"*, *"app crash, a si keni prite me shum se 20 vete me u kyqe?"*
3. **Shërbimi ndaj klientit — 3** (baraz me Cilësia/Autenticiteti, 3). U zgjodh shërbimi sepse
   ankesa për mungesë përgjigjeje shfaqet edhe brenda komenteve të "Dërgesës" — pra ndikimi
   është më i gjerë se numri i vet. Ky është gjykim, i shënuar hapur për shqyrtim.

> ⚠️ 60 komente tregojnë **sinjale**, jo prova statistikore. Nuk nxjerrim përfundime shkakësore.

---

## Mjeti — si punon

Klasifikues me **rregulla fjalë-kyçe të peshuara**:

- Teksti normalizohet (shkronja të vogla; hiqen theksat: ç→c, ë→e).
- Për çdo kategori llogaritet një **rezultat** = shuma e peshave të fjalëve-kyçe që gjenden.
  Pesha: `2` = sinjal i fortë (p.sh. `crash`, `vones`), `1` = i moderuar, `0.5` = i përgjithshëm
  (p.sh. `app`, `posta`) që të mos mbizotërojë padrejtësisht.
- Fiton kategoria me rezultatin më të lartë. Në barazim, prioritet kanë problemet operacionale
  (mjeti **flag-on për shqyrtim** në vend që të supozojë "pozitiv"). Rezultat 0 → `Tjeter/Paqarte`.
- Jep edhe `Confidence` (E larte / E mesme / E ulet) dhe `Reason` (fjalët që u përputhën).

Rregullat jetojnë te [`classifier.js`](classifier.js) (të njëjtat i ka inline edhe `index.html`
sepse browser-i bllokon skriptet motër me `file://`; pariteti ruhet me `--check`).

---

## Si të ekzekutohet

**A) CLI me Node.js** (pa varësi të jashtme):
```bash
node classify.js
```
Lexon `data/raw/gjirafamall_komente.csv`, shkruan `data/processed/gjirafamall_komente_kategorizuara.csv`,
dhe printon raportin e validimit (përputhje %, mospërputhjet, shpërndarjen).

Verifiko riprodhueshmërinë (dështon nëse output-i ndryshon nga i ruajturi):
```bash
node classify.js --check
```

**B) Demo interaktiv në browser:** hap [`index.html`](index.html) me dopio-klik. Shfaq
përmbledhjen, shpërndarjen, saktësinë vs. manual, mospërputhjet, temat sipas burimit, dhe lejon
ngarkim të një CSV-je tjetër + eksport.

---

## Validimi (auto vs. manual)

Mjeti u krahasua me etiketat manuale (ground truth):

- **53/60 përputhen (88%).**
- 7 mospërputhje, të gjitha raste ambigue ku komenti prek dy tema (p.sh. një koment pozitiv që
  përmend "customer service", ose një ankesë që përzien vonesën me stafin). Të listuara në output.

Kjo është e qëllimshme: një mjet fjalë-kyçesh **nuk** duhet të jetë 100% — puna e tij është të
përshpejtojë triazhin, pastaj njeriu verifikon rastet kufitare.

---

## Struktura

```
.
├── index.html                  # demo interaktiv (self-contained, dopio-klik)
├── classifier.js               # motori i rregullave (burimi i vetëm i logjikës)
├── classify.js                 # CLI Node: raw → processed + raport + --check
├── data/
│   ├── raw/                     # dataset-i autoritar (etiketa manuale = ground truth)
│   │   └── gjirafamall_komente.csv
│   └── processed/               # i gjeneruar nga classify.js
│       └── gjirafamall_komente_kategorizuara.csv
├── AI_LOG.md                   # përdorimi i AI, verifikimet, gabimet e kapura
├── README.md
└── .gitignore
```

---

## Kufizimet

- **Kampion i vogël (60):** sinjale, jo statistikë përfaquesuese e të gjithë klientëve.
- **Instagram nuk u përdor** (kërkon login personal). **Reddit/forume:** s'u gjet diskutim
  specifik për GjirafaMall.
- **Google Maps** vjen nga profili i përgjithshëm "Gjirafa, Inc", i filtruar me dorë për
  relevancë — jo një listim vetëm i GjirafaMall.
- **Rregullat nuk kuptojnë kontekst/mohim/sarkazëm** (p.sh. "s'është i mirë"). Prandaj mjeti
  është ndihmës triazhi, jo zëvendësim i gjykimit njerëzor.
- Sentimenti i review-ve mund të jetë i njëanshëm (njerëzit shkruajnë më shumë kur janë shumë
  të kënaqur ose shumë të zhgënjyer).

---

## Përdorimi i AI

Shih [AI_LOG.md](AI_LOG.md) — përfshirë dy raste ku output-i i AI-së u gjet i gabuar dhe u
korrigjua (rating-e të pasakta nga një screenshot; korruptim teksti i kapur nga `--check`).
