# History Sources

This file stores public history-related source leads for the Asingan Fire Station website.

Structured source:

- [history-events.json](../data/history-events.json)
- [land-records.json](../data/land-records.json)

Related draft:

- [Asingan History 1991-1996](./ASINGAN_HISTORY_1991_1996.md)
- [History Website Copy](./HISTORY_WEBSITE_COPY.md)
- [New Fire Station Draft](./NEW_FIRE_STATION_BERNARDINO.md)
- [EMS History Draft](./EMS_HISTORY.md)
- [Facebook Media References](./FACEBOOK_MEDIA.md)

## Current Saved History Event

### September 7, 2017

`Blessing and Ribbon Cutting Ceremony of the Bureau of Fire Protection Building`

Saved summary:

Mayor Heidee Chua and Vice Mayor Carlos F. Lopez Jr. led the blessing and ribbon cutting ceremony of newly constructed buildings in Asingan, including the Bureau of Fire Protection building.

Source:

- `Official LGU Website of Asingan Pangasinan`
- URL: `https://www.asingan.gov.ph/asingan-top-lgu-officials-vow-more-support-to-asinganians/`

## Reliability Note

As of May 17, 2026, the public search result for the source page is visible, but fetching the live URL directly currently returns a database error. Because of that, this event is saved as a valid source lead and likely history entry, but it should still be visually verified later if the article becomes available again or if the same post is found on the official Facebook page.

## Fetch Script

You can use the public fetch helper to capture public article text from URLs that do not require a login:

```bash
python3 scripts/fetch_public_page.py "https://example.com/article" --output tmp/article.json
```

If the site has a broken certificate:

```bash
python3 scripts/fetch_public_page.py "https://example.com/article" --output tmp/article.json --insecure
```

This is useful for public article mirrors and static pages. It may not fully work on Facebook because Facebook content is often heavily dynamic or login-gated.
