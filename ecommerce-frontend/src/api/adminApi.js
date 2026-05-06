import axiosInstance from "./axiosInstance";

// Products
export const adminGetProducts = ()         => axiosInstance.get("/admin/products");
export const adminCreateProduct = (data)   => axiosInstance.post("/admin/products", data);
export const adminUpdateProduct = (id, d)  => axiosInstance.put(`/admin/products/${id}`, d);
export const adminDeleteProduct = (id)     => axiosInstance.delete(`/admin/products/${id}`);

// Users
export const adminGetUsers = ()            => axiosInstance.get("/admin/users");
export const adminDeleteUser = (id)        => axiosInstance.delete(`/admin/users/${id}`);

// Carts
export const adminGetCarts = ()            => axiosInstance.get("/admin/carts");