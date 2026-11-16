# V1. Madheshi App — Release Scope & Product Overview

- Product: Madheshi App
- Release: V1
- Status: Approved scope baseline
- Purpose: Define exactly what belongs in the first release and prevent scope expansion during implementation.
- Authority: This V1 document set supersedes conflicting earlier proposals for the V1 release. Older documents remain historical research and decision records; they are not deleted.

## 1. V1 Product Goal

Deliver a small, dependable Madheshi companion app with:

1. News from [Madheshi.com](http://Madheshi.com).
2. Simple and compound interest calculator.
3. Age calculator.
4. Nepal land measurement calculator.

Prioritize correctness, simple UX, offline availability for calculations, and a release that can be completed. Do not expand V1 into a general-purpose calculator collection.

## 2. Included Features

| Feature | V1 inclusion | Summary |
| --- | --- | --- |
| News | In scope | Read [Madheshi.com](http://Madheshi.com) news, browse categories, open articles, search, share, and retain useful cached/saved content where included in the existing news design. |
| Interest calculator | In scope | One calculator with Simple Interest (घरेलु ब्याज) and Compound Interest (साहु ब्याज) modes; AD dates only in V1. |
| Age calculator | In scope | Calculate years, months and days between two dates using the same simplified subtraction algorithm for AD and BS. |
| Land calculator | In scope | Convert between approved Nepal land units for Terai and Hill measurement systems. |
| Basic settings | Supporting scope | Language and Light/Dark theme preferences needed by the app. |

## 3. Explicitly Out of Scope for V1

Do not implement these as part of V1:

- NEPSE/share-market calculator or Share Manager.
- Gold/silver weight calculator.
- General unit converter or traditional dry-volume converter.
- BMI, EMI, loan manager or personal loan ledger.
- Standalone BS↔AD date conversion tool.
- Full calendar, Panchanga, festival or horoscope features.
- User accounts, cloud synchronization or subscription features unless a separate approved dependency is demonstrated.
- Advanced financial reports, reminders, charts or exports.
- New backend/CMS solely for the app when the existing WordPress REST API is sufficient.
- Push notifications unless they are already a necessary, working part of the existing approved news implementation; otherwise defer.

## 4. Product and UX Principles

- Keep the app lightweight and straightforward for everyday users in Nepal.
- Use clear Nepali and English UI labels according to the selected app language.
- Do not display parallel Nepali and English labels at the same time.
- Use large readable text, simple forms, numeric keyboards, clear validation and useful error messages.
- Calculators must work offline and must not require an API call to perform arithmetic.
- Keep calculation rules separate from UI labels and presentation.
- News must identify cached/offline content when it is not freshly retrieved.
- Do not imply that approximate BS age results are calendar-exact.

## 5. Suggested Navigation

Keep navigation limited to the four main features:

- Home
- News
- Calculators (Interest, Age, Land)
- Settings

A home screen may surface latest news and shortcuts to the three calculators. Avoid adding separate navigation destinations for deferred tools.

## 6. Language, Date and Theme Defaults

- App UI language: English or Nepali, one active language at a time.
- Theme: Light or Dark; persist the selected preference locally.
- Date-system default: Interest Calculator uses AD only. Age Calculator supports AD and BS; default to AD or BS based on the user's selected date preference, while allowing explicit selection.
- Interest Calculator does not accept BS dates in V1. No general BS↔AD conversion feature is included.
- Age Calculator applies the same simplified fixed 30-day/12-month subtraction algorithm to both AD and BS; BS results are approximate.

## 7. Release Acceptance Summary

V1 is ready for release only when:

- All four main features work end-to-end.
- Interest calculations pass agreed AD test cases; age calculations pass the agreed simplified algorithm tests for both AD and BS.
- BS age results are clearly labelled approximate.
- Land conversions use one consistent conversion registry and pass reverse-conversion tests.
- News can load current articles and present a sensible offline/cached state.
- App language and theme preferences persist.
- Core calculator functions work with network access disabled.
- No deferred feature is accidentally exposed as a partially implemented V1 feature.

## 8. Relationship to Existing Documentation

This V1 release scope is the controlling scope for implementation. Earlier documents such as Raw Requirement and Consolidated Product Requirements & Research retain background, alternatives and research. Where an older document lists additional calculators or contradicts this V1 scope, follow this V1 scope for the first release.