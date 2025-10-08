import { useState } from "react";
import MenuItem from "../components/MenuItem";

function Menu() {
  const [cart, setCart] = useState([]);

  const menuItems = [
    { id: 1, name: "Fried Rice", price: 3.5 },
    { id: 2, name: "Noodle Soup", price: 4.0 },
    { id: 3, name: "Iced Coffee", price: 2.0 },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Menu</h2>
      {menuItems.map((item) => (
        <MenuItem key={item.id} item={item} addToCart={addToCart} />
      ))}

      <h3>Your Order: {cart.length} items</h3>
      {cart.map((item, i) => (
        <p key={i}>
          {item.name} - ${item.price}
        </p>
      ))}
    </div>
  );
}

export default Menu;
