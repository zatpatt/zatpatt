//src\services\promoApi.js

import api from "./api";

/**
 * Get available promo codes
 * GET /api/v1/common/orders/promotions-dropdown/
 */
export const getPromoCodes = async () => {
  const res = await api.get(
    "/api/v1/common/orders/promotions-dropdown/"
  );
  return res.data;
};
