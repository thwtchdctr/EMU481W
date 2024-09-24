// page.js (Home Page)

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const data = { email: loginEmail, password: loginPassword };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Login successful');
        router.push('/logintesting');
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Header with Login Form */}
      <header style={headerStyle}>
        <form onSubmit={handleLoginSubmit} style={loginFormStyle}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      </header>

      {/* Centered Welcome Text */}
      <main style={mainContentStyle}>
        <h1 style={welcomeTextStyle}>WELCOME TO INSERT APP NAME HERE</h1>
        <div style={registrationLinkContainer}>
          <Link href='/registration-page'>
            Register Here
          </Link>
        </div>
      </main>
    </div>
  );
}

/* Styling */
const pageStyle = {
  backgroundColor: '#2f2f2f', // Slate grey background
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: '#2f2f2f', // Match header to background
  padding: '10px',
  color: 'white',
};

const loginFormStyle = {
  display: 'flex',
  alignItems: 'center',
};

const inputStyle = {
  marginRight: '10px',
  padding: '5px',
  fontSize: '14px',
  backgroundColor: 'white',
  color: '#000',
  border: '1px solid #ccc',
  borderRadius: '3px',
};

const buttonStyle = {
  padding: '5px 10px',
  backgroundColor: 'white',
  color: '#3b5998',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
};

const mainContentStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const welcomeTextStyle = {
  fontSize: '3rem', // Large bold text
  color: 'white',
  fontWeight: 'bold',
  fontFamily: "'Poppins', sans-serif", // Sleek fintech style
  textAlign: 'center',
  marginBottom: '20px',
};

const registrationLinkContainer = {
  marginTop: '20px',
  fontSize: '1.2rem',
  color: 'white',
};
