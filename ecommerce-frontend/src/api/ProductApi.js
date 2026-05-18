import axiosInstance from "./axiosInstance";

// Paginated — default 12 per page
export const getAllProducts = (page = 0, size = 12, sort = "newest") =>
  axiosInstance.get("/products", { params: { page, size, sort } });

export const getProductById = (id) =>
  axiosInstance.get(`/products/${id}`);

// Paginated search
export const searchProducts = (keyword, category, page = 0, size = 12) =>
  axiosInstance.get("/products/search", {
    params: { keyword, category, page, size },
  });

export const addProduct = (data) =>
  axiosInstance.post("/products", data);