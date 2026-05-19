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

import type { Route } from "./+types/root";
import "./app.css";

const navigation = [
  { to: "/", label: "Home", end: true },
  { to: "/history", label: "History" },
  { to: "/leadership", label: "Leadership" },
  { to: "/personnel", label: "Personnel" },
  { to: "/assets", label: "Assets" },
];

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
                <img
                  className="brand__mark"
                  src="/images/branding/Asingan-fs-old-logo-icon.png"
                  alt="Asingan Fire Station logo"
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
                <span className="menu-toggle__icon" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>

              <nav className="site-nav site-nav--desktop" aria-label="Primary">
                {navigation.map((item) => (
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
                  <button
                    aria-label="Close navigation menu"
                    className="mobile-drawer__close"
                    onClick={() => setIsMobileNavOpen(false)}
                    type="button"
                  >
                    <span className="mobile-drawer__close-icon" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </div>

                <nav className="site-nav site-nav--mobile" id="mobile-primary-navigation" aria-label="Primary">
                  {navigation.map((item) => (
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

          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <p>Asingan Fire Station serves the municipality through fire protection, prevention, and public safety work.</p>
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
          <div className="error-panel">
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
