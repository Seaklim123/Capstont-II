import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1> Welcome to Smart QR Ordering</h1>
      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        Scan the QR code on your table to view the menu, order food, and track your order easily.
      </p>

      <div style={{ marginTop: "30px" }}>
        <Link
          to="/menu"
          style={{
            backgroundColor: "#4b8ee2",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          View Menu
        </Link>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>How It Works</h3>
        <ol style={{ textAlign: "left", display: "inline-block" }}>
          <li>Scan the QR code placed on your table.</li>
          <li>Browse the digital menu and choose your favorite dishes.</li>
          <li>Place your order directly from your phone.</li>
          <li>Track your order status in real time.</li>
          <li>Pay online securely and enjoy your meal!</li>
        </ol>
      </div>
    </div>
  );
}

export default Home;
