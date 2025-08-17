function setCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }

function render(){
  const list = document.getElementById('cart-items'); list.innerHTML='';
  const cart = getCart();
  let subtotal = 0;
  cart.forEach((i,idx)=>{
    subtotal += i.price * i.qty;
    list.insertAdjacentHTML('beforeend', `
      <div class="row">
        <div style="display:flex;gap:10px;align-items:center">
          <img src="${i.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
          <div>
            <div>${i.name}</div>
            <div class="muted">₹${i.price}</div>
          </div>
        </div>
        <div class="qty">
          <button onclick="dec(${idx})">-</button>
          <span>${i.qty}</span>
          <button onclick="inc(${idx})">+</button>
          <button onclick="rem(${idx})">Remove</button>
        </div>
      </div>
    `);
  });
  document.getElementById('subtotal').textContent = subtotal.toFixed(0);
  updateCartCount();
}

function inc(i){ const c=getCart(); c[i].qty++; setCart(c); render(); }
function dec(i){ const c=getCart(); c[i].qty = Math.max(1, c[i].qty-1); setCart(c); render(); }
function rem(i){ const c=getCart(); c.splice(i,1); setCart(c); render(); }

window.addEventListener('DOMContentLoaded', ()=>{
  updateNavAuth(); updateCartCount(); render();
});
