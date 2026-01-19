//src\services\homeApi.js

import api from "./api";

/**
 * Get restaurant list for home
 * POST /api/v1/common/orders/restaurant-list/
 *
 * @param {Object} params
 * @param {string} params.search   - city / area / restaurant name
 * @param {string} params.food     - veg | non_veg
 */
export const getRestaurantList = async ({
  search = "",
  food = "",
} = {}) => {
  const payload = {};

  if (search) payload.search = search;
  if (food) payload.food = food;

  const res = await api.post(
    "/api/v1/common/orders/restaurant-list/",
    payload
  );

  return res.data; // { status, data }
};
