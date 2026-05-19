# Personnel Service History Source Notes

## Purpose

This note defines how `statement of service` or equivalent assignment-history records should be extracted for the project.

Use this layer for `historical service periods and designation history`, not for the current public profile card by itself.

## Inspected Sample Sources

- [Benito, John Michael Laxamana.xlsx](/Users/johnmichaell.benito/Downloads/Benito,%20John%20Michael%20Laxamana.xlsx)
- [Babasoro, Kier Benson Garcia.xlsx](/Users/johnmichaell.benito/Downloads/Babasoro,%20Kier%20Benson%20Garcia.xlsx)
- [Cadaba, Jeferson Colobong.xlsx](/Users/johnmichaell.benito/Downloads/Cadaba,%20Jeferson%20Colobong.xlsx)
- [Caras, Arcille Mae Yabut.xlsx](/Users/johnmichaell.benito/Downloads/Caras,%20Arcille%20Mae%20Yabut.xlsx)
- [Enriquez, Jay-Son Ballesteros.xlsx](/Users/johnmichaell.benito/Downloads/Enriquez,%20Jay-Son%20Ballesteros.xlsx)
- [FO1 MM AQUINO.xlsx](/Users/johnmichaell.benito/Downloads/FO1%20MM%20AQUINO.xlsx)
- [FO2 RC MARIANO.xlsx](/Users/johnmichaell.benito/Downloads/FO2%20RC%20MARIANO.xlsx)
- [FO2 RL CARILLA JR.xlsx](/Users/johnmichaell.benito/Downloads/FO2%20RL%20CARILLA%20JR.xlsx)
- [FO2 WN ORIL JR.xlsx](/Users/johnmichaell.benito/Downloads/FO2%20WN%20ORIL%20JR.xlsx)
- [FO3 MP BITANTES.xlsx](/Users/johnmichaell.benito/Downloads/FO3%20MP%20BITANTES.xlsx)
- [Lalica, Alvin Ramos.xlsx](/Users/johnmichaell.benito/Downloads/Lalica,%20Alvin%20Ramos.xlsx)
- [Montero, Melanie Grospe.xlsx](/Users/johnmichaell.benito/Downloads/Montero,%20Melanie%20Grospe.xlsx)
- [Palis, Jan Kriztoff Sarmiento.xlsx](/Users/johnmichaell.benito/Downloads/Palis,%20Jan%20Kriztoff%20Sarmiento.xlsx)
- [Rimando, Jovie Jov Badua.xlsx](/Users/johnmichaell.benito/Downloads/Rimando,%20Jovie%20Jov%20Badua.xlsx)
- [Piso, Nolly Lucas.xlsx](/Users/johnmichaell.benito/Downloads/Piso,%20Nolly%20Lucas.xlsx)
- [SFO4 CBA Serapion.xlsx](/Users/johnmichaell.benito/Downloads/SFO4%20CBA%20Serapion.xlsx)
- [SFO1 RI Bernal.xlsx](/Users/johnmichaell.benito/Downloads/SFO1%20RI%20Bernal.xlsx)
- [Zulueta, Derrick Pastorin.xlsx](/Users/johnmichaell.benito/Downloads/Zulueta,%20Derrick%20Pastorin.xlsx)

## Extraction Rule

- Keep `current profile`, `current assignment`, and `historical service history` in separate data layers.
- Preserve the `raw period wording` and `raw designation wording` per service period.
- Normalize a designation only when the meaning is explicit in the same document or already confirmed by another inspected project source.
- If a service-history document conflicts with a monthly workbook on the current designation set, do not auto-overwrite the current profile or assignment layer.
- Keep unresolved shorthand or unclear labels in a `needs verification` bucket instead of forcing a public-ready expansion.
- If a source sheet contains overlapping `Present` rows, undated continuation rows, or single-date movement rows, preserve those quirks as source-aware notes instead of inventing missing cutoff dates.
- If a source sheet contains overlapping `historical dated rows` with different designation subsets, preserve all overlapping periods as written instead of collapsing them into one inferred sequence.
- If a source sheet uses inconsistent dash styles, missing spaces, or a course-code-only row such as `FBRC`, normalize the date parsing carefully but preserve the original display text in the saved record.
- If a source row appears to contain an internal year anomaly that conflicts with surrounding periods or order references, save the structured date as written and attach a source note instead of silently correcting the year.
- If a source row contains a descending or otherwise impossible date range, preserve the structured dates as written and attach a source note instead of guessing a swapped or corrected range.
- If the user later confirms the correct value for an apparent source typo, replace the structured date with the confirmed value and keep a note that the workbook text was corrected by user confirmation.
- If a shorthand label is explicitly spelled out elsewhere in the same workbook for the same person, the shorthand may be normalized using that same-document confirmation.
- If a service-history row is only a `rank-only movement or reassignment row` with no usable role text, preserve it as a dated service period and do not invent designation labels.
- If a row mixes grounded roles with unresolved unit shorthand such as `PIU`, `FSES Pers`, or `Customers Relation Staff`, normalize only the grounded roles and keep the unresolved wording in the verification bucket.

