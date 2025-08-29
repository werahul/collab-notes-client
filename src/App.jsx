import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="logo">Collaborative Notes</Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">Built by Rahul Kumar for ScriptGuru Tech Solutions</footer>
    </div>
  );
}
