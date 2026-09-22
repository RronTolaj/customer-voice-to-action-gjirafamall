# Memo — Zëri i klientit → Veprim

**Për:** Head of Product, GjirafaMall
**Nga:** Rron Tolaj
**Data:** 22 shtator 2026
**Objekti:** 3 problemet kryesore nga 60 komente reale klientësh + veprimet e propozuara

**Përmbledhje:** Nga 60 komente publike (Google Play, App Store, Facebook, Google Maps), ~45%
janë pozitive — por ankesat përqendrohen te **tri tema**, të lidhura nga një hall i përbashkët:
**premtimet që nuk mbahen** (afati i dërgesës, "përgjigje brenda 30 sekondave", stabiliteti i app-it).
Këto tri janë ku fitohet ose humbet besimi.

---

### 1. Vonesa në dërgesa — dhe data që shtyhet pa njoftim  ·  12 komente (20%)

**Evidenca:** Kategoria negative #1. *"Dy jave vones ne porosi… premtohet posta falas… nuk zbatohet"*
(Rinon Sopi); *"Porosia vonohet dhe askush nuk jep pergjeresi"* (Drin Cocaj); *"advertised for the
arrival in 48 hour… it didn't came"* (Genci). Problemi kryesor s'është vetëm vonesa, por që afati i
premtuar shtyhet **pa lajmëruar** klientin.

**Fix:** (a) Shfaq në checkout një afat **realist** sipas stokut/lokacionit të shitësit, jo "48 orë"
optimiste; (b) njoftim automatik (SMS/push/email) **sa herë ndryshon** statusi ose data e porosisë.

**Ekipi:** Operations/Logistics (afati & procesi) + Product/Tech (njoftimet & shfaqja në checkout).

**Si e dimë për 3 muaj:** rritet **% e porosive që arrijnë brenda afatit** (on-time rate); bie drejt
**0** numri i porosive me datë të shtyrë **pa njoftim**; bien tiketat "ku është porosia" për 100 porosi.

---

### 2. Bugs & performancë e aplikacionit  ·  7 komente (12%)

**Evidenca:** *"versioni i ri shume lag"* (G M); *"app crash, a si keni prite me shum se 20 vete me u
kyqe?"* (crash gjatë promocioneve me trafik të lartë); *"Every search it gets stuck on iPhone"*
(Ljiljana66); *"spo i qet fotot e produkteve"* (Agron Musa). Disa lidhen me **ngarkesën** (promocione)
dhe me **iOS**.

**Fix:** (a) Një cikël i dedikuar stabiliteti — riprodho e rregullo crash-et më të raportuara
(kërkimi që ngec në iOS, fotot që s'ngarkohen); (b) **load/stress test** para promocioneve të mëdha.

**Ekipi:** Tech/Engineering (mobile).

**Si e dimë për 3 muaj:** rritet **crash-free session rate**; bien crash-et gjatë ngjarjeve
promocionale; rritet **rating-u i app-it** në App Store/Play; bien ankesat "app nuk punon/lag".

---

### 3. Shërbimi ndaj klientit — mungesë përgjigjeje, "fjalë boshe"  ·  3 komente (+ brenda ankesave të dërgesës)

**Evidenca:** *"no real communication, no effort to fix problems"* (Maxy WasHere); *"stafi… tu qesh,
tu bertit, si me qen kafe jo call center"* (404Heroo); *"veq arsyetime kot"*. App-i reklamon
*"përgjigje brenda 30 sekondave"* — realiteti nuk përputhet. Ky hall shfaqet **edhe brenda** komenteve
të dërgesës, pra prek më shumë se 3 komente.

**Fix:** (a) Vendos një **SLA real** për përgjigjen e parë + rregull eskalimi; (b) kur ka vonesë,
agjenti jep **hap konkret + datë të re**, jo justifikime (proces i qartë për rastet e vonesës).

**Ekipi:** Customer Care.

**Si e dimë për 3 muaj:** bie **koha e përgjigjes së parë**; rritet **% e tiketave të zgjidhura** brenda
afatit; rritet CSAT pas kontaktit; bie **% e tiketave të mbyllura pa zgjidhje**.
