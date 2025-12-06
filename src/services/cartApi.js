// cartService.js
const API_BASE_URL = "http://localhost:8000/api/v1/auth/carts";

export const cartService = {
  getCart: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      const result = await response.json();
      // 👇 Ensure you return the array, not the wrapper object
      return result.data || result; 
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },
};
