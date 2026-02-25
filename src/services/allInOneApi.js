// src/services/allInOneApi.js

import api from "./api";

// Groceries
export const getGroceryList = async () => {
  const res = await api.get("/api/v1/common/orders/grocery-list/");
  return res.data;
};

// Snacks
export const getSnackList = async () => {
  const res = await api.get("/api/v1/common/orders/snack-list/");
  return res.data;
};

// Medical
export const getMedicalList = async () => {
  const res = await api.get("/api/v1/common/orders/medical-list/");
  return res.data;
};

// Pet Essentials
export const getPetEssentialsList = async () => {
  const res = await api.get("/api/v1/common/orders/pet-ess-list/");
  return res.data;
};

// Party Essentials
export const getPartyEssentialsList = async () => {
  const res = await api.get("/api/v1/common/orders/party-ess-list/");
  return res.data;
};

// Products by subcategory
export const getProductsBySubcategory = async (subcategoryId) => {
  const res = await api.post(
    "/api/v1/common/orders/list-product/",
    { subcategory: subcategoryId }
  );
  return res.data;
};

// Home Services
export const getHomeServicesList = async () => {
  const res = await api.get("/api/v1/common/orders/home-services-list/");
  return res.data;
};

// Grooming Services
export const getGroomingServicesList = async () => {
  const res = await api.get("/api/v1/common/orders/grooming-services-list/");
  return res.data;
};

// Services by subcategory
export const getServicesBySubcategory = async (subcategoryId) => {
  const res = await api.post(
    "/api/v1/common/orders/list-services/",
    { subcategory: subcategoryId }
  );
  return res.data;
};
