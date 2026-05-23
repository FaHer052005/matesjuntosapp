import { apiFetch } from "./client";

export function login(username, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchMe() {
  return apiFetch("/api/auth/me");
}

export function fetchProducts() {
  return apiFetch("/api/products");
}

export function createProduct(payload) {
  return apiFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload) {
  return apiFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id) {
  return apiFetch(`/api/products/${id}`, { method: "DELETE" });
}

export function fetchSales() {
  return apiFetch("/api/sales");
}

export function createSale(payload) {
  return apiFetch("/api/sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
