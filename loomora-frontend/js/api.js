// --- API Base ---
const API_BASE = localStorage.getItem('API_BASE') || 'http://localhost:5000/api';

// --- Helpers ---
const token = () => localStorage.getItem('token');
const user  = () => JSON.parse(localStorage.getItem('user') || 'null');

async function apiGet(path){
  try{
    const res = await fetch(API_BASE + path);
    return await res.json();
  }catch(e){ console.error(e); return null; }
}

async function apiAuth(path, body){
  const res = await fetch(API_BASE + path, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function apiAuthed(method, path, body){
  const res = await fetch(API_BASE + path, {
    method,
    headers:{
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token()
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

// UI helpers
function updateCartCount(){
  const c = JSON.parse(localStorage.getItem('cart')||'[]');
  const el = document.getElementById('nav-cart-count');
  if(el) el.textContent = c.reduce((s,i)=>s+i.qty,0);
}

function productCardHTML(p){
  return `
  <div class="card">
    <img src="${p.image}" alt="${p.name}">
    <div class="pad">
      <h3>${p.name}</h3>
      <div class="price">₹${p.price}</div>
      <div class="muted" style="min-height:38px">${p.description.slice(0,60)}...</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <a class="btn" href="product.html?id=${p._id}">View</a>
        <button class="btn" onclick='addToCart("${p._id}","${p.name.replace(/"/g,"&quot;")}","${p.image}",${p.price})'>Add</button>
      </div>
    </div>
  </div>`;
}
