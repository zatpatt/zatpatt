//src\services\addressApi.js

import api from "./api";

/**
 * Create new address
 * POST /api/v1/common/orders/create/
 */
export const createAddress = async (payload) => {
  const res = await api.post(
    "/api/v1/common/orders/create/",
    payload
  );
  return res.data;
};

/**
 * Get address list
 * POST /api/v1/common/orders/address-list/
 */
export const getAddressList = async () => {
  const res = await api.post(
    "/api/v1/common/orders/address-list/",
    {}
  );
  return res.data; // { status, addresses: [...] }
};

/**
 * OPTIONAL (future)
 * You can later add:
 * - deleteAddress()
 * - setDefaultAddress()
 */
