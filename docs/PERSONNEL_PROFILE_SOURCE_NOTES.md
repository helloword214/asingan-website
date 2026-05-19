# Personnel Profile Source Notes

## Purpose

This note summarizes the personnel profile data extracted from the April 2026 administrative workbook.

Use the structured JSON as the main reusable profile source, and use this file for caveats, privacy boundaries, and data-cleaning notes.

## Source Workbook

- [April Admin Monthly.xlsx](/Users/johnmichaell.benito/Downloads/April%20Admin%20Monthly.xlsx)

## Main Sheets Used

- `BFP Roster of Troops`
- `Upgrading Data of BFP Pers`
- `Personnel Profile Report`
- `Profile of BFP Uniformed Pers`
- `PSIPOP`
- `Duty Detail April`

## Extraction Rule

- The `19-person active roster` was treated as the core personnel set.
- Extra names that appeared only in isolated sheets were saved separately as `needs verification` instead of being mixed into the core roster.
- Public-safe profile fields were extracted into JSON.
- Sensitive personal fields visible in the workbook were intentionally not copied into the website data file.
- Designations were merged across the main sheets so the project can keep as much confirmed role data as possible without depending on only one tab.
- Personnel profiles should be treated as a `directory of people`, while current org-chart role occupancy should live in the assignment layer.
- Historical service periods and historical designation sequences should live in the separate `personnel-service-history` layer instead of being blindly merged into current profile designations.

## Public Name Style Rule

- Public display names for `uniformed personnel` should not use a period after middle initials.
- If the rank is a `fire officer rank` such as `FO1`, `FO2`, `FO3`, `FO4`, `SFO1`, `SFO2`, `SFO3`, or `SFO4`, keep the rank uppercase but render the person's name in `proper case`.
- If the rank is an `inspector rank` such as `INSP`, `FINSP`, `FSINSP`, or `FISNP`, the full public display name should be rendered in `all uppercase`.

## Public-Safe Fields Captured

- `rank`
- `name`
- `display name`
- `item number`
- `official name parts`
- `sex`
- `photo path`
- `designations`
- `designation authority/reference when available`
- `educational attainment`
- `eligibility`
- `mandatory training`
- `status of appointment`
- `date entered service`
- `date of last promotion`
- `date of retirement`
- `length of service display`

## Sensitive Fields Intentionally Withheld

- `exact birth dates`
- `place of birth`
- `home addresses`
- `cellphone numbers`
- `TIN`
- `religion`
- `civil status`
- `daily duty and off-duty schedules`

## Workbook Issues and Normalization Notes

- The `Duty Detail April` sheet text says the duty period is `01-31 May 2026`, so the file contains at least one month-label inconsistency.
- The `Upgrading Data of BFP Pers` row for `Derrick P Zulueta` appears misaligned, so that row was not trusted for date-of-birth extraction.
- The `Upgrading Data of BFP Pers` rows for `Chester Bryan A Serapion`, `Jefferson C Cadaba`, and `Jovie Jov B Rimando` contain implausible retirement years and should be rechecked before reuse.
- The personnel photo filename `FO3-Bintantes.jpeg` uses `Bintantes` while workbook records use `Bitantes`.
- The personnel photo filename `F02-Enriquez.jpeg` uses `F02` instead of `FO2`.
- The personnel photo filenames `FO2-Piso.jpeg` and `FO2-Montero.jpeg` do not match the workbook rank labels, which currently show `FO1` for both names.
- The duty detail uses the spelling `Jeferson Cabada`, while the roster and profile sheets use `Jefferson C Cadaba`.
- Several designation strings contain spelling inconsistencies such as `Retrival`, `Fier Safety Inspector`, `Customer Relation Officer`, and `Retirement Survivor Officer`; these were normalized only where the intended meaning was clear.
- The acronym-like or shorthand role labels `COMMEL`, `OLP Monitorer`, and some operation-role abbreviations still need preferred public wording if they will appear on the website.

## Additional Names Needing Verification

- `Reuben I Guindalos`: seen in `Duty Detail April`. Appears in duty detail as Shift A commander and rescue-related roles, but is not in the 19-person active roster table.
- `Rando O Dela Cruz`: seen in `PSIPOP`, `Admin.docx`, `FSEC.docx`, `Operations.docx`. Appears in PSIPOP and organization chart files but not in the April 2026 active roster table.
- `Cristalyn N Ilumin`: seen in `Personnel Profile Report`. Appears only in the personnel profile report among the inspected workbook sheets.
- `Marjorie Q Natividad`: seen in `Personnel Profile Report`. Appears only in the personnel profile report among the inspected workbook sheets.
- `Cesar Lloyd Latina`: seen in `PSIPOP`. Appears only in PSIPOP among the inspected workbook sheets.

## Output Files

- [personnels.json](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/personnels.json)
- [personnel-service-history.json](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/personnel-service-history.json)