## Public-Safe Fields Captured

- `personnel id`
- `personnel name`
- `source document path`
- `source sheet name`
- `service period dates`
- `current/present flag`
- `rank during period`
- `appointment status`
- `station or office`
- `authority reference when present`
- `raw designation text`
- `confirmed designation labels`
- `designation labels needing verification`
- `designation history summary`

## Source Fields Intentionally Withheld

- `salary`
- `purpose`
- `date issued`
- `remarks`

## Initial Findings From The Sample

- The sample confirms that a statement-of-service style record can reveal `historical designations over time`.
- The sample also provides enough evidence to confirm `DPO = Driver and Pump Operator`.
- The sample shows that current-role wording may differ from the April 2026 monthly workbook, so current public display should stay verification-aware when sources disagree.
- Another sample showed that service-history sheets can include overlapping `Present` entries and orphan continuation rows, so extraction must preserve those source issues instead of silently flattening them.
- Another sample showed mixed date separators, filename spelling variation, and a training row that only used the course label `FBRC`, so source-aware normalization is still necessary even when the file is small.
- Another sample showed an apparent year typo inside one service period row that was later user-confirmed, which reinforced that date anomalies should be verified first and then corrected explicitly once confirmed.
- Another sample showed both overlapping `Present` rows and another user-confirmed year typo in a historical period, which reinforced that some source quirks affect not just current assignment periods but also historical chronology.
- Another sample showed that a core role can be explicit while attached team shorthand such as `TSP Team A/B` remains unclear, so only the grounded role should be normalized while the unresolved team label stays in verification.
- Another sample showed that some mixed shorthand rows can support partial normalization such as `Chief, Logistics Unit`, `Rad/Tel Operator`, or user-confirmed `FPU/CRU` unit shorthand, while still requiring unresolved pieces like `FS Photog Team A` or `FSES Clerk` to stay verification-aware.
- Another sample showed overlapping historical date windows with progressively changing role subsets, so source overlap sometimes reflects role transitions rather than a clean replacement chronology.
- Another sample showed that same-document expansion can safely normalize shorthand such as `CA = Collecting Agent` or `DPO = Driver and Pump Operator` when the workbook itself provides the full wording elsewhere.
- Another sample later received direct user correction that `FSES Pers` should be treated as `FPU` and `Alternate DPO` should be treated as plain `DPO`, so those labels can be normalized once the user explicitly confirms the intended meaning.
- Another sample showed that one workbook can mix rank-only transfer rows, explicit station-assignment rows, and training rows in the same timeline, so rank-only periods should remain label-empty instead of being padded with inferred designations.
- Another sample showed that admin and operations roles can often be normalized from nearby source context while unit shorthand such as `PIU`, `FSES Pers`, `Customers Relation Staff`, `FT Crew`, or `HRIS` still needs verification before public-ready expansion.
- Another sample showed that missing separators or doubled words such as `Record Custodian Community Relations Unit Staff`, `FireFire Arson Investigator`, or `Medical Fire Responder` can still support partial normalization when the grounded role meaning is already confirmed elsewhere in the project, while the raw source text stays preserved in the saved record.
- Another sample showed overlapping `Present` rows across different stations in the same workbook, so those current-looking periods should be preserved exactly as written instead of inventing an inferred transfer cutoff.
- Another sample showed date text glitches such as compact month formatting like `05-Dec 23` or visually inconsistent characters like `04 Deс 23`, so structured dates may be normalized carefully while the raw date text stays visible in the saved record.
- Another sample showed that a `Present` row can still be only a rank-only reassignment to a different office, so present status alone should not be treated as proof of an active designation set.
- Another sample showed that older timelines may fall back from recent full wording into compact chief-and-unit shorthand such as `C,IIU`, `C,OPN`, `C,FSES`, or `C,EMS`, so cross-source confirmation can help normalize grounded roles while impossible date ranges are still preserved exactly as written.
- Another sample showed that the shorthand `CA` may not mean the same public label in every workbook, so shorthand expansion should stay person-or-source-specific unless the same document or the user clearly confirms the intended full wording.
- Another sample showed that a later explicit row such as `Acting Municipal Fire Marshal` can safely ground a repeated earlier shorthand like `Acting MFM` inside the same workbook.
- Another sample showed that one workbook can mix grounded command labels such as `DMFM`, `C,FSES`, `C,OPN`, `BPE`, and `Assessor` with still-unclear compact strings like `C,FAI`, `SIC`, `C, Invest`, `Admin NCO`, or `Elec.Insp.`, so partial normalization is often safer than forcing a full expansion of every token.
- Another sample showed that training labels may appear in more than one explicit form such as `FOCC Training` and `FAIIC Training`, so those course labels can be preserved directly instead of being collapsed into a different nearby wording.

## Output File

- [personnel-service-history.json](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/personnel-service-history.json)
