// --- API Base ---
const API_BASE = localStorage.getItem('API_BASE') || "https://loomora-weav.onrender.com";

// --- Helpers ---
const token = () => localStorage.getItem('token');
const user = () => JSON.parse(localStorage.getItem('user') || 'null');

// GET request
async function apiGet(path){
  try {
    const res = await fetch(API_BASE + path);
    return await res.json();
  } catch(e) {
    console.error(e);
    return null;
  }
}

// Auth request (login / register)
async function apiAuth(path, body){
  const res = await fetch(API_BASE + path, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

// Authenticated request (with token)
async function apiAuthed(method, path, body){
  const res = await fetch(API_BASE + path, {
    method,
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer ' + token()
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

// Cart count helper
function updateCartCount(){
  const c = JSON.parse(localStorage.getItem('cart') || '[]');
  const el = document.getElementById('nav-cart-count');
  if(el) el.textContent = c.reduce((t,v)=>t+v.qty,0);
}

// Product card renderer
function productCardHtml(p){
  return `
    <div class="card">
      <div class="p-3">
        <img src="${p.image}" alt="${p.name}">
        <div>${p.name}</div>
        <div>${p.price}</div>
        <div class="text-sm text-muted">${p.description.slice(0,60)}</div>
        <button class="btn" onclick="addToCart('${p._id}', '${p.name.replace(/'/g,'')}', '${p.image}', ${p.price})">Add</button>
      </div>
    </div>
  `;
}
