// used by index + shop pages to render product cards (HTML comes from api.js)
async function addToCart(id, name, image, price){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const idx = cart.findIndex(i => i.productId===id);
  if(idx>-1) cart[idx].qty += 1;
  else cart.push({ productId:id, name, image, price, qty:1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

window.addEventListener('DOMContentLoaded', ()=>{
  // only to ensure nav numbers update when landing directly
  updateCartCount();
});
