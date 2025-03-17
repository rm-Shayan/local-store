document.addEventListener("DOMContentLoaded", async () => {
    // Elements
    const cartButton = document.getElementById("cartButton");
    const cartContainer = document.getElementById("cartContainer");
    const closeCart = document.getElementById("closeCart");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartCountElement = document.getElementById("cart-count");
    const productContainer = document.getElementById("product-container");

    

    // Toggle cart sidebar
    cartButton.addEventListener("click", () => {
        cartContainer.classList.toggle("translate-x-full");
    });

    closeCart.addEventListener("click", () => {
        cartContainer.classList.add("translate-x-full");
    });

    // Fetch products and display them
    async function fetchProducts(filter = "") {
        try {
            const res = await fetch("https://fakestoreapi.com/products");
            let products = await res.json();
            localStorage.setItem("allProducts", JSON.stringify(products));

            let filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(filter)
            );

            displayProducts(filteredProducts);
            displayFeaturedProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Display products dynamically
    function displayProducts(productsArr) {
        productContainer.innerHTML = productsArr.length > 0
            ? productsArr.map(product => `
                  
                <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4 text-center hover:shadow-xl transition transform hover:scale-105">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover">
                    <h2 class="text-lg font-semibold mt-2">${product.title}</h2>
                    <p class="text-gray-600 font-semibold">$${product.price}</p>
                    <button onclick="addToCart(${product.id})" class="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 rounded">Add to Cart</button>
                </div>
            `).join("")
            : `<p class="text-center text-gray-600">No products found</p>`;
    }

    // Add to cart function
    window.addToCart = function (productId) {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
        let products = JSON.parse(localStorage.getItem("allProducts")) || [];
        let selectedProduct = products.find(item => item.id === productId);

        if (!selectedProduct) {
            alert("Error: Product not found!");
            return;
        }

        let existingItem = cartItems.find(item => item.id === selectedProduct.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...selectedProduct, quantity: 1 });
        }

        localStorage.setItem("cartItem", JSON.stringify(cartItems));
        updateCartUI();
    };

    // Update cart UI
    function updateCartUI() {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];

        cartItemsContainer.innerHTML = cartItems.length === 0
            ? `<p class="text-center text-gray-500">Your cart is empty</p>`
            : cartItems.map(item => `
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
            `).join("");

        let totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        cartCountElement.textContent = totalQuantity;
        cartCountElement.classList.toggle("hidden", totalQuantity === 0);
    }

    // Change item quantity function
    window.changeQuantity = function (id, action) {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];

        let updatedCart = cartItems.map(item => {
            if (item.id === id) {
                if (action === "decrease" && item.quantity > 1) {
                    item.quantity -= 1;
                } else if (action === "increase") {
                    item.quantity += 1;
                }
            }
            return item;
        }).filter(item => item.quantity > 0); // Remove items with zero quantity

        localStorage.setItem("cartItem", JSON.stringify(updatedCart));
        updateCartUI();
    };

    // Remove from cart function
    window.removeFromCart = function (id) {
        let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem("cartItem", JSON.stringify(cartItems));
        updateCartUI();
    };

    // Display featured products
    function displayFeaturedProducts() {
        let featuredContainer = document.getElementById("featured-container");
        let products = JSON.parse(localStorage.getItem("allProducts")) || [];

        let featuredProducts = products.slice(0, 3);
        featuredContainer.innerHTML = featuredProducts.map(product => `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4 text-center hover:shadow-xl transition transform hover:scale-105">
                <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover">
                <h2 class="text-lg font-semibold mt-2">${product.title}</h2>
                <p class="text-gray-600 font-semibold">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 rounded">Add to Cart</button>
            </div>
        `).join("");
    }

    // Fetch products and update UI on page load
    await fetchProducts();
    updateCartUI();
    


    
});
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("carousel-inner");
    const images = document.querySelectorAll(".carousel-image");
    let index = 0;

    function showSlide(i) {
        index = (i + images.length) % images.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    document.getElementById("prevBtn").addEventListener("click", function () {
        showSlide(index - 1);
    });

    document.getElementById("nextBtn").addEventListener("click", function () {
        showSlide(index + 1);
    });

    // Change image by clicking
    images.forEach((img, i) => {
        img.addEventListener("click", function () {
            showSlide(i);
        });
    });

    setInterval(() => showSlide(index + 1), 3000); // Auto-slide every 3s
});
