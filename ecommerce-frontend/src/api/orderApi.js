import axiosInstance from "./axiosInstance";

export const checkout    = (data) => axiosInstance.post("/orders/checkout", data);
export const getMyOrders = ()     => axiosInstance.get("/orders");
export const getOrderById = (id)  => axiosInstance.get(`/orders/${id}`);