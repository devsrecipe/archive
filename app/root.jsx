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
        <meta name="description" content="devsrecipe — Cook your idea with devsrecipe. High-performance web platforms, mobile applications, and scalable cloud architectures." />
        <meta name="keywords" content="devsrecipe, cook your idea with devsrecipe, software engineering, full stack development, web platforms, mobile apps, React, Next.js, Node.js" />
        <meta property="og:title" content="devsrecipe — Cook Your Idea with Devs Recipe" />
        <meta property="og:description" content="Cook your idea with devsrecipe into high-performance, scalable digital products and cloud architectures." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#050507" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <title>devsrecipe — Cook Your Idea with Devs Recipe</title>
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
