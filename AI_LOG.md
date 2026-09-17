# AI / Automation Log

Detyra lejon përdorimin e mjeteve AI, me kusht që përdorimi të deklarohet dhe të tregohet
si u verifikua. Ky log e bën pikërisht atë — përfshirë rastet ku AI-ja **gaboi** dhe u korrigjua.

## Mjetet e përdorura
- **Claude (Claude Code)** — për kërkim në web, strukturim të dataset-it, shkrim të kodit
  (klasifikuesi, CLI-ja), dhe këtë dokumentacion.
- Browser i integruar — për të hapur e lexuar faqet publike (Google Play, App Store nëpër
  disa shtete, Facebook, Google Maps) prej nga u mblodhën komentet.

**Parimi:** AI-ja u përdor si asistent, jo si burim i së vërtetës. Çdo koment u lexua nga
faqja reale; çdo rregull u shkrua e u verifikua; çdo output u ekzekutua para se të pranohej.

---

## Ç'u bë me AI

### 1. Mbledhja e komenteve (Dita 1)
- Claude hapi faqet publike dhe nxori tekstin e review-ve.
- **Verifikim:** çdo koment u pa në burimin real; teksti u ruajt fjalë-për-fjalë (pa përkthim,
  pa "zbukurim"). Datat, burimi dhe rating-u u regjistruan siç ishin.

### 2. Kategorizimi manual (Dita 2)
- 60 komentet u etiketuan me dorë në 8 kategori. Këto etiketa janë **ground truth**.

### 3. Mjeti i kategorizimit (Dita 3)
- Klasifikues me rregulla fjalë-kyçe të peshuara (`classifier.js`), i ekzekutueshëm si
  CLI në Node (`classify.js`) dhe si demo në browser (`index.html`).
- **Verifikim:** `node classify.js` u ekzekutua realisht; output-i u krahasua me etiketat
  manuale → **53/60 (88%) përputhje**. 7 mospërputhjet janë raste ambigue (komente që
  prekin dy tema) dhe janë dokumentuar, jo fshehur.

---

## Ku AI-ja GABOI dhe si u kap

### Gabimi 1 — Rating-e dhe emra të pasaktë nga një screenshot i ChatGPT-së
Gjatë mbledhjes, u soll një screenshot me 10 "review nga App Store" i gjeneruar nga ChatGPT.
Kur u **verifikuan një-nga-një në App Store real**:
- Dy review (autorët *Fit-a* dhe *Hasan mehmeti*) ishin shënuar **5★**, por në realitet ishin **1★**
  (teksti ishte qartazi negativ).
- 7 nga 10 emra **nuk ekzistonin fare** në faqen e App Store — ishin halucinim.

**Veprimi:** u refuzua i gjithë screenshot-i si burim. U mbajtën vetëm 3 review që u panë
me sy në App Store, me rating-un e saktë. Mësimi: mos i beso output-it të një modeli pa e
kontrolluar te burimi parësor.

### Gabimi 2 — Korruptim teksti gjatë transferimit të të dhënave
Gjatë gjenerimit të CSV-së së kategorizuar, një raund enkodimi/dekodimi e ndryshoi fjalën
angleze **"product/products" → "produkt/produkts"** në 5 komente të Google Maps.
Teksti origjinal në `data/raw/` ishte i saktë; korruptimi ishte vetëm në skedarin e përpunuar.

**Si u kap:** komanda `node classify.js --check` krahason output-in e ri me atë të ruajtur;
mospërputhja e nxori menjëherë dallimin. CSV-ja u rigjenerua nga `data/raw/` (burimi autoritar)
dhe teksti u kthye i saktë. Mësimi: mbaj një burim të vetëm autoritar dhe një kontroll pariteti.

### Gabimi 3 — Mbikuptim i mundshëm te Google Maps
Review-t e Google Maps vijnë nga profili i përgjithshëm **"Gjirafa, Inc"**, jo nga një listim
i veçantë vetëm për GjirafaMall. U filtruan me dorë ato që flasin qartë për blerje online/
platformën, duke përjashtuar ato që përmendnin Gjirafa50 ose Gjirafa Travel. Kjo mbetet
një **kufizim metodologjik** i dokumentuar (shih README → Limitations), jo i fshehur.

---

## Vendime ku AI-ja NUK u pranua verbërisht
- Komentet për produkte individuale ("parfumi mban erë mirë") u **përjashtuan**, sepse detyra
  kërkon feedback për platformën, jo për artikuj të veçantë.
- Komentet "tag a friend" në TikTok u përjashtuan — nuk janë feedback real.
- Instagram nuk u përdor fare (kërkon login personal); kjo deklarohet hapur, nuk u shpik asgjë.
