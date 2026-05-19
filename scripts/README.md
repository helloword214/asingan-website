# Scripts

## fetch_public_page.py

Fetches a public URL and extracts basic readable text into JSON using only Python standard library tools.

Example:

```bash
python3 scripts/fetch_public_page.py "https://www.asingan.gov.ph/asingan-top-lgu-officials-vow-more-support-to-asinganians/" --output tmp/asingan-bfp-building.json --insecure
```

Use `--insecure` only for public sites with broken SSL certificates.

## prepare_personnel_images.py

Generates standardized personnel image copies for website display without modifying or deleting the original source photos.

Default flow:

- originals stay in `public/images/mock-personnel/personnels`
- originals also stay in `public/images/mock-personnel/fire-marshals`
- derived display-ready copies go to `public/images/derived/mock-personnel/personnels`
- derived display-ready copies also go to `public/images/derived/mock-personnel/fire-marshals`

Example:

```bash
python3 scripts/prepare_personnel_images.py
```

Force re-render:

```bash
python3 scripts/prepare_personnel_images.py --force
```
