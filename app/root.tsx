import { useEffect, useState, type ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import { AppImage } from "./components/ui/app-image";
import type { Route } from "./+types/root";
import "./app.css";

const primaryNavigation = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/history", label: "History" },
  { to: "/leadership", label: "Leadership" },
  { to: "/personnel", label: "Personnel" },
  { to: "/assets", label: "Assets" },
];

const officialFacebookUrl = "https://www.facebook.com/bfp.asingan";
const stationPhoneNumber = "09171847611";
const stationAddressLine = "L. Milan Street, Poblacion East";
const stationLocality = "Asingan, Pangasinan";
const stationFullAddress = `${stationAddressLine}, ${stationLocality}`;
const stationRegion = "Region 1, Province of Pangasinan";
const stationMapUrl =
  "https://www.google.com/maps/place/Asingan+Fire+Station/@16.003866,120.6697156,19.61z/data=!4m6!3m5!1s0x339117cdb127750b:0x1ea19c7f315d4620!8m2!3d16.0040988!4d120.6699765!16s%2Fg%2F1tmpbgs3?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D";
const siteYear = new Date().getFullYear();

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600;700;800&family=Instrument+Sans:wght@400;500;600;700;800&display=swap",
  },
  {
    rel: "icon",
    href: "/images/branding/Asingan-fs-old-logo-icon.png",
    type: "image/png",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: "Asingan Fire Station" },
  {
    name: "description",
    content: "History, leadership, personnel, and asset information of Asingan Fire Station.",
  },
];

