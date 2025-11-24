import React from 'react';
import '../styles/site-footer.css';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top container">
        <div className="footer-col footer-brand">
          <small className="welcome">Welcome to</small>
          <h2 className="brand-title">Tos Kamong</h2>
        </div>

        <div className="footer-col footer-links">
          <h4>QuickLinks</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/discount">Discount</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/menu">Menu</a></li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h4>Lets chat!</h4>
          <p className="contact-email">hello@unstructured.io</p>
          <div className="socials">
            <a className="social-btn" href="#" aria-label="twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 5.92c-.63.28-1.3.48-2 .57.72-.44 1.27-1.13 1.53-1.95-.68.4-1.43.69-2.23.85C18.6 4.48 17.6 4 16.5 4c-1.47 0-2.66 1.19-2.66 2.66 0 .21.02.42.07.62-2.21-.11-4.17-1.17-5.49-2.79-.23.4-.36.86-.36 1.35 0 .93.47 1.75 1.18 2.23-.55-.02-1.07-.17-1.52-.42v.04c0 1.3.93 2.39 2.16 2.64-.23.06-.48.09-.73.09-.18 0-.36-.02-.53-.05.36 1.12 1.4 1.94 2.64 1.97-1 .78-2.26 1.24-3.63 1.24-.24 0-.48-.01-.71-.04C6.9 19.29 8.72 20 10.73 20c6.44 0 9.96-5.34 9.96-9.97v-.45c.68-.5 1.27-1.12 1.74-1.83-.62.27-1.29.46-1.98.55z"/></svg>
            </a>
            <a className="social-btn" href="#" aria-label="linkedin">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v12h-4V8zm7 0h3.6v1.6h.05c.5-.95 1.74-1.95 3.58-1.95 3.83 0 4.54 2.5 4.54 5.75V20h-4v-5.25c0-1.25 0-2.86-1.74-2.86-1.75 0-2.02 1.37-2.02 2.75V20h-4V8z"/></svg>
            </a>
            <a className="social-btn" href="#" aria-label="slack">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5.5 9C6.328 9 7 8.328 7 7.5S6.328 6 5.5 6 4 6.672 4 7.5 4.672 9 5.5 9zM6 10H4v6h2v-6zM9 5.5C9 4.672 9.672 4 10.5 4S12 4.672 12 5.5 11.328 7 10.5 7 9 6.328 9 5.5zM8 6v2H2V6h6zM17.5 14c-.828 0-1.5.672-1.5 1.5S16.672 17 17.5 17 19 16.328 19 15.5 18.328 14 17.5 14zM16 13v6h6v-6h-6zM14 5.5C14 4.672 14.672 4 15.5 4S17 4.672 17 5.5 16.328 7 15.5 7 14 6.328 14 5.5zM13 6v2h6V6h-6z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="site-footer-bottom container">
        <div className="bottom-left"><a href="/privacy">Privacy Policy</a></div>
        <div className="bottom-right">Copyright © {new Date().getFullYear()} Unstructured</div>
      </div>
    </footer>
  );
}
