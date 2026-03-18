const API = "http://localhost:5000";

// LOGIN
function login() {
  const email = emailInput();
  const password = passwordInput();

  fetch(API + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(() => {
    localStorage.setItem("user", email);
    showApp();
  })
  .catch(() => {
    document.getElementById("error").innerText = "Invalid login";
  });
}

// HELPERS
function emailInput() {
  return document.getElementById("email").value;
}
function passwordInput() {
  return document.getElementById("password").value;
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// SHOW APP
function showApp() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("appPage").classList.remove("hidden");
  loadProducts();
  loadCart();
}

// PRODUCTS
function loadProducts() {
  fetch(API + "/products")
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("products");
      div.innerHTML = "";

      data.forEach(p => {
        div.innerHTML += `
          <div class="product">
            <img src="https://via.placeholder.com/150">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <button onclick='addToCart(${JSON.stringify(p)})'>Add</button>
          </div>
        `;
      });
    });
}

// ADD
function addToCart(p) {
  fetch(API + "/cart/add", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(p)
  }).then(() => loadCart());
}

// CART
function loadCart() {
  fetch(API + "/cart")
    .then(res => res.json())
    .then(data => {
      let total = 0;
      const div = document.getElementById("cartItems");
      div.innerHTML = "";

      data.forEach(item => {
        total += item.price * item.quantity;

        div.innerHTML += `
          <div class="cart-item">
            ${item.name} (${item.quantity})
            <div>
              <button onclick="updateQty(${item.id}, ${item.quantity-1})">-</button>
              <button onclick="updateQty(${item.id}, ${item.quantity+1})">+</button>
              <button onclick="removeItem(${item.id})">x</button>
            </div>
          </div>
        `;
      });

      document.getElementById("total").innerText = total;
    });
}

// UPDATE
function updateQty(id, quantity) {
  if (quantity <= 0) return removeItem(id);

  fetch(API + "/cart/update", {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id, quantity })
  }).then(() => loadCart());
}

// REMOVE
function removeItem(id) {
  fetch(API + "/cart/remove/" + id, {
    method: "DELETE"
  }).then(() => loadCart());
}

// AUTO LOGIN
if (localStorage.getItem("user")) {
  showApp();
}
