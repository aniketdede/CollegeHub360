# CollegeHub360 MVP data sources

Reviewed on **2026-09-12**. This is a deliberately small launch dataset, not a complete counselling database.

## Program catalog

| Record | Source | Source type | Academic-year context | Freshness label |
|---|---|---|---|---|
| COEP Technological University | [First-year B.Tech](https://www.coeptech.ac.in/first-year-b-tech/) | Official institution page | Admissions 2024-25 on the reviewed page | Official program source; historic page context |
| VJTI Mumbai | [Undergraduate admission](https://vjti.ac.in/undergraduate-admission/) | Official institution page | 2026-27 page context | Official program source |
| VNIT Nagpur | [Undergraduate programmes](https://vnit.ac.in/undergraduate-programe/) | Official institution page | Current page context | Official program source |
| PICT Pune | [Undergraduate](https://pict.edu/undergraduate/) | Official institution page | 2021-22 intake table | Official historic source; not presented as current |
| IIM Nagpur | [About MBA](https://www.iimnagpur.ac.in/programmes/mba/about-mba/) and [MBA admissions policy](https://www.iimnagpur.ac.in/admissions/mba/admissions-policy/) | Official institution pages | MBA 2026-28 policy where stated | Official program source |
| Fr. Conceicao Rodrigues College of Engineering | [Admission information](https://fragnel.edu.in/index.php?id=672&option=com_content&view=article) and [courses offered](https://samay.fragnel.edu.in/) | Official institution pages/subdomain | Intake year is not asserted as current | Official admission source; verify intake before relying on it |

## Cutoff references

No cutoff row is seeded in the current MVP. The assessment therefore returns `Insufficient data` when it cannot find an official comparable cutoff instead of turning an aggregator estimate into a fact.

The next cutoff import must use the official [JoSAA](https://josaa.nic.in/) OR-CR data for JEE Main routes and official Maharashtra [CET Cell](https://cetcell.mahacet.org/) CAP documents for Maharashtra routes. Each future row must retain exam, academic year, round, quota, category, opening/closing rank, source URL, reviewed date and an import/version identifier.

Careers360 and CollegeDunia remain reference websites for product category research only. Their estimates are not used as authoritative cutoff data.

## Data rules

- `accessedOn` is the date the source was reviewed; it is not a claim that every value on the page was published on that date.
- A source URL, publisher, data-year context and status are retained with each record in `src/data/colleges.ts`.
- Missing or non-comparable cutoff evidence stays missing. The UI must not fill it with a guessed number.
- Intake, fees and admission routes can change. Users should open the linked institution or counselling source before making a decision.
