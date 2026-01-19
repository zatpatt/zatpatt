//src\services\searchApi.js

import api from "./api";

/**
 * Search products
 * POST /api/v1/common/orders/search/?search=query
 */
export const searchProductsApi = async (search) => {
  const res = await api.get(
    `/api/v1/common/orders/search/?search=${encodeURIComponent(search)}`,
    {}
  );
  return res.data;
};
