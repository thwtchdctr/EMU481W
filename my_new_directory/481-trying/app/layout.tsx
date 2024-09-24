import './globals.css';
import Link from 'next/link';
import Head from 'next/head';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Financial Literacy Website</title>
      </Head>
      <body>
        <header>
          <nav style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Link href="/" className="button">Home</Link>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <Link href="/calculator" className="button">Calculators</Link>
              <Link href="/news" className="button">News</Link>
              <Link href="/nlp" className="button">NLP Insights</Link>
              <Link href="/login" className="button">Log In</Link>
              <Link href="/signup" className="button">Sign Up</Link>
            </div>
          </nav>
        </header>
        <main style={{ marginTop: '60px' }}>
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;


