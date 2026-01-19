//src\services\cartApi.js

import api from "./api";

/**
 * Add / update cart
 * POST /api/v1/common/orders/add-to-cart/
 */
export const addToCartApi = async ({
  menuIds = [],
  productIds = [],
  quantity,
}) => {
  const res = await api.post(
    "/api/v1/common/orders/add-to-cart/",
    {
      menu_ids: menuIds,
      product_ids: productIds,
      quantity, // ABSOLUTE quantity
    }
  );
  return res.data;
};


/**
 * Get cart list
 * POST /api/v1/common/orders/cart-list/
 */
export const getCartList = async (payload) => {
  // ✅ DO NOT destructure
  const res = await api.post(
    "/api/v1/common/orders/cart-list/",
    payload
  );
  return res.data;
};

/**
 * Go to cart (finalize cart)
 * POST /api/v1/common/orders/go-to-cart/
 */
export const goToCartApi = async () => {
  const res = await api.post("/api/v1/common/orders/go-to-cart/", {});
  return res.data;
};

/**
 * Update cart item quantity
 * POST /api/v1/common/orders/update-cart/
 */
export const updateCartApi = async ({ cart_item_id, quantity }) => {
  const res = await api.post(
    "/api/v1/common/orders/update-cart/",
    {
      cart_item_id,
      quantity,
    }
  );
  return res.data;
};

/**
 * Remove cart item
 * POST /api/v1/common/orders/remove/
 */
export const removeCartItemApi = async ({ cart_item_id }) => {
  const res = await api.post(
    "/api/v1/common/orders/remove/",
    {
      cart_item_id,
    }
  );
  return res.data;
};
