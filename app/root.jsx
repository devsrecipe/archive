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
        <meta name="description" content="devsrecipe — Full-stack software engineering studio specializing in web platforms, mobile applications, and scalable cloud architectures." />
        <meta name="keywords" content="devsrecipe, software engineering, full stack development, web development, React, Next.js, Node.js, enterprise apps" />
        <meta property="og:title" content="devsrecipe — Digital Product Engineering Studio" />
        <meta property="og:description" content="We transform complex ideas into high-performance, scalable digital products. Web platforms, mobile apps, and cloud backend solutions." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <title>devsrecipe — Digital Product Engineering Studio</title>
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
