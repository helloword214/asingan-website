# Source of Truth

## Project

Asingan Fire Station Website

## Purpose of This Document

This document is the main decision guide for the project. Unless we intentionally revise it together, this is the direction to follow for design, structure, and implementation.

## Project Goal

Build a modern, official, and visually striking fire station website that serves the public with clear information while showcasing strong frontend execution, especially in custom CSS, layout, animation, and visual storytelling.

## Core Objectives

- Present the fire station as credible, professional, and community-centered.
- Showcase advanced CSS skill through handcrafted layouts, effects, and interactions.
- Use animation to enhance storytelling without weakening clarity or usability.
- Build a site that feels premium while still functioning like a real public-service website.

## Identity of the Project

This is both:

- A real-world public information website
- A portfolio-level frontend showcase

The project should never lean so far into experimentation that it stops feeling official, and it should never become so plain that it stops showing design skill.

## Website Strategy

The project should be built as:

- A public-service institutional website
- A future-ready publishing platform

## Site Theme and Messaging Direction

The active site-wide messaging theme is:

- `Asingan Fire Station`
- `Working Together for a Safer Asingan`
- `From emergency response and fire suppression to prevention and community preparedness, Asingan Fire Station continues to serve and support the safety of the municipality through dedicated public service.`

This theme is not for the home page alone.

It should guide how the whole website reads.

That means every major page should connect back to the same core ideas:

- public service
- teamwork
- response readiness
- prevention
- preparedness
- safety of the municipality

Each page should express the theme in a way that fits its own role.

Examples:

- `Home` introduces the theme directly
- `History` shows how that service story developed over time
- `Leadership` shows continuity of stewardship and responsibility
- `Organization` shows how teams work together
- `Personnel` shows the people behind the service
- `Assets` shows the tools and apparatus that support readiness and response

Do not repeat the exact home headline on every page.

Instead, each page should feel like a different chapter of the same station story.

This means the website should not be treated as a fixed brochure only. From the beginning, it should be structured in a way that can later support `News`, `Stories`, `Announcements`, `Fire Safety Tips`, and other blog-style content without requiring a full rebuild.

## Tech Stack Decision

The approved stack for this project is:

- React Router Framework Mode
- TypeScript
- Custom CSS files
- CSS variables for color, spacing, shadows, radius, timing, layering, and layout rhythm
- Native CSS animations as the default animation system
- GSAP only for high-impact or choreographed sections

## Styling Direction

CSS is the main skill showcase in this project.

That means:

- Custom styling should be preferred over utility-heavy approaches
- Tailwind is not the primary styling strategy
- Layout, spacing, motion, and visual identity should come from handcrafted CSS
- Reusable patterns are allowed, but they should be defined by us through our own CSS system

## Color Palette Direction

The approved branding direction for this project is:

- `Tangerine / ponkan orange`, not dark rust red

The website should read as:

- Warm
- Official
- Energetic
- Clean
- Premium

The main accent should feel closer to `citrus orange` than to `brick red`, `maroon`, or `burnt ember brown`.

## Approved Working Palette

- `Primary Tangerine`: `#F58A1F`
- `Sunlit Orange`: `#FFB54A`
- `Deep Citrus`: `#D96A14`
- `Ember Cream`: `#FFF6ED`
- `Smoke Sand`: `#E4CDB7`
- `Charred Espresso`: `#1A120D`
- `Cocoa Panel`: `#241813`

## Palette Usage Rules

- `Primary Tangerine` should drive the brand feel across active navigation, key buttons, highlights, and section accents.
- Dark surfaces should stay in the `espresso / cocoa` family so the orange feels more official and less neon.
- Avoid drifting into `maroon`, `muddy rust`, or `purple-leaning` palettes.
- Emergency red may appear later only for true alert or emergency states, not as the default brand base.
- Neutral text and borders should stay warm rather than cold blue-gray when possible.

## Design Principles

The site should feel:

- Official
- Consistent
- Cinematic
- Intentional
- Modern
- Readable
- Mobile-first

The design language should balance visual impact and trust. It can be bold, layered, and animated, but it must still feel respectful and grounded for a fire station context.

## Current Revamp Direction

The active revamp direction for the current UI work is:

- `Ember Glass`

This means the interface should lean into:

- Warm translucent surfaces layered over ember-toned backgrounds
- Refined glow, highlight, and glass depth rather than heavy ornamental effects
- Strong readability and contrast even when visuals feel premium
- A more intentional and polished motion language across cards, media, and calls to action

## UI and UX Rules

Every interface decision should also follow these rules:

- Good UX practice should always come first
- Design consistency is the top visual rule across the whole site
- Mobile is the default layout starting point, with desktop treated as an enhancement layer
- Hover effects must never carry required information
- Focus states and touch behavior must be considered alongside hover behavior
- Decorative motion should never slow down access to public-service information

