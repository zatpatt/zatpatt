

import api from "./api";


/**
 * Upload / update profile photo
 * POST /api/v1/common/orders/add-profile/
 */
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("profile_photo", file);

  const res = await api.post(
    "/api/v1/common/orders/add-profile/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};


export const fetchMyProfile = async () => {
  const res = await api.get(
    "/api/v1/common/orders/my-profile/"
  );
  return res.data;
};
