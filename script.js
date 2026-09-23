console.log("Sonu Collection Webstore loaded successfully!");

let cart = [];


/* =========================
   CATEGORY NAVIGATION
========================= */

function showCategory(category) {

    const section = document.getElementById(category);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}


/* =========================
   ADD TO CART
========================= */

function addToCart(name, price) {

    const existingProduct = cart.find(function(product) {
        return product.name === name;
    });


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }


    updateCart();

    alert(name + " added to cart!");

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");


    if (!cartItems || !cartTotal) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent = "0";

        return;

    }


    cartItems.innerHTML = "";

    let total = 0;


    cart.forEach(function(product, index) {

        const itemTotal =
            product.price * product.quantity;

        total += itemTotal;


        const item =
            document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `
            <div>
                <strong>${product.name}</strong>
                <br>
                ₹${product.price.toLocaleString("en-IN")}
                each
            </div>

            <div style="display:flex; align-items:center; gap:10px;">

                <button
                    onclick="decreaseQuantity(${index})"
                    style="padding:6px 11px; cursor:pointer;">
                    −
                </button>

                <strong>${product.quantity}</strong>

                <button
                    onclick="increaseQuantity(${index})"
                    style="padding:6px 11px; cursor:pointer;">
                    +
                </button>

                <strong style="margin-left:10px;">
                    ₹${itemTotal.toLocaleString("en-IN")}
                </strong>

                <button
                    onclick="removeFromCart(${index})"
                    style="padding:7px 12px; cursor:pointer;">
                    Remove
                </button>

            </div>
        `;


        cartItems.appendChild(item);

    });


    cartTotal.textContent =
        total.toLocaleString("en-IN");

}


/* =========================
   INCREASE QUANTITY
========================= */

function increaseQuantity(index) {

    cart[index].quantity += 1;

    updateCart();

}


/* =========================
   DECREASE QUANTITY
========================= */

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }


    updateCart();

}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


/* =========================
   PROCEED TO CHECKOUT
========================= */

function proceedToCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    const checkout =
        document.getElementById("checkout");


    if (!checkout) {

        alert("Checkout section not found.");

        return;

    }


    checkout.style.display = "block";


    checkout.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================
   PLACE ORDER
========================= */

async function placeOrder() {

    const name =
        document.getElementById("customer-name").value.trim();

    const phone =
        document.getElementById("customer-phone").value.trim();

    const address =
        document.getElementById("customer-address").value.trim();

    const city =
        document.getElementById("customer-city").value.trim();

    const pincode =
        document.getElementById("customer-pincode").value.trim();


    /* CHECK CUSTOMER DETAILS */

    if (!name || !phone || !address || !city || !pincode) {

        alert("Please fill all the details.");

        return;

    }


    /* CHECK CART */

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    /* CALCULATE TOTAL */

    const total = cart.reduce(function(sum, product) {

        return sum + (product.price * product.quantity);

    }, 0);


    /* CREATE ORDER */

    const order = {

        customer: {

            name: name,

            phone: phone,

            address: address,

            city: city,

            pincode: pincode

        },

        items: cart,

        total: total

    };


    console.log("Sending order to backend...");
    console.log(order);


    /* SEND ORDER TO NODE.JS BACKEND */

    try {

        const response = await fetch(
            "http://localhost:3000/api/orders",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(order)

            }
        );


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const result =
            await response.json();


        console.log(
            "Backend response:",
            result
        );


        /* CHECK BACKEND RESPONSE */

        if (!result.success) {

            alert(
                "Order could not be placed. Please try again."
            );

            return;

        }


        /* =========================
           CREATE ORDER NUMBER
        ========================= */

        const orderNumber =
            "SC-" +
            Date.now().toString().slice(-6);


        /* =========================
           ORDER DATE
        ========================= */

        const orderDate =
            new Date().toLocaleString("en-IN");


        /* =========================
           FILL INVOICE
        ========================= */

        document.getElementById(
            "invoice-order-number"
        ).textContent =
            orderNumber;


        document.getElementById(
            "invoice-date"
        ).textContent =
            orderDate;


        document.getElementById(
            "invoice-name"
        ).textContent =
            name;


        document.getElementById(
            "invoice-phone"
        ).textContent =
            phone;


        document.getElementById(
            "invoice-address"
        ).textContent =
            address;


        document.getElementById(
            "invoice-city"
        ).textContent =
            city;


        document.getElementById(
            "invoice-pincode"
        ).textContent =
            pincode;


        /* =========================
           ADD PRODUCTS TO INVOICE
        ========================= */

        const invoiceItems =
            document.getElementById(
                "invoice-items"
            );


        invoiceItems.innerHTML = "";


        cart.forEach(function(product) {

            const item =
                document.createElement("div");

            item.className =
                "invoice-item";


            const itemTotal =
                product.price * product.quantity;


            item.innerHTML = `
                <div class="invoice-item-name">
                    ${product.name}
                    <br>
                    <small>
                        Quantity: ${product.quantity}
                    </small>
                </div>

                <div class="invoice-item-price">
                    ₹${itemTotal.toLocaleString("en-IN")}
                </div>
            `;


            invoiceItems.appendChild(item);

        });


        /* =========================
           INVOICE TOTAL
        ========================= */

        document.getElementById(
            "invoice-total"
        ).textContent =
            total.toLocaleString("en-IN");


        /* =========================
           HIDE CHECKOUT
        ========================= */

        const checkout =
            document.getElementById("checkout");


        if (checkout) {

            checkout.style.display = "none";

        }


        /* =========================
           SHOW INVOICE
        ========================= */

        const confirmation =
            document.getElementById(
                "order-confirmation"
            );


        if (confirmation) {

            confirmation.style.display =
                "block";


            confirmation.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        /* =========================
           CLEAR CART
        ========================= */

        cart = [];

        updateCart();


        /* =========================
           CLEAR CUSTOMER FORM
        ========================= */

        document.getElementById(
            "customer-name"
        ).value = "";

        document.getElementById(
            "customer-phone"
        ).value = "";

        document.getElementById(
            "customer-address"
        ).value = "";

        document.getElementById(
            "customer-city"
        ).value = "";

        document.getElementById(
            "customer-pincode"
        ).value = "";


        alert(
            "Order placed successfully!"
        );

    }


    catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "Could not connect to the server. Make sure your Node.js backend is running."
        );

    }

}


/* =========================
   INITIALIZE CART
========================= */

updateCart();