const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 59.99,
    stock: 5,
    image: "https://picsum.photos/seed/headphones/200/300",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.99,
    stock: 3,
    image: "https://picsum.photos/seed/keyboard/200/300",
  },
  {
    id: 3,
    name: "USB-C Hub",
    price: 29.99,
    stock: 8,
    image: "https://picsum.photos/seed/usbhub/200/300",
  },
  {
    id: 4,
    name: "Webcam HD",
    price: 49.99,
    stock: 2,
    image: "https://picsum.photos/seed/webcam/200/300",
  },
  {
    id: 5,
    name: "Desk Lamp",
    price: 34.99,
    stock: 0,
    image: "https://picsum.photos/seed/lamp/200/300",
  },
];

let cart = [];
let couponApplied = false;
let discountRate = 0.1;

// ---- Rendering ----

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div style="background:#ddd;height:140px;border-radius:6px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;"><img src=${product.image} alt="Description of image" width="300" height="200">   </div>
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>
      <p class="stock">${product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}</p>
      <button onclick="addToCart(${product.id})" ${product.stock === 0 ? "disabled" : ""}>Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML =
      '<p style="color:#999;text-align:center;margin:20px 0;">Cart is empty</p>';
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="item-info">
        <strong>${item.name}</strong><br/>
        $${item.price} each
      </div>
      <div class="item-qty">
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
      <button onclick="removeItem('${item.id}')" style="color:red;border:none;background:none;cursor:pointer;font-size:18px;">×</button>
    `;
    container.appendChild(div);
  });

  updateCartCount();
  calculateTotal();
}

// ---- Cart Actions ----

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((c) => c.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  renderCart();
}

function updateQuantity(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;

  const filterProduct = products.filter((cur) => cur.id === id); //can't add item more than stock

  if (delta === 1) {
    if (item.quantity !== 0 && item.quantity < filterProduct[0].stock) {
      item.quantity += delta;
    } else {
      alert(
        `You can add maximum ${filterProduct[0].stock} items for this product`,
      );
    }
  } else if (delta === -1) {
    if (item.quantity > 1) {
      item.quantity += delta;
    } else {
      cart = cart.filter((c) => c.id !== id);
    }
  }
  renderCart();
}

function removeItem(id) {
  //!
  cart = cart.filter((c) => c.id !== id);
  renderCart();
}

// ---- Totals ----

function updateCartCount() {
  // document.getElementById("cartCount").textContent = cart.length;
  // console.log("cart count: ",cart);
  
  const totalQuantity = cart.reduce((acc,ele)=>{
    return acc+ele.quantity
  },0)
  document.getElementById("cartCount").textContent = totalQuantity;

}

function calculateTotal() {
  const subtotal = Math.round(cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ))

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("discount").textContent = discount.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// ---- Coupon ----

function applyCoupon() {
  const code = document.getElementById("couponInput").value;
  const msg = document.getElementById("couponMsg");

  if (code.toLowerCase() === "SAVE20".toLowerCase()) {
    if (couponApplied) {
      msg.textContent = "Coupon already applied";
      msg.style.color = "orange";
      return;
    }
    discountRate += 0.2;
    couponApplied = true;
    msg.textContent = "Coupon applied! Extra 20% off.";
    msg.style.color = "green";
  } else {
    msg.textContent = "Invalid coupon code.";
    msg.style.color = "red";
  }
  calculateTotal();
  document.getElementById("couponInput").value = "";
}

// ---- Checkout ----

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Order placed successfully! Thank you for your purchase.");
  cart = [];
  couponApplied = false;
  discountRate = 0.1;
  document.getElementById("couponMsg").textContent = "";
  renderCart();
}

// ---- Sidebar Toggle ----

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("hidden");
}

// ---- Init ----
renderProducts();
renderCart();
