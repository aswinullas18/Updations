// script.js

// Function to toggle category visibility
function toggleCategory(categoryId) {
    const categoryContent = document.getElementById(categoryId);
    if (categoryContent.style.display === 'block') {
        categoryContent.style.display = 'none';
    } else {
        // Hide all other categories
        const allCategories = document.querySelectorAll('.category-content');
        allCategories.forEach(category => {
            category.style.display = 'none';
        });
        // Show the selected category
        categoryContent.style.display = 'block';
    }
}

let cartItems = {};
let cartCount = 0;
let cartVisible = false; // Track cart visibility

function updateCartCount() {
    document.getElementById('cart-count').innerText = cartCount;
}

function addToCart(itemName) {
    if (cartItems[itemName]) {
        cartItems[itemName]++;
    } else {
        cartItems[itemName] = 1;
    }

    cartCount++;
    updateCartUI();
}

function updateCartUI() {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = ''; // Clear existing items
    for (const item in cartItems) {
        const li = document.createElement('li');
        li.innerHTML = `${item} - ${cartItems[item]} <button onclick="decreaseCartItem('${item}')">-</button> <button onclick="increaseCartItem('${item}')">+</button> <button onclick="removeFromCart('${item}')">Remove</button>`;
        cartItemsList.appendChild(li);
    }
    updateCartCount(); // Update the cart count display
}

function increase(itemId) {
    const item = document.getElementById(itemId);
    const itemName = itemId.replace(/-/g, ' '); // Convert itemId to itemName
    item.innerText = parseInt(item.innerText) + 1;
    addToCart(itemName); // Add item to cart
}

function decrease(itemId) {
    const item = document.getElementById(itemId);
    const itemName = itemId.replace(/-/g, ' ');
    if (parseInt(item.innerText) > 0) {
        item.innerText = parseInt(item.innerText) - 1;
        if (cartItems[itemName]) {
            cartItems[itemName]--;
            if (cartItems[itemName] === 0) {
                delete cartItems[itemName];
            }
            cartCount--;
            updateCartUI();
        }
    }
}

function removeFromCart(itemName) {
    if (cartItems[itemName]) {
        cartCount -= cartItems[itemName];
        delete cartItems[itemName]; // Remove item from cart
    }
    updateCartUI();
    //Update item box to 0 when item is removed completely
    const itemId = itemName.replace(/ /g, '-');
    const itemCounter = document.getElementById(itemId);
    if(itemCounter){
        itemCounter.innerText = 0;
    }
}

function increaseCartItem(itemName) {
    cartItems[itemName]++;
    cartCount++;
    updateCartUI();

    // Update the item box counter if it is present.
    const itemId = itemName.replace(/ /g, '-');
    const itemCounter = document.getElementById(itemId);
    if (itemCounter) {
        itemCounter.innerText = cartItems[itemName];
    }
}

function decreaseCartItem(itemName) {
    if (cartItems[itemName] > 1) {
        cartItems[itemName]--;
        cartCount--;
        updateCartUI();

        // Update the item box counter if it is present.
        const itemId = itemName.replace(/ /g, '-');
        const itemCounter = document.getElementById(itemId);
        if (itemCounter) {
            itemCounter.innerText = cartItems[itemName];
        }
    } else {
        removeFromCart(itemName);
        //Update item box to 0 when item is removed completely
        const itemId = itemName.replace(/ /g, '-');
        const itemCounter = document.getElementById(itemId);
        if(itemCounter){
            itemCounter.innerText = 0;
        }
    }
}

// Toggle cart visibility on cart icon click
document.getElementById('cart-icon').addEventListener('click', function() {
    const cartBox = document.getElementById('cart-box');
    if (cartVisible) {
        cartBox.style.display = 'none';
        cartVisible = false;
    } else {
        cartBox.style.display = 'block';
        cartVisible = true;
        updateCartUI(); // Ensure cart is updated when shown
    }
});

// Close cart on close button click
document.getElementById('close-cart').addEventListener('click', function() {
    document.getElementById('cart-box').style.display = 'none';
    cartVisible = false;
});

document.getElementById('place-order-btn').addEventListener('click', function() {
    const customerName = document.getElementById('customer-name').value;
    const tableNumber = document.getElementById('table-number').value;
    const cartItemsList = Object.entries(cartItems).map(([item, quantity]) => `${item} (x${quantity})`).join(', ');

    if (!customerName) {
        alert("Please enter your name.");
        return;
    }

    if (!tableNumber || isNaN(tableNumber)) {
        alert("Please enter a valid table number (numbers only).");
        return;
    }

    if (Object.keys(cartItems).length === 0) {
        alert("Please add items to your cart before placing the order.");
        return;
    }

    const message = `Order Details:\nName: ${customerName}\nTable Number: ${tableNumber}\nItems: ${cartItemsList}`;
    const whatsappLink = `https://wa.me/918129553200?text=${encodeURIComponent(message)}`;

    // Create an anchor element to trigger the WhatsApp link
    const link = document.createElement('a');
    link.href = whatsappLink;
    link.target = '_blank'; // Open in a new tab
    link.style.display = 'none'; // Hide the link

    // Append the link to the body and trigger a click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after click

    //Clear cart and input fields
    cartItems = {};
    cartCount = 0;
    updateCartUI();
    document.getElementById('customer-name').value = '';
    document.getElementById('table-number').value = '';

    alert("Order Placed Successfully!");
});