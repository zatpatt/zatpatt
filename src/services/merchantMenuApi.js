//src\services\merchantMenuApi.js

import api from "./api";

/**
 * Get merchant menu
 * POST /api/v1/common/orders/merchant-menu-list/
 *
 * @param {number} merchantId
 */
export const getMerchantMenu = async (merchantId) => {
  const res = await api.post(
    "/api/v1/common/orders/merchant-menu-list/",
    {
      merchant_id: merchantId,
    }
  );

  return res.data; // { status: true, data: [...] }
};
