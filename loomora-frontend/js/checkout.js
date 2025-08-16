window.addEventListener('DOMContentLoaded', ()=>{
  updateNavAuth(); updateCartCount();
  const u = user();
  if(!u){ document.getElementById('note').textContent = 'Login required before placing order.'; }

  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!user()){ location.href='login.html'; return; }

    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    if(!cart.length){ alert('Cart is empty'); return; }

    const body = {
      orderItems: cart.map(c => ({
        name: c.name, qty: c.qty, image: c.image, price: c.price, product: c.productId
      })),
      shippingAddress:{
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postal').value,
        country: document.getElementById('country').value
      },
      paymentMethod: 'COD'
    };

    const res = await apiAuthed('POST', '/orders', body);
    if(res && res._id){
      localStorage.removeItem('cart');
      updateCartCount();
      alert('Order placed! (COD). Order ID: ' + res._id);
      location.href = 'shop.html';
    }else{
      alert(res?.message || 'Order failed');
    }
  });
});