## Information Hierarchy Rules

Across the whole website, information hierarchy must stay clear and intentional.

That means:

- headings and primary content should visually lead
- supporting metadata such as dates, tenure labels, captions, helper text, and status text should stay smaller and quieter
- secondary and tertiary text should use lower contrast than main headlines and body copy
- utility controls should never visually outrank the content they belong to

In practice, this means:

- names, page titles, and section titles should carry the strongest emphasis
- supporting details should feel lighter, more muted, and less dominant
- if a small label or helper line draws attention before the actual content, the hierarchy is wrong

## Expand and Reveal Controls

Small expand or reveal controls such as `Read more` and `Show less` should be treated as tertiary actions.

They should follow these rules:

- keep them close to the text they affect
- prefer inline or text-adjacent placement over floating or CTA-like button treatment
- make them visually subtle, not primary
- avoid large pills, heavy shadows, or loud contrast for minor reveal actions
- the content should remain the focus, not the control

## Component System Direction

The site should move toward a reusable component-first UI layer for repeated patterns such as:

- Page headers
- Section headings
- Surface cards
- Buttons and calls to action
- Status pills
- Media frames

This is important so that spacing, typography, surface styling, motion, and responsive behavior stay unified as the site grows.

## Animation Rules

Animation is part of the identity of the website, but it must follow these rules:

- Animation should support content, not compete with it
- Emergency and contact information must remain quick to scan
- Native CSS animation should handle most reveals, hovers, transitions, and ambient effects
- GSAP should be reserved for hero scenes, timeline storytelling, parallax, and premium section choreography
- Motion should feel smooth and deliberate, not noisy or excessive
- Performance and mobile behavior should always be considered

## Hover and Interaction Rules

Hover and interaction styling should follow these rules:

- Hover should feel premium, restrained, and deliberate
- Avoid generic floating-card behavior as the only interaction pattern
- Prefer layered light shifts, border emphasis, glow, image treatment, and glass depth where appropriate
- Keep motion subtle enough that the site still feels official
- Mobile and touch users must not lose clarity because an effect depends on hover

## Visual Themes to Explore

The visual system may include:

- Fire-inspired gradients
- Glow, ember, smoke, or particle effects
- Strong contrast and layered backgrounds
- Animated section reveals
- Hero transitions
- Premium image presentation using real station photos

These should be used with restraint so the site still feels credible and not theatrical in the wrong way.

## Content Scope

The website should support these content areas:

- Home
- About / Station Profile
- History of the fire station
- Organization structure
- Fire marshal and key personnel
- Available assets, vehicles, and equipment
- EMS and rescue role
- Services and responsibilities
- News and stories
- Gallery
- Contact and emergency information

## Publishing Direction

The preferred future content label is:

- `News and Stories`

This is a better fit than a generic `Blog` label because it feels more official while still allowing flexible publishing later.

## Content Architecture Direction

The website should be content-driven from the start.

That means:

- Structured station records should live in `data/`
- Future article-style content should be easy to place in a dedicated publishing layer such as `content/posts/`
- Homepage sections should be designed to feature both institutional content and future published updates
- The system should allow the website to grow into a web blog without changing its identity as an official station website

## Content Priorities

The site must clearly communicate:

- Who the station is
- Who leads it
- What assets are available
- What services it provides
- How the public can reach it
- What makes the station real and grounded through authentic photos and details

## Content Sources

The project will rely on:

- Real photos provided for the station, personnel, and assets
- Station history and identity details
- Fire marshal and personnel information
- Asset and equipment information
- Public contact and station service details

## Build Priorities

When making implementation decisions, prioritize in this order:

1. Credibility of the station presentation
2. UI/UX clarity and design consistency
3. Mobile-first responsive behavior
4. Strength of custom CSS execution
5. Clarity of content structure
6. Quality of animation and motion
7. Performance polish

## What This Project Should Prove

By the end, the project should clearly prove:

- Strong CSS craftsmanship
- Good design judgment
- Ability to blend motion with usability
- Ability to build a polished multi-section public-facing website
- Ability to use real content in a way that feels premium and purposeful

## Guardrails

Avoid these mistakes:

- Overloading every section with effects
- Making official information hard to read
- Using animation without meaning
- Letting the site feel like a generic template
- Letting the site feel like a pure art piece instead of a public-service website

## Working Rule

Every design and code decision should pass these checks:

1. Does this make the fire station look credible and well represented?
2. Does this show real frontend and CSS skill?
3. Does this improve the experience instead of only adding decoration?

If the answer is not yes to all three, the decision should be reconsidered.

## Planning References

- [Website Foundation](./WEBSITE_FOUNDATION.md)
- [Organization Structure Guide](./ORGANIZATION_STRUCTURE.md)
- [Key Information Masterlist](./KEY_INFORMATION_MASTERLIST.md)
