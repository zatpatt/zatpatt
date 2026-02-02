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
