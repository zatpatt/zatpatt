//src\services\referralApi.js

import api from "./api";

export const fetchMyReferralApi = async () => {
  const response = await api.get("/api/v1/common/orders/my-referral/");
  return response.data;
};