function MenuToggleIcon() {
  return (
    <span className="menu-toggle__icon" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M13.5 7.2h2V4.2c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.8-4.92 5.1v2.85H4.5v3.35h3.13V24h3.84v-8.65h3.02l.48-3.35h-3.5V9.48c0-.97.27-1.63 1.53-1.63Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M7.2 4.5h2.13c.37 0 .7.26.79.62l.73 2.92a.82.82 0 0 1-.22.79l-1.37 1.37a13.02 13.02 0 0 0 4.55 4.55l1.37-1.37a.82.82 0 0 1 .79-.22l2.92.73c.36.09.62.42.62.79v2.13c0 .46-.38.84-.84.84C11.75 18.65 5.35 12.25 5.35 5.34c0-.46.38-.84.85-.84Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleMapsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 2.4a7.02 7.02 0 0 0-7 7c0 5.2 5.82 11.79 6.07 12.06a1.25 1.25 0 0 0 1.86 0C13.18 21.19 19 14.6 19 9.4a7.02 7.02 0 0 0-7-7Z"
        fill="#EA4335"
      />
      <path
        d="M12 2.4a7 7 0 0 0-6.67 4.87h5.44A3.52 3.52 0 0 1 12 6.99V2.4Z"
        fill="#FBBC04"
      />
      <path
        d="M19 9.4c0-1.2-.31-2.33-.85-3.3l-4.12 4.13c.23.4.36.86.36 1.35 0 .71-.27 1.36-.72 1.84l3.19 3.2C18.23 13.82 19 11.3 19 9.4Z"
        fill="#34A853"
      />
      <circle cx="12" cy="9.96" r="2.2" fill="#4285F4" />
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frameId = 0;
    let observer: IntersectionObserver | null = null;

    function isStageInView(element: HTMLElement) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportTopTrigger = viewportHeight * 0.88;
      const viewportBottomTrigger = viewportHeight * 0.14;

      return rect.top <= viewportTopTrigger && rect.bottom >= viewportBottomTrigger;
    }

    frameId = window.requestAnimationFrame(() => {
      const revealStages = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal-stage]"),
      );

      if (revealStages.length === 0) {
        return;
      }

      if (typeof window.IntersectionObserver !== "function") {
        revealStages.forEach((stage) => {
          stage.classList.add("is-motion-ready", "is-in-view");
        });
        return;
      }

      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const target = entry.target as HTMLElement;
            target.classList.add("is-in-view");
            observer?.unobserve(target);
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.08,
        },
      );

      revealStages.forEach((stage) => {
        stage.classList.add("is-motion-ready");

        if (isStageInView(stage)) {
          stage.classList.add("is-in-view");
          return;
        }

        stage.classList.remove("is-in-view");
        observer?.observe(stage);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [location.pathname]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={isMobileNavOpen ? "is-nav-open" : undefined}>
        <div className="site-shell">
          <div className="site-shell__glow site-shell__glow--one" />
          <div className="site-shell__glow site-shell__glow--two" />
          <header className="site-header">
            <div className="site-header__inner">
              <a className="brand" href="/">
                <AppImage
                  className="brand__mark"
                  src="/images/branding/Asingan-fs-old-logo-icon.png"
                  alt="Asingan Fire Station logo"
                  priority
                  skeleton={false}
                />
                <span className="brand__copy">
                  <span className="brand__eyebrow">Bureau of Fire Protection</span>
                  <span className="brand__title">Asingan Fire Station</span>
                </span>
              </a>

              <button
                aria-controls="mobile-primary-navigation"
                aria-expanded={isMobileNavOpen}
                aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                className={`menu-toggle${isMobileNavOpen ? " is-active" : ""}`}
                onClick={() => setIsMobileNavOpen((open) => !open)}
                type="button"
              >
                <MenuToggleIcon />
              </button>

              <nav className="site-nav site-nav--desktop" aria-label="Primary">
                {primaryNavigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      isActive ? "site-nav__link is-active" : "site-nav__link"
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </header>

          {isMobileNavOpen ? (
            <div aria-label="Primary navigation" aria-modal="true" className="mobile-drawer" role="dialog">
              <button
                aria-label="Close navigation menu"
                className="mobile-drawer__backdrop"
                onClick={() => setIsMobileNavOpen(false)}
                type="button"
              />
              <div className="mobile-drawer__panel">
                <div className="mobile-drawer__header">
                  <div className="mobile-drawer__intro">
                    <p className="mobile-drawer__eyebrow">Quick Navigation</p>
                    <h2 className="mobile-drawer__title">Explore the station</h2>
                  </div>
                  <button
                    aria-controls="mobile-primary-navigation"
                    aria-expanded={isMobileNavOpen}
                    aria-label="Close navigation menu"
                    className="menu-toggle menu-toggle--drawer is-active"
                    onClick={() => setIsMobileNavOpen(false)}
                    type="button"
                  >
                    <MenuToggleIcon />
                  </button>
                </div>

                <nav className="site-nav site-nav--mobile" id="mobile-primary-navigation" aria-label="Primary">
                  {primaryNavigation.map((item) => (
                    <NavLink
                      key={`mobile-${item.to}`}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        isActive ? "site-nav__link is-active" : "site-nav__link"
                      }
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          ) : null}

          <main className="site-main">
            <div className="route-stage" key={location.pathname}>
              {children}
            </div>
          </main>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <a className="site-footer__brand" href="/">
                <AppImage
                  className="site-footer__brand-mark"
                  src="/images/branding/Asingan-fs-new-logo.jpeg"
                  alt="Asingan Fire Station logo"
                  skeleton={false}
                />
                <span className="site-footer__brand-copy">
                  <span className="site-footer__brand-eyebrow">Bureau of Fire Protection</span>
                  <span className="site-footer__brand-title">Asingan Fire Station</span>
                  <span className="site-footer__brand-meta">{stationRegion}</span>
                  <span className="site-footer__brand-address">{stationFullAddress}</span>
                </span>
              </a>

              <div className="site-footer__rail" aria-label="Station contact details">
                <div className="site-footer__panel site-footer__panel--location">
                  <p className="site-footer__eyebrow">Visit Us</p>
                  <a
                    className="site-footer__address"
                    href={stationMapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="site-footer__icon-badge site-footer__icon-badge--maps">
                      <GoogleMapsIcon />
                    </span>
                    <span className="site-footer__address-copy">
                      <span className="site-footer__address-line site-footer__desktop-only">
                        Google location
                      </span>
                      <span className="site-footer__address-line site-footer__mobile-only">
                        Google Maps
                      </span>
                      <span className="site-footer__address-link site-footer__mobile-only">
                        Open in Maps
                      </span>
                      <span className="site-footer__address-link site-footer__desktop-only">
                        Open in Google Maps
                      </span>
                    </span>
                  </a>
                </div>

                <div className="site-footer__panel site-footer__panel--contact">
                  <p className="site-footer__eyebrow">Need Help?</p>
                  <a className="site-footer__action" href={`tel:${stationPhoneNumber}`}>
                    <span className="site-footer__icon-badge site-footer__icon-badge--phone">
                      <PhoneIcon />
                    </span>
                    <span className="site-footer__action-copy">
                      <span className="site-footer__action-title site-footer__desktop-only">
                        Need help? Call us
                      </span>
                      <span className="site-footer__action-title site-footer__mobile-only">Call us</span>
                      <span className="site-footer__action-value">{stationPhoneNumber}</span>
                    </span>
                  </a>
                </div>

                <div className="site-footer__panel site-footer__panel--social">
                  <p className="site-footer__eyebrow">Stay Connected</p>
                  <a
                    className="site-footer__action site-footer__action--facebook"
                    href={officialFacebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit the official Asingan Fire Station Facebook page"
                  >
                    <span className="site-footer__icon-badge site-footer__icon-badge--facebook">
                      <FacebookIcon />
                    </span>
                    <span className="site-footer__action-copy">
                      <span className="site-footer__action-title site-footer__desktop-only">
                        Find us on Facebook
                      </span>
                      <span className="site-footer__action-title site-footer__mobile-only">
                        Facebook
                      </span>
                      <span className="site-footer__action-value site-footer__mobile-only">
                        Official station page
                      </span>
                      <span className="site-footer__action-value site-footer__desktop-only">
                        Official station page
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              <p className="site-footer__credit">
                <span className="site-footer__copyright">© {siteYear} Asingan Fire Station.</span>{" "}
                <span className="site-footer__crafted">Crafted by John Michael Benito</span>
              </p>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Unexpected error";
  let details = "Something went wrong while loading the station website.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page not found" : `${error.status} error`;
    details =
      error.status === 404
        ? "The page you requested could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Layout>
      <section className="page">
        <div className="page__container">
          <div className="error-panel" data-reveal-stage="surface">
            <p className="eyebrow">Notice</p>
            <h1>{message}</h1>
            <p>{details}</p>
            {stack ? <pre className="error-panel__stack">{stack}</pre> : null}
          </div>
        </div>
      </section>
    </Layout>
  );
}
