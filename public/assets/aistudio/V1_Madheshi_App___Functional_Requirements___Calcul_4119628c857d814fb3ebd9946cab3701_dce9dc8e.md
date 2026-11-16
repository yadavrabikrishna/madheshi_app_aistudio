# V1. Madheshi App — Functional Requirements & Calculation Rules

- Product: Madheshi App
- Release: V1
- Status: Approved functional baseline; unresolved technical edge cases must be settled before the affected feature is released.
- Purpose: Give developers one implementation reference for the four V1 features.

## 1. News

### 1.1 Content source

- Existing [Madheshi.com](http://Madheshi.com) WordPress REST API is the initial and authoritative editorial source.
- WordPress remains the source of truth for article content, categories, author and publication metadata.
- Do not create a separate CMS or privileged write API for V1.

### 1.2 Core user capabilities

- View latest news feed.
- Browse available WordPress categories.
- Open an article detail page.
- Search news using the supported WordPress search capabilities.
- Share an article using its canonical [Madheshi.com](http://Madheshi.com) URL.
- Retain locally cached news for offline reading where already supported by the app implementation.
- Keep explicit bookmarks/saved articles separate from automatic cache if bookmarking is included in the V1 navigation.

### 1.3 Data and UI behavior

- Display title, featured image when available, author, publication date, category and article content.
- Handle pagination using WordPress pagination metadata; do not download the complete archive at once.
- Handle missing images, empty results, loading, refresh failure and offline states.
- Never show raw network/client exception text to the user.
- Distinguish fresh online content from cached or bundled fallback content.
- Do not label old cached content as breaking or newly published.
- Use the existing WordPress taxonomy; do not invent or hard-code categories that are not present on the site.

### 1.4 Offline behavior

- Calculators are fully local and do not depend on network access.
- News may show valid locally cached articles when offline.
- If bundled fallback articles are used, their quantity is variable and editorially selected; do not assume a fixed count of 10.
- Bookmarks, if enabled, must not be deleted merely because automatic cache entries are evicted.

## 2. Interest Calculator — CAL-001

### 2.1 One calculator, two modes

Provide one Interest Calculator with a mode selector:

- Simple Interest — घरेलु ब्याज.
- Compound Interest — साहु ब्याज.

Do not create two unrelated calculator features or screens.

### 2.2 Inputs

Minimum inputs:

- Principal amount (Rs.).
- Rate value.
- Rate-entry mode: percentage or rupees per Rs. 100.
- Start date.
- End date.
- Date system: AD only (BS interest-date input is deferred for V1).
- Interest mode: Simple or Compound.

Validate required values, positive principal, non-negative rate, valid dates and end date not earlier than start date. Use appropriate numeric keyboards and currency formatting.

### 2.3 Rate convention

The agreed local convention is:

**Rs. X per Rs. 100 per month = X% per month = (X × 12)% nominal per year.**

Examples:

- Rs. 1 per Rs. 100 per month = 1% monthly = 12% nominal annual.
- Rs. 2 per Rs. 100 per month = 2% monthly = 24% nominal annual.
- Rs. 2.5 per Rs. 100 per month = 2.5% monthly = 30% nominal annual.
- Rs. 3 per Rs. 100 per month = 3% monthly = 36% nominal annual.

Percentage mode and rupees-per-100 mode must normalize to the same monthly rate. The annual rate is nominal annualized interest, not an effective annual yield.

### 2.4 Simple Interest — घरेलु ब्याज

- Use simple interest; unpaid interest never becomes principal automatically.
- Monthly rate = X / 100 when the user enters Rs. X per Rs. 100 per month.
- Calculate interest on the original principal for the entire elapsed period.
- Show principal, interest and total amount separately.

### 2.5 Compound Interest — साहु ब्याज

- Compound only after each completed 12-calendar-month anniversary from the start date.
- At each completed anniversary, capitalize 12 months of interest at the agreed monthly rate: annual interest rate = monthly rate × 12. Apply the resulting annual factor to the current principal.
- For the incomplete period after the last completed anniversary, accrue simple interest on the current balance; do not capitalize it until another full 12-month anniversary is reached.
- Do not offer monthly, quarterly, half-yearly or custom compounding intervals in V1.
- Show the number of completed 12-month periods, the remaining period, principal, interest and total amount separately.

### 2.6 Date system and date counting

- Interest Calculator V1 supports **AD (Gregorian) dates only**. BS interest-date entry and BS↔AD conversion are deferred, as previously decided.
- The user enters a start date and end date in AD.
- Elapsed time is calculated as the calendar-date difference: the start date is excluded and the end date is included. Identical dates produce zero elapsed time.
- Count completed calendar months using anniversaries anchored to the original start date. If the original day does not exist in a target month, clamp that anniversary to the last day of that month (for example, 31 January → 28 February in a non-leap year; 29 February → 28 February in a non-leap year).
- After the last completed month anniversary, count the remaining actual calendar days. A remaining partial month is prorated using remaining days / 30.
- For simple interest, time in months = completed calendar months + remaining days / 30. Interest = principal × monthly rate × time in months.
- For compound interest, each completed 12-calendar-month anniversary is one compounding event. For the final incomplete period, calculate simple interest using completed remaining calendar months plus remaining days / 30 on the current balance.
- Do not use a 360-day year to decide when annual compounding occurs; the 12-month anniversary is calendar-based.

### 2.7 Currency precision and rounding

- Keep full precision through all intermediate calculations. Do not round monthly interest, anniversary balances or partial-period interest during the calculation.
- Round only final displayed currency amounts to 2 decimal places using decimal round-half-up.
- Display principal, interest and total amount in Nepalese rupees with two decimal places.
- Calculate the final total from the unrounded principal plus unrounded interest, then round the displayed total independently.
- Test exact anniversary dates, one day before/after an anniversary, month-end clamping, leap-year boundaries, partial-month proration, and values that land exactly on or just above a half-paisa rounding boundary.

Do not implement payment, partial-payment or loan-ledger behavior in V1.

## 3. Age Calculator — CAL-005

### 3.1 Scope

- Calculate the difference between a start date and an end date.
- Support AD and BS input.
- Return years, months and days.
- The user selects the date system; both dates must use the same system.
- No separate date conversion library or BS↔AD conversion feature.

### 3.2 Approved simplified subtraction algorithm

Use the same algorithm for both AD and BS:

1. Subtract start-day from end-day.
2. If the day result is negative, add exactly 30 days and subtract 1 from the month result.
3. Subtract start-month from end-month, including any month adjustment from the previous step.
4. If the month result is negative, add exactly 12 months and subtract 1 from the year result.
5. Subtract start-year from end-year.
6. Display the resulting years, months and days.

This is a fixed 30-day / 12-month borrowing algorithm. It does not inspect the actual length of a calendar month.

### 3.3 Accuracy notice

- AD results use the simplified arithmetic rule defined above.
- BS results are approximate because actual BS months have different lengths.

### 3.4 Validation and display

- Require valid start and end date fields in the selected date system.
- Reject an end date earlier than the start date.
- Display years, months and days, including zero-valued units where useful for clarity.
- Test same-day, one-day difference, month borrowing, year borrowing, year boundary and invalid/reversed date cases.

## 4. Land Calculator — CAL-004

### 4.1 Separate measurement families

Keep the two Nepal land-measurement families clearly grouped:

**Terai**

- Bigha
- Katha (also commonly written Kattha)
- Dhur

**Hill / Mountain**

- Ropani
- Aana
- Paisa
- Daam

Do not mix the two families in the interface in a way that confuses users.

### 4.2 Recorded conversion relationships

Terai:

- 1 Bigha = 20 Katha = 400 Dhur.
- 1 Katha = 20 Dhur.
- 1 Dhur = 182.25 sq ft.
- 1 Katha = 3,645 sq ft.
- 1 Bigha = 72,900 sq ft.

Mountain & Hill:

- 1 Ropani = 16 Aana.
- 1 Aana = 4 Paisa.
- 1 Paisa = 4 Daam.
- 1 Ropani = 5,476 sq ft.
- 1 Aana = 342.25 sq ft.
- 1 Paisa = 85.5625 sq ft.
- 1 Daam = 21.390625 sq ft.

Metric:

- 1 sq ft = 0.09290304 m².
- Derive metric values from the square-foot base factors rather than from rounded display values.

### 4.3 Calculator behavior

- Allow the user to enter a value and select its source unit.
- Convert to all other units in the same measurement family through one exact square-foot base factor per unit.
- Keep conversion calculations at full precision; never convert using rounded display values.
- Display converted land areas to a maximum of 4 decimal places, using decimal round-half-up and trimming unnecessary trailing zeros.
- Zero is valid; negative values are rejected.
- Reverse conversions must return the original value within the 4-decimal display tolerance.
- Keep Terai and Hill unit families grouped separately in the interface. Cross-family comparison is not required in the initial V1 calculator.
- Do not add unrelated length, weight, volume or gold/silver conversion features.

### 4.4 Verified V1 conversion baseline

The following factors are approved for V1 and are supported by Government of Nepal technical/land-measurement references:

- Department of Urban Development and Building Construction, Government of Nepal, Resource Book on Building Bylaws and Building Permit System: [https://plgsp.gov.np/sites/default/files/2023-09/Resource_Book_on_Building_Bylaws%20and%20Building%20Permit%20System%20in_Nepal.pdf](https://plgsp.gov.np/sites/default/files/2023-09/Resource_Book_on_Building_Bylaws%20and%20Building%20Permit%20System%20in_Nepal.pdf)
- Government of Nepal technical educational material, Practice Unit of Length / Unit of Land: [https://giwmscdnone.gov.np/media/pdf_upload/Compress-Combine-1.%20Computer%20and%20Drawing%20Grade%209_yoxzmi3.pdf](https://giwmscdnone.gov.np/media/pdf_upload/Compress-Combine-1.%20Computer%20and%20Drawing%20Grade%209_yoxzmi3.pdf)
- Department of Land Management and Archive, land measurement information: [https://www.dolma.gov.np/uploads/files/MLV%202079-080/%E0%A4%A8%E0%A5%8D%E0%A4%AF%E0%A5%82%E0%A4%A8%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A4%AE%20%E0%A4%AE%E0%A5%82%E0%A4%B2%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%95%E0%A4%A8%202080-81/%E0%A4%A7%E0%A4%A8%E0%A4%97%E0%A4%A7%E0%A5%80%20%E0%A4%95%E0%A5%88%E0%A4%B2%E0%A4%BE%E0%A4%B2%E0%A5%80.pdf](https://www.dolma.gov.np/uploads/files/MLV%202079-080/%E0%A4%A8%E0%A5%8D%E0%A4%AF%E0%A5%82%E0%A4%A8%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A4%AE%20%E0%A4%AE%E0%A5%82%E0%A4%B2%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%95%E0%A4%A8%202080-81/%E0%A4%A7%E0%A4%A8%E0%A4%97%E0%A4%A7%E0%A5%80%20%E0%A4%95%E0%A5%88%E0%A4%B2%E0%A4%BE%E0%A4%B2%E0%A5%80.pdf)

The exact square-foot base factors in this document are the implementation source of truth. Some government tables show rounded subunit figures (for example, 85.56 sq ft for a Paisa); the app must derive these subunits exactly from the hierarchy and base factors above:

- Terai: Bigha = 72,900 sq ft; Katha = 3,645 sq ft; Dhur = 182.25 sq ft.
- Hill: Ropani = 5,476 sq ft; Aana = 342.25 sq ft; Paisa = 85.5625 sq ft; Daam = 21.390625 sq ft.
- Metric: 1 sq ft = 0.09290304 m².

Use the exact sq-ft factors as canonical constants. The hierarchy (20 Katha per Bigha; 20 Dhur per Katha; 16 Aana per Ropani; 4 Paisa per Aana; 4 Daam per Paisa) must reconcile exactly with the canonical factors. Metric and any later cross-family values must be derived from square feet without intermediate rounding.

This verifies the standard conversion baseline for the app. It is an informational calculator, not a substitute for a cadastral survey or a land-office determination; users should rely on the official land record/survey for legal boundaries and transactions.

## 5. Cross-feature requirements

- Use shared numeric/date formatting helpers where appropriate.
- Keep formulas and conversion factors outside UI widgets.
- Keep labels and translations outside calculation logic.
- Calculations must be deterministic and independently unit-testable.
- Show validation errors beside the relevant input.
- Avoid raw exception messages and unexplained technical terminology in the UI.
- Provide test cases for normal, boundary, zero, invalid and large values.