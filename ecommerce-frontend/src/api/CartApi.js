import axiosInstance from "./axiosInstance";

export const getCart    = ()           => axiosInstance.get("/cart");
export const addToCart  = (data)       => axiosInstance.post("/cart", data);
export const updateItem = (id, qty)    => axiosInstance.put(`/cart/${id}`, { quantity: qty });
export const removeItem = (id)         => axiosInstance.delete(`/cart/${id}`);
export const clearCart  = ()           => axiosInstance.delete("/cart");