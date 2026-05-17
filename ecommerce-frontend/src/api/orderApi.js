import axiosInstance from "./axiosInstance";

export const checkout = (data) =>
  axiosInstance.post("/orders/checkout", data);

export const getMyOrders = () =>
  axiosInstance.get("/orders");

export const getOrderById = (id) =>
  axiosInstance.get(`/orders/${id}`);

// ── Admin ─────────────────────────────────────────────

export const adminGetOrders = () =>
  axiosInstance.get("/admin/orders");

export const adminUpdateStatus = (id, status) =>
  axiosInstance.put(`/admin/orders/${id}/status`, {
    status,
  });