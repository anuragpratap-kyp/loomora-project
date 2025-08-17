const form = document.getElementById("checkout-form");
form.addEventListener("submit", async e=>{
  e.preventDefault();
  const u = user();
  if(!u){ location.href="login.html"; return; }

  const cart = getCart();
  if(!cart.length){ alert("Cart empty"); return; }

  const body = {
    orderItems: cart.map(c=>({name:c.name, qty:c.qty, image:c.image, price:c.price, product:c.productId})),
    shippingAddress:{
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postal").value,
      country: document.getElementById("country").value
    },
    paymentMethod:"COD"
  };

  const res = await apiAuthed("POST","/orders",body);
  if(res._id){
    localStorage.removeItem("cart");
    updateCartCount();
    alert(`Order placed! ID: ${res._id}`);
    location.href="shop.html";
  } else alert(res.message || "Order failed");
});
