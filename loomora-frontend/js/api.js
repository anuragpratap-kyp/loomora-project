// --- API base ---
const API_BASE = localStorage.getItem("VC_BASE") || "https://loomora-weav.onrender.com/api";

// --- helpers ---
const token = () => localStorage.getItem("token");
const user = () => JSON.parse(localStorage.getItem("user") || "null");

// GET request
async function apiGet(path) {
  try {
    const res = await fetch(API_BASE + path);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Auth request (login / register)
async function apiAuth(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}

// Authenticated request (with token)
async function apiRequest(method, path, body) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return await res.json();
}

// Cart count helper
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const el = document.getElementById("nav-cart-count");
  if (el) el.textContent = (cart || []).reduce((n, p) => n + p.qty, 0);
}

// Product card renderer
function productCardHTML(p) {
  return `
    <div class="card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} ₹</p>
    </div>
  `;
}
