const products = [

    {
        id: 1,
        name: "Classic Casual Shirt",
        category: "Men",
        price: 899,
        image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 2,
        name: "Premium Denim Jeans",
        category: "Men",
        price: 1299,
        image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 3,
        name: "Everyday T-Shirt",
        category: "Men",
        price: 599,
        image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 4,
        name: "Kids Casual Set",
        category: "Kids",
        price: 799,
        image:
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 5,
        name: "Kids Printed T-Shirt",
        category: "Kids",
        price: 499,
        image:
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 6,
        name: "Everyday Sneakers",
        category: "Footwear",
        price: 1499,
        image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 7,
        name: "Casual Slippers",
        category: "Footwear",
        price: 399,
        image:
        "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80"
    },

    {
        id: 8,
        name: "Signature Fragrance",
        category: "Perfumes",
        price: 999,
        image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80"
    }

];


let cart =
    JSON.parse(
        localStorage.getItem("sonuCart")
    ) || [];


const productGrid =
    document.getElementById("productGrid");

const cartModal =
    document.getElementById("cartModal");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");


/* FORMAT PRICE */

function formatPrice(price) {

    return "₹" +
        price.toLocaleString("en-IN");

}


/* DISPLAY PRODUCTS */

function displayProducts(list) {

    productGrid.innerHTML = "";

    list.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";

        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>

        `;

        productGrid.appendChild(card);

    });

}


/* FILTER PRODUCTS */

function filterProducts(category) {

    let filteredProducts;

    if (category === "All") {

        filteredProducts =
            products;

    } else {

        filteredProducts =
            products.filter(
                product =>
                    product.category === category
            );

    }

    displayProducts(filteredProducts);

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ADD TO CART */

function addToCart(productId) {

    const product =
        products.find(
            product =>
                product.id === productId
        );

    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    openCart();

}


/* SAVE CART */

function saveCart() {

    localStorage.setItem(
        "sonuCart",
        JSON.stringify(cart)
    );

}


/* UPDATE CART COUNT */

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        totalItems;

}


/* DISPLAY CART */

function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "₹0";

        updateCartCount();

        return;

    }


    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ${formatPrice(item.price)}
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(
                            ${item.id}, -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(
                            ${item.id}, 1
                        )"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    cartTotal.textContent =
        formatPrice(total);


    updateCartCount();

}


/* CHANGE QUANTITY */

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            item =>
                item.id === productId
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    item.id !== productId
            );

    }


    saveCart();

    updateCart();

}


/* OPEN CART */

function openCart() {

    cartModal.classList.add("active");

    updateCart();

}


/* CLOSE CART */

function closeCart() {

    cartModal.classList.remove("active");

}


/* CHECKOUT */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    alert(
        "Checkout page will be added next."
    );

}


/* INITIAL LOAD */

displayProducts(products);

updateCart();