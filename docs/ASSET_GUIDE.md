# Asset Guide

## Purpose

This guide defines where image assets should be placed before and during development.

## Current Status

The project does not have the React Router app scaffold yet. For now, image assets can already be organized inside the `public/images` directory so they are ready once implementation begins.

## Folder Structure

- `public/images/mock-station`
- `public/images/mock-personnel`
- `public/images/mock-personnel/fire-marshals`
- `public/images/mock-personnel/personnels`
- `public/images/mock-assets`
- `public/images/mock-gallery`
- `public/images/branding`

## Intended Use

- `mock-station`: exterior, interior, facade, station environment, hero shots
- `mock-personnel`: parent folder for personnel image groups
- `mock-personnel/fire-marshals`: fire marshal timeline portraits
- `mock-personnel/personnels`: current personnel, officers, and staff portraits
- `mock-assets`: fire trucks, rescue vehicles, tools, equipment, gear
- `mock-gallery`: outreach, operations, events, ceremonies, training
- `branding`: logo, badges, seals, insignia, icons, marks

## Naming Suggestions

Use clear file names such as:

- `station-hero-01.jpg`
- `fire-marshal-01.png`
- `truck-pumper-01.webp`
- `community-drill-01.jpg`

## Recommended Image Practice

- Prefer consistent naming
- Keep originals if possible
- Use web-friendly formats such as `jpg`, `png`, and `webp`
- Use the best available quality for hero images
- Separate branding assets from content photos

## Working Note

Once the app scaffold is created, these assets can be referenced directly from the `public/images` path.

Current structured vehicle data:

- [Vehicle Asset Data](./VEHICLES.md)
