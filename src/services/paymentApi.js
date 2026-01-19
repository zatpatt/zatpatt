//src\services\paymentApi.js

import api from "./api";

export const initiatePaymentApi = async ({
  address_id,
  use_points,
  tip,
  code,
  payment_method,
  remark,
}) => {
  const res = await api.post(
    "/api/v1/common/orders/initiate-payment/",
    {
      address_id,
      use_points,
      tip,
      code,
      payment_method,
      remark,
    }
  );

  return res.data;
};
