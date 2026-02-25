// src/services/allInOneCartApi.js

import api from "./api";

/* ---------------- ADD TO CART ---------------- */

export const newAddToCartApi = async ({ productIds, quantity }) => {
  try {
    const res = await api.post(
      "/api/v1/common/orders/new-add-to-cart/",
      {
        product_ids: productIds,
        quantity,
      }
    );

    return res.data;
  } catch (err) {
    console.error("New Add to Cart failed", err);
    return { status: false };
  }
};


/* ---------------- GO TO CART ---------------- */

export const goToCartApi = async () => {
  try {
    const res = await api.post(
      "/api/v1/common/orders/go-to-cart/"
    );

    return res.data;
  } catch (err) {
    console.error("Go To Cart failed", err);
    return { success: false };
  }
};


/* ---------------- NEW CART LIST (FINAL PAGE) ---------------- */

export const newCartListApi = async ({
  addressId,
  usePoints = 0,
  tip = 0,
  code = "",
}) => {
  try {
    const res = await api.post(
      "/api/v1/common/orders/new-cart-list/",
      {
        address_id: addressId,
        use_points: usePoints,
        tip: tip,
        code: code,
      }
    );

    return res.data;
  } catch (err) {
    console.error("New Cart List failed", err);
    return { status: false };
  }
};
