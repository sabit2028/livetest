document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: '1', name: 'Realme Note 50', price: 10.00, image: 'product1.jpg' },
        { id: '2', name: 'Mr. Noodles', price: 15.00, image: 'product2.jpg' },
        { id: '3', name: 'Starship Milk Powder', price: 20.00, image: 'product3.jpg' },
        { id: '4', name: 'Realme Note 50', price: 10.00, image: 'product4.webp' },
        { id: '5', name: 'Mr. Noodles', price: 15.00, image: 'product5.webp' },
        { id: '6', name: 'Starship Milk Powder', price: 20.00, image: 'product6.webp' },
        { id: '7', name: 'Realme Note 50', price: 10.00, image: 'product7.webp' },
        { id: '8', name: 'Mr. Noodles', price: 15.00, image: 'bike.webp' },
        // Add more products as needed
    ];

    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const finalTotalElement = document.getElementById('final-total');
    const promoCodeInput = document.getElementById('promo-code');
    const applyPromoButton = document.getElementById('apply-promo');
    const promoMessage = document.getElementById('promo-message');
    const clearCartButton = document.getElementById('clear-cart');
    const cartCount = document.getElementById('cart-count');

    let cart = [];
    let appliedPromo = {};
    let subtotal = 0;

    // Render products
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productElement);

        productElement.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
    });

    // Add to cart functionality
    function addToCart(product) {
        cart.push(product);
        updateCart();
    }

    // Update cart display and totals
    function updateCart() {
        cartItems.innerHTML = '';
        subtotal = cart.reduce((total, item) => total + item.price, 0);
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            `;
            cartItems.appendChild(itemElement);
        });

        cartTotalElement.textContent = subtotal.toFixed(2);
        subtotalElement.textContent = subtotal.toFixed(2);
        updateDiscount();
        cartCount.textContent = cart.length;
    }

    // Apply promo code
    applyPromoButton.addEventListener('click', applyPromoCode);
    promoCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });

    function applyPromoCode() {
        const code = promoCodeInput.value.toLowerCase();
        if (appliedPromo[code]) {
            showMessage('This promo code has already been applied.', 'error');
            return;
        }

        switch(code) {
            case 'ostad10':
                if (applyDiscount(subtotal, 0.1)) {
                    appliedPromo[code] = true;
                }
                break;
            case 'ostad5':
                if (applyDiscount(subtotal, 0.05)) {
                    appliedPromo[code] = true;
                }
                break;
            default:
                showMessage('Invalid promo code. Please try again.', 'error');
        }

        promoCodeInput.value = '';
    }

    function applyDiscount(total, discount) {
        const discountAmount = total * discount;
        const discountedTotal = total - discountAmount;

        if (discountAmount > 0) {
            discountElement.textContent = discountAmount.toFixed(2);
            finalTotalElement.textContent = discountedTotal.toFixed(2);
            showMessage('Promo code applied successfully!', 'success');
            return true;
        } else {
            showMessage('No discount applied. The discount amount would be zero or negative.', 'error');
            return false;
        }
    }

    function updateDiscount() {
        let discountAmount = 0;
        for (let code in appliedPromo) {
            if (appliedPromo[code]) {
                switch(code) {
                    case 'ostad10': discountAmount += subtotal * 0.1; break;
                    case 'ostad5': discountAmount += subtotal * 0.05; break;
                }
            }
        }
        discountElement.textContent = discountAmount.toFixed(2);
        finalTotalElement.textContent = (subtotal - discountAmount).toFixed(2);
    }

    function showMessage(message, type) {
        promoMessage.textContent = message;
        promoMessage.className = type === 'success' ? 'success-message' : 'error-message';
    }

    // Clear cart functionality
    clearCartButton.addEventListener('click', () => {
        cart = [];
        appliedPromo = {};
        updateCart();
        showMessage('', ''); // Clear any promo messages
    });

    // Initial update to show empty cart
    updateCart();
});