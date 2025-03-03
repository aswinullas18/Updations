let cart = {};

// Toggle Menu Categories
function toggleItems(id) {
    document.querySelectorAll('.items-container').forEach(item => {
        item.style.display = item.id === id ? (item.style.display === 'none' ? 'block' : 'none') : 'none';
    });
}

// Update Cart
function updateCart(item, change) {
    if (!cart[item]) cart[item] = 0;
    cart[item] += change;
    if (cart[item] < 0) cart[item] = 0;

    document.getElementById(`${item}-count`).innerText = cart[item];
    updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    let cartBox = document.getElementById('cart-items');
    cartBox.innerHTML = '';

    Object.keys(cart).forEach(item => {
        if (cart[item] > 0) cartBox.innerHTML += `<li>${item} - ${cart[item]}</li>`;
    });
}

// Checkout and send to WhatsApp
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (Object.values(cart).every(qty => qty === 0)) {
        alert("Your cart is empty!");
        return;
    }

    let message = "*Casa Cafe Order:*\n";
    Object.entries(cart).forEach(([item, qty]) => {
        if (qty > 0) message += `✅ ${item}: ${qty}\n`;
    });

    let encodedMessage = encodeURIComponent(message);
    let whatsappNumber = "918113863005"; // Replace with cafe's number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
});
