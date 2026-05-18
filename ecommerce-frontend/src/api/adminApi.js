import axiosInstance from "./axiosInstance";

export const adminGetStats      = ()           => axiosInstance.get("/admin/stats");

export const adminGetProducts   = ()           => axiosInstance.get("/admin/products");
export const adminCreateProduct = (data)       => axiosInstance.post("/admin/products", data);
export const adminUpdateProduct = (id, data)   => axiosInstance.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id)         => axiosInstance.delete(`/admin/products/${id}`);

export const adminGetUsers      = ()           => axiosInstance.get("/admin/users");
export const adminDeleteUser    = (id)         => axiosInstance.delete(`/admin/users/${id}`);

export const adminGetCarts      = ()           => axiosInstance.get("/admin/carts");

export const adminGetOrders     = ()           => axiosInstance.get("/admin/orders");
export const adminUpdateStatus  = (id, status) => axiosInstance.put(`/admin/orders/${id}/status`, { status });