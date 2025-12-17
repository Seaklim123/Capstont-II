// src/services/orders.js

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/v1/auth`;

export const ordersApi = {
  
    getAllOrders: async () => {
    try {
      console.log("Fetching orders...");

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      console.log("Orders fetched:", data);
      return data;

    } catch (error) {
      console.error(" Error fetching orders:", error);
      return null;
    }
  },
  
    createOrder: async (orderData) => {
    console.log(" Sending Order Payload:", orderData);

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If no token required, remove Authorization
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      console.log("Order created successfully:", data);
      return data;
      
    } catch (error) {
      console.error(" Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  
};
