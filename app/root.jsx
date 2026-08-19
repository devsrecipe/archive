import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./styles/global.css";

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Mansura Mira — Full Stack Development Team. We turn your ideas into real-life digital products. Web platforms, mobile apps, and scalable backend systems." />
        <meta name="keywords" content="full stack developer, web development, mobile app development, React, Node.js, Mansura Mira, agency portfolio" />
        <meta property="og:title" content="Mansura Mira — Digital Solutions Agency" />
        <meta property="og:description" content="We turn your ideas into real-life digital products. Full-stack web, mobile, and backend solutions." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#0a0a12" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <title>Mansura Mira — Digital Solutions Agency</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
