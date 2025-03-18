document.addEventListener("DOMContentLoaded", async () => {
    // 🎯 Elements
    const cartButton = document.getElementById("cartButton");
    const cartContainer = document.getElementById("cartContainer");
    const closeCart = document.getElementById("closeCart");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartCountElement = document.getElementById("cart-count");
    const productContainer = document.getElementById("product-container");
   
    const featuredContainer = document.getElementById("featured-container");
 
    const input = document.getElementById("input"); // Desktop search input
    const mobileInput = document.getElementById("mobileInput"); // Mobile search input


    

 
    // 🛒 Toggle cart sidebar
    cartButton.addEventListener("click", () => cartContainer.classList.toggle("translate-x-full"));
    closeCart.addEventListener("click", () => cartContainer.classList.add("translate-x-full"));

    let allProducts = []; // Global variable to store products

    // 🛍 Fetch and Display Products
    async function fetchProducts() {
        try {
            const res = await fetch("https://fakestoreapi.com/products");
            allProducts = await res.json(); // Store API data
            localStorage.setItem("allProducts", JSON.stringify(allProducts)); // Save to local storage
            displayProducts(allProducts); 
            displayFeaturedProducts();// Update UI
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // 🔎 Search Functionality (For Desktop)
    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const searchValue = input.value.trim().toLowerCase();
          mobileInput.value=searchValue;
            filterProducts(searchValue);
        }
    });

    // 🔎 Search Functionality (For Mobile)
    mobileInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const searchValue = mobileInput.value.trim().toLowerCase();
            input.value=searchValue;
            filterProducts(searchValue);
        }
    });

    // 🔎 Filter Products Properly
    function filterProducts(filter = "") {
        if (allProducts.length === 0) {
            allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
        }
    
        const filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(filter) || 
            product.category.toLowerCase().includes(filter)
        );
    
        // Update UI
        if (filteredProducts.length === 0) {
            productContainer.innerHTML = `<p class="text-center text-gray-600">No products found</p>`;
        } else {
            displayProducts(filteredProducts);
        }
    }

    // 📌 Display Products
    function displayProducts(productsArr) {
        productContainer.innerHTML = productsArr.map(product => createProductCard(product)).join("");
    }

    // 📌 Create Product Card
    function createProductCard(product) {
        return `
            <div class="card border p-4 rounded shadow-lg">
                <img src="${product.image}" alt="${product.title}" class="w-full h-40 object-contain">
                <h2 class="text-lg font-semibold mt-2 product-name">${product.title}</h2>
                <p class="text-gray-600 font-semibold">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mt-2">Add to Cart</button>
            </div>
        `;
    }
    function displayFeaturedProducts() {
        const featuredProducts = allProducts.slice(0, 4); // Get first 4 products
        featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join("");
    }
    // 🚀 Fetch products on page load
    await fetchProducts();


    // 🛒 Add to Cart
    window.addToCart = function (productId) {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
        let selectedProduct = allProducts.find(item => item.id === productId);

        if (!selectedProduct) return alert("Error: Product not found!");

        let existingItem = cartItems.find(item => item.id === selectedProduct.id);
        existingItem ? existingItem.quantity++ : cartItems.push({ ...selectedProduct, quantity: 1 });

        localStorage.setItem("cartItem", JSON.stringify(cartItems));
        updateCartUI();
    };

    // 🔄 Update Cart UI
    function updateCartUI() {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];

        cartItemsContainer.innerHTML = cartItems.length === 0
            ? `<p class="text-center text-gray-500">Your cart is empty</p>`
            : cartItems.map(item => createCartItem(item)).join("");

        let totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        cartCountElement.textContent = totalQuantity;
        cartCountElement.classList.toggle("hidden", totalQuantity === 0);
    }

    // 📌 Create Cart Item (Reusable)
    function createCartItem(item) {
        return `
            <div class="cart-item flex items-center gap-4 p-3 border-b bg-gray-50 rounded-lg shadow-sm">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-md border">
                <div class="flex-1">
                    <h3 class="text-sm font-semibold text-gray-800">${item.title}</h3>
                    <p class="text-gray-600 text-xs">$${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="changeQuantity(${item.id}, 'decrease')" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">-</button>
                    <span class="text-gray-800 font-semibold">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 'increase')" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">+</button>
                    <button onclick="removeFromCart(${item.id})" class="px-3 py-1 text-red-500 hover:text-red-700">✖</button>
                </div>
            </div>
        `;
    }

    // ➕➖ Change Cart Item Quantity
    window.changeQuantity = function (id, action) {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
        let updatedCart = cartItems.map(item => {
            if (item.id === id) {
                if (action === "decrease" && item.quantity > 1) item.quantity--;
                else if (action === "increase") item.quantity++;
            }
            return item;
        }).filter(item => item.quantity > 0);

        localStorage.setItem("cartItem", JSON.stringify(updatedCart));
        updateCartUI();
    };

    // ❌ Remove Item from Cart
    window.removeFromCart = function (id) {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem("cartItem", JSON.stringify(cartItems));
        updateCartUI();
    };

    // ⭐ Display Featured Products
    function displayFeaturedProducts() {
        const featuredProducts = allProducts.slice(0, 3);
        featuredContainer.innerHTML = featuredProducts.map(product => createFeaturedCard(product)).join("");
    }

    // 📌 Create Featured Product Card (Reusable)
    function createFeaturedCard(product) {
        return `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4 text-center hover:shadow-xl transition transform hover:scale-105">
                <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover">
                <h2 class="text-lg font-semibold mt-2">${product.title}</h2>
                <p class="text-gray-600 font-semibold">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 rounded">Add to Cart</button>
            </div>
        `;
    }

    // 🚀 Fetch products & update cart UI on page load
    // await fetchProducts();
    updateCartUI();

});


document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("carousel-inner");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    let index = 0;
    const totalSlides = slides.length;
    let interval;

    function showSlide(i) {
        index = (i + totalSlides) % totalSlides;
        carousel.style.transition = "transform 0.5s ease-in-out";
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    function startAutoSlide() {
        interval = setInterval(() => {
            showSlide(index + 1);
        }, 3000);
    }

    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }

    prevBtn.addEventListener("click", () => {
        showSlide(index - 1);
        resetAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
        showSlide(index + 1);
        resetAutoSlide();
    });

    startAutoSlide();
});



document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.getElementById("menuButton");
    let mobileMenu = document.getElementById("mobileMenu");
    let desktopMenu = document.getElementById("desktopMenu");
    let cartButton = document.getElementById("cartButton");
    let mobileCartPlaceholder = document.getElementById("mobileCartPlaceholder");

    // Toggle Mobile Menu
    menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });

    function moveCartButton() {
        if (window.innerWidth < 640) {
            // Move Cart Button to Mobile Menu
            if (!mobileCartPlaceholder.contains(cartButton)) {
                mobileCartPlaceholder.appendChild(cartButton);
            }
        } else {
            // Move Cart Button Back to Desktop Menu
            if (!desktopMenu.contains(cartButton)) {
                desktopMenu.appendChild(cartButton);
            }
        }
    }

    // Run function on load and resize
    window.addEventListener("resize", moveCartButton);
    moveCartButton(); // Initial check on page load
});

