//src\services\rewardsApi.js

import api from "./api";

export const fetchRewardsApi = async () => {
  try {
    const res = await api.get("/api/v1/common/orders/rewards/");
    return res.data;
  } catch (err) {
    console.error("Rewards API error:", err);
    return null;
  }
};

export const spinWheelApi = async () => {
  const res = await api.post("/api/v1/common/orders/spin/");
  return res.data;
};

export const spinStatusApi = async () => {
  const res = await api.get("/api/v1/common/orders/spin-status/");
  return res.data;
};