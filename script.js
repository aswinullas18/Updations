// Function to toggle visibility of menu items
function toggleItems(id) {
    const itemsContainer = document.getElementById(id);
    const allContainers = document.querySelectorAll('.items-container');
    
    // Close all other items
    allContainers.forEach(container => {
        if (container !== itemsContainer) {
            container.style.display = "none";
        }
    });

    // Toggle the selected item
    if (itemsContainer.style.display === "none" || itemsContainer.style.display === "") {
        itemsContainer.style.display = "block";
    } else {
        itemsContainer.style.display = "none";
    }

}

function openCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function submitCheckout() {
    const userName = document.getElementById('name').value;
    const tableNumber = document.getElementById('table-number').value;
    const cartItems = document.getElementById('cart-items').innerText.replace(/\n/g, ', ');
    if (cartItems.trim() === '') {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }



    // Format the message
    const message = `Order from ${userName} at table ${tableNumber}:\n${cartItems}`;
    
    // Encode the message for WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp with the message
    window.open(whatsappUrl, '_blank');
    
    // Close the modal
    closeCheckoutModal();
}

function updateCart(itemName, quantity) {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    
    // Update cart count display
    const totalItems = Array.from(cartItems.children).reduce((total, item) => {
        const count = parseInt(item.innerText.split(': ')[1]);
        return total + count;
    }, 0);
    cartCount.innerText = totalItems;

    let itemCount = document.getElementById(`${itemName}-count`);
    
    // Update the count for the item
    if (itemCount) {
        let currentCount = parseInt(itemCount.innerText);
        currentCount += quantity;
        
        // Only add to cart if the count is greater than 0
        if (currentCount >= 0) {
            itemCount.innerText = currentCount;
            
            // Update the cart display
            if (currentCount === 0) {
                // Remove item from cart if count is 0
                const itemToRemove = document.querySelector(`li[data-item="${itemName}"]`);
                if (itemToRemove) {
                    cartItems.removeChild(itemToRemove);
                }
            } else {
                // Add item to cart if not already present
                if (!document.querySelector(`li[data-item="${itemName}"]`)) {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-item', itemName);
                    listItem.innerText = `${itemName}: ${currentCount}`;
                    cartItems.appendChild(listItem);
                } else {
                    // Update the existing item in the cart
                    const existingItem = document.querySelector(`li[data-item="${itemName}"]`);
                    existingItem.innerText = `${itemName}: ${currentCount}`;
                }
            }
        }
    }
}
