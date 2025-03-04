// script.js

// Function to toggle category visibility
function toggleCategory(categoryId) {
    const categoryContent = document.getElementById(categoryId);
    const categoryHeader = categoryContent.previousElementSibling;
    let dropdownIcon = categoryHeader.querySelector('.dropdown-icon');

    if (!dropdownIcon) {
        dropdownIcon = document.createElement('i');
        dropdownIcon.classList.add('fas', 'fa-chevron-down', 'dropdown-icon');
        categoryHeader.appendChild(dropdownIcon);
    }

    if (categoryContent.style.display === 'block') {
        categoryContent.style.display = 'none';
        dropdownIcon.classList.remove('fa-chevron-up');
        dropdownIcon.classList.add('fa-chevron-down');
    } else {
        const allCategories = document.querySelectorAll('.category-content');
        allCategories.forEach(category => {
            category.style.display = 'none';
            if (category.previousElementSibling.querySelector('.dropdown-icon')) {
                category.previousElementSibling.querySelector('.dropdown-icon').classList.remove('fa-chevron-up');
                category.previousElementSibling.querySelector('.dropdown-icon').classList.add('fa-chevron-down');
            }
        });
        categoryContent.style.display = 'block';
        dropdownIcon.classList.remove('fa-chevron-down');
        dropdownIcon.classList.add('fa-chevron-up');
    }
}

let cartItems = {};
let cartCount = 0;
let cartVisible = false;

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
    cartItemsList.innerHTML = '';

    if (Object.keys(cartItems).length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = "Your cart is empty.";
        cartItemsList.appendChild(emptyMessage);
    } else {
        for (const item in cartItems) {
            const li = document.createElement('li');
            const capitalizedItem = toTitleCase(item);
            li.textContent = `${capitalizedItem} - ${cartItems[item]}`;

            const decreaseBtn = document.createElement('button');
            decreaseBtn.textContent = '-';
            decreaseBtn.style.margin = '0 5px';
            decreaseBtn.onclick = () => decreaseCartItem(item);
            li.appendChild(decreaseBtn);

            const increaseBtn = document.createElement('button');
            increaseBtn.textContent = '+';
            increaseBtn.style.margin = '0 5px';
            increaseBtn.onclick = () => increaseCartItem(item);
            li.appendChild(increaseBtn);

            cartItemsList.appendChild(li);
        }
    }
    updateCartCount();
}

function toTitleCase(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function increase(itemId) {
    const item = document.getElementById(itemId);
    const itemName = itemId.replace(/-/g, ' ');
    item.innerText = parseInt(item.innerText) + 1;
    addToCart(itemName);
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
        delete cartItems[itemName];
    }
    updateCartUI();
    const itemId = itemName.replace(/ /g, '-');
    const itemCounter = document.getElementById(itemId);
    if (itemCounter) {
        itemCounter.innerText = 0;
    }
}

function increaseCartItem(itemName) {
    cartItems[itemName]++;
    cartCount++;
    updateCartUI();
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
        const itemId = itemName.replace(/ /g, '-');
        const itemCounter = document.getElementById(itemId);
        if (itemCounter) {
            itemCounter.innerText = cartItems[itemName];
        }
    } else {
        removeFromCart(itemName);
        const itemId = itemName.replace(/ /g, '-');
        const itemCounter = document.getElementById(itemId);
        if (itemCounter) {
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
        document.body.classList.remove('cart-open');
    } else {
        cartBox.style.display = 'block';
        cartVisible = true;
        updateCartUI();
        document.body.classList.add('cart-open');
    }
});

// Close cart on close button click
document.getElementById('close-cart').addEventListener('click', function() {
    document.getElementById('cart-box').style.display = 'none';
    cartVisible = false;
    document.body.classList.remove('cart-open');
});


document.getElementById('place-order-btn').addEventListener('click', function() {
    const customerName = document.getElementById('customer-name').value;
    const tableNumber = document.getElementById('table-number').value;
    const cartItemsList = Object.entries(cartItems).map(([item, quantity]) => `- ${toTitleCase(item)}: ${quantity}`).join('\n');

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

    const message = `*New Order*\n\n*Customer Name:* ${customerName}\n*Table Number:* ${tableNumber}\n\n*Order Items:*\n${cartItemsList}`;
    const whatsappLink = `https://wa.me/918129553200?text=${encodeURIComponent(message)}`;

    const link = document.createElement('a');
    link.href = whatsappLink;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset item counters BEFORE clearing cartItems
    for (const itemName in cartItems) {
        const itemId = itemName.replace(/ /g, '-');
        const itemCounter = document.getElementById(itemId);
        if (itemCounter) {
            itemCounter.innerText = 0;
        }
    }

    cartItems = {}; // Clear cart items AFTER resetting counters
    cartCount = 0;
    updateCartUI();
    document.getElementById('customer-name').value = '';
    document.getElementById('table-number').value = '';

    alert("Order Placed Successfully!");
});