/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// app/layout.tsx
"use client";
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body>
        <header className="bg-white shadow-sm py-2 py-md-3 dark:bg-gray-900">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <Link href="/" className="text-decoration-none text-success fw-bold d-flex align-items-center gap-2">
                <div className="d-flex align-items-center">
                  <Image
                    src="/logo.svg"
                    alt="Kenyan Petitions Logo"
                    width={26 * 0.4}
                    height={48 * 0.4}
                    className="d-inline-block"
                    style={{
                      height: 'auto',
                      maxHeight: '50px',
                      width: 'auto'
                    }}
                    priority
                  />
                  <span className="ms-2 fs-5 fs-md-4">Kenyan Petitions</span>
                </div>
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn btn-sm btn-outline-secondary"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>

            </div>
          </div>
        </header>

        <main className="container py-4" style={{ maxWidth: '800px' }}>
          {children}
        </main>

        <footer className="bg-white py-3 border-top text-center text-muted small dark:bg-gray-900">
          <div className="container">
            Empowering Kenyan citizens through digital advocacy
          </div>
        </footer>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          async
        />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
