function qs(key){ return new URLSearchParams(location.search).get(key); }

window.addEventListener('DOMContentLoaded', async ()=>{
  updateNavAuth();
  updateCartCount();
  const id = qs('id');
  const p = await apiGet('/products/' + id);
  const el = document.getElementById('prod-container');
  if(!p || p.message){ el.innerHTML = '<p>Product not found.</p>'; return; }
  el.innerHTML = `
    <div class="grid" style="grid-template-columns: 1fr 1fr;">
      <img src="${p.image}" style="width:100%;border-radius:16px;border:1px solid var(--border)" alt="${p.name}">
      <div>
        <h2>${p.name}</h2>
        <div class="price">₹${p.price}</div>
        <p>${p.description}</p>
        <div class="muted">Stock: ${p.countInStock}</div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn" onclick='addToCart("${p._id}","${p.name.replace(/"/g,"&quot;")}","${p.image}",${p.price})'>Add to Cart</button>
          <a class="btn" href="cart.html">Go to Cart</a>
        </div>
      </div>
    </div>
  `;
});
