function getCart(){ return JSON.parse(localStorage.getItem("cart")||"[]"); }
function setCart(cart){ localStorage.setItem("cart", JSON.stringify(cart)); }

function updateCartCount(){
  const count = getCart().reduce((a,b)=>a+b.qty,0);
  document.getElementById("cart-count").textContent = count;
}

// Add product
function addToCart(product){
  const cart = getCart();
  const idx = cart.findIndex(i=>i.productId===product._id);
  if(idx>-1){
    cart[idx].qty = Math.min(cart[idx].qty+1, product.countInStock);
  } else {
    cart.push({...product, qty:1, productId:product._id});
  }
  setCart(cart);
  updateCartCount();
  alert(`${product.name} added to cart`);
}

// Render cart
function renderCart(){
  const cart = getCart();
  const list = document.getElementById("cart-items");
  list.innerHTML="";
  let subtotal=0;
  cart.forEach((item,idx)=>{
    subtotal += item.price*item.qty;
    const row = document.createElement("div");
    row.className="row";
    row.innerHTML = `
      <div>${item.name}</div>
      <div>₹${item.price} x ${item.qty}</div>
      <button class="inc">+</button>
      <button class="dec">-</button>
      <button class="rem">Remove</button>
    `;
    row.querySelector(".inc").addEventListener("click", ()=>{
      if(item.qty<item.countInStock) item.qty++;
      setCart(cart); renderCart();
    });
    row.querySelector(".dec").addEventListener("click", ()=>{
      item.qty=Math.max(1,item.qty-1);
      setCart(cart); renderCart();
    });
    row.querySelector(".rem").addEventListener("click", ()=>{
      cart.splice(idx,1);
      setCart(cart); renderCart();
    });
    list.appendChild(row);
  });
  document.getElementById("subtotal").textContent = subtotal.toFixed(0);
}
