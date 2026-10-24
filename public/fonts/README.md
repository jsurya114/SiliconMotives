# Website fonts

Existing Latin-subset fonts, self-hosted without modifying their outlines. Current English website copy uses this subset; additional writing systems require the matching subsets.

- Schibsted Grotesk v7, normal variable weights 400–900: https://fonts.gstatic.com/s/schibstedgrotesk/v7/Jqz55SSPQuCQF3t8uOwiUL-taUTtap9GayojdSFO.woff2
- Newsreader v26, normal variable weights 400–600: https://fonts.gstatic.com/s/newsreader/v26/cY9AfjOCX1hbuyalUrK4397yjIJFJpc.woff2
- Newsreader v26, italic variable weights 400–600: https://fonts.gstatic.com/s/newsreader/v26/cY9CfjOCX1hbuyalUrK439vCjohCBJWxZA.woff2

Downloaded 24 October 2026 from Google Fonts. Both fonts use SIL Open Font License 1.1; notices are included alongside the files. Licenses were retrieved from https://github.com/google/fonts/tree/main/ofl/schibstedgrotesk and https://github.com/google/fonts/tree/main/ofl/newsreader.

The public layout preloads only the normal sans and serif used in the first screen. Italic Newsreader loads when needed. Admin-only DM Sans and Manrope remain scoped to the admin layout. Versioned font URLs receive immutable caching; publish a new versioned name if the font bytes change.
