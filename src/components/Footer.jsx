const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span>&copy; 2025 QR Ordering System. All rights reserved.</span>
        </div>
        <div className="footer-right">
          <span>Version 1.0.0</span>
          <span className="footer-separator">|</span>
          <a href="#support" className="footer-link">Support</a>
          <span className="footer-separator">|</span>
          <a href="#docs" className="footer-link">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
