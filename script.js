// Login Modal logic (corretto)
window.addEventListener('DOMContentLoaded', function () {
    // Usa event delegation per evitare problemi di duplicazione DOMContentLoaded
    document.body.addEventListener('click', function (e) {
        // Apri modal login
        if (e.target.closest('.login-link')) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            if (loginModal) loginModal.classList.add('active');
        }
        // Chiudi modal login
        if (e.target.matches('#close-login-modal')) {
            const loginModal = document.getElementById('login-modal');
            if (loginModal) loginModal.classList.remove('active');
        }
        // Apri modal registrazione
        if (e.target.matches('#create-account-link')) {
            e.preventDefault();
            const registerModal = document.getElementById('register-modal');
            const loginModal = document.getElementById('login-modal');
            if (registerModal) registerModal.classList.add('active');
            if (loginModal) loginModal.classList.remove('active');
        }
        // Chiudi modal registrazione
        if (e.target.matches('#close-register-modal')) {
            const registerModal = document.getElementById('register-modal');
            if (registerModal) registerModal.classList.remove('active');
        }
    });
    // Chiudi cliccando fuori dal box
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.addEventListener('click', function (e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    // Chiudi cliccando fuori dal box per il modal di registrazione
    const registerModal = document.getElementById('register-modal');
    if (registerModal) {
        registerModal.addEventListener('click', function (e) {
            if (e.target === registerModal) {
                registerModal.classList.remove('active');
            }
        });
    }
    // Blocca submit login (solo demo)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const remember = document.getElementById('remember-me').checked;
            if (username) {
                if (remember) {
                    localStorage.setItem('loggedUser', username);
                } else {
                    sessionStorage.setItem('loggedUser', username);
                }
                document.getElementById('login-modal').classList.remove('active');
                updateLoginWidget();
            } else {
                alert('Inserisci username');
            }
        });
    }

    // Mostra stato login all'avvio
    updateLoginWidget();

    // Logout handler
    document.body.addEventListener('click', function (e) {
        if (e.target.closest('.logout-link')) {
            e.preventDefault();
            localStorage.removeItem('loggedUser');
            sessionStorage.removeItem('loggedUser');
            updateLoginWidget();
        }
    });
});
// Gestione submit form di registrazione (demo)
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const address = document.getElementById('register-address').value.trim();
        const cap = document.getElementById('register-cap').value.trim();
        const city = document.getElementById('register-city').value.trim();
        const country = document.getElementById('register-country').value.trim();
        const prefix = document.getElementById('register-prefix').value;
        const phone = document.getElementById('register-phone').value.trim();
        const password = document.getElementById('register-password').value;
        const fullPhone = prefix + phone;
        if (!username || !email || !phone || !password || !address || !cap || !city || !country) {
            alert('Compila tutti i campi!');
            return;
        }
        let clienti = [];
        try {
            clienti = JSON.parse(localStorage.getItem('clienti')) || [];
        } catch (e) { clienti = []; }
        if (clienti.some(c => c.email === email)) {
            alert('Questa email è già registrata!');
            return;
        }
        clienti.push({ username, email, telefono: fullPhone, address, cap, city, country, password });
        localStorage.setItem('clienti', JSON.stringify(clienti));
        const subscribeNewsletter = document.getElementById('subscribe-newsletter');
        if (subscribeNewsletter && subscribeNewsletter.checked) {
            try {
                const subs = JSON.parse(localStorage.getItem('subscribers') || '[]');
                if (!subs.some(s => s.email === email)) {
                    subs.push({ username, email, telefono: fullPhone, address, cap, city, country, iscrittoIl: new Date().toLocaleString('it-IT') });
                    localStorage.setItem('subscribers', JSON.stringify(subs));
                }
            } catch (e) {
                console.warn('Errore salvataggio iscrizione newsletter:', e);
            }
        }
        alert('Registrazione completata! Benvenuto/a ' + username);
        const registerModal = document.getElementById('register-modal');
        if (registerModal) registerModal.classList.remove('active');
        localStorage.setItem('loggedUser', username);
        updateLoginWidget();
    });
}

// Aggiorna widget login/logout
function updateLoginWidget() {
    const user = localStorage.getItem('loggedUser') || sessionStorage.getItem('loggedUser');
    const loginAbsolute = document.querySelector('.login-absolute');
    if (!loginAbsolute) return;
    let showName = false;
    if (user) {
        // Verifica se l'utente è registrato come cliente
        let clienti = [];
        try {
            clienti = JSON.parse(localStorage.getItem('clienti')) || [];
        } catch (e) { clienti = []; }
        if (clienti.some(c => c.username === user)) {
            showName = true;
        }
    }
    if (user) {
        loginAbsolute.innerHTML = `<a href="#" class="logout-link" title="Logout"><i class="fas fa-user"></i> <span class="login-text">Logout</span></a>`;
    } else {
        loginAbsolute.innerHTML = `<a href="#" class="login-link" title="Accedi"><i class="fas fa-user"></i> <span class="login-text">Accedi</span></a>`;
    }
}
// Database prodotti
const products = [
    {
        id: 1,
        name: "Crema Idratante Coreana",
        category: "skincare",
        price: 25.99,
        image: "https://www.beautyofjoseon.com/cdn/shop/products/BOJ_Dynasty_Cream_50ml_01_800x.jpg?v=1679038572",
        description: "Crema idratante ricca, Beauty of Joseon Dynasty Cream. Benefici: idratazione profonda, elasticità, luminosità. Quantità: 50ml. Utilizzo: applicare mattina e sera dopo il tonico. Preoccupazioni: pelle secca, opaca, sensibile. Recensioni: 4.8/5 (oltre 2000 recensioni, molto apprezzata per texture e risultati)."
    },
    {
        id: 2,
        name: "Siero Vitamina C",
        category: "skincare",
        price: 35.50,
        image: "https://mixsoon.com/cdn/shop/products/mixsoon-bean-essence-50ml-01_800x.jpg?v=1681198572",
        description: "Mixsoon Bean Essence. Benefici: idratazione, luminosità, miglioramento texture. Quantità: 50ml. Utilizzo: applicare dopo il tonico, prima della crema. Preoccupazioni: pelle spenta, ruvida, disidratata. Recensioni: 4.7/5 (molto apprezzato per effetto glow e assorbimento rapido)."
    },
    {
        id: 3,
        name: "Maschera Fango Nero",
        category: "skincare",
        price: 15.99,
        image: "https://skin1004.com/cdn/shop/products/skin1004-madagascar-centella-ampoule-100ml-01_800x.jpg?v=1681198572",
        description: "Skin1004 Madagascar Centella Ampoule. Benefici: purifica, lenisce, riduce rossori. Quantità: 100ml. Utilizzo: applicare su pelle pulita, lasciare agire 10-15 min, risciacquare. Preoccupazioni: pelle irritata, arrossata, sensibile. Recensioni: 4.9/5 (molto apprezzata per effetto calmante e texture leggera)."
    },
    {
        id: 4,
        name: "Tonico Lenitivo",
        category: "skincare",
        price: 20.00,
        image: "https://www.beautyofjoseon.com/cdn/shop/products/BOJ_Ginseng_Essence_Water_150ml_01_800x.jpg?v=1679038572",
        description: "Beauty of Joseon Ginseng Essence Water. Benefici: rivitalizza, lenisce, migliora elasticità. Quantità: 150ml. Utilizzo: applicare con le mani o dischetto dopo la detersione. Preoccupazioni: pelle stanca, sensibile, matura. Recensioni: 4.8/5 (molto apprezzato per effetto tonificante e profumo delicato)."
    },
    {
        id: 5,
        name: "Cleansing Oil",
        category: "skincare",
        price: 28.99,
        image: "https://mixsoon.com/cdn/shop/products/mixsoon-cleansing-oil-01_800x.jpg?v=1681198572",
        description: "Mixsoon Cleansing Oil. Benefici: rimuove trucco, impurità, idrata. Quantità: 200ml. Utilizzo: massaggiare su pelle asciutta, aggiungere acqua, risciacquare. Preoccupazioni: pelle secca, trucco resistente, impurità. Recensioni: 4.7/5 (molto apprezzato per delicatezza e efficacia)."
    },
    {
        id: 6,
        name: "Essenza Ialuronica",
        category: "skincare",
        price: 40.00,
        image: "https://skin1004.com/cdn/shop/products/skin1004-hyaluronic-acid-serum-01_800x.jpg?v=1681198572",
        description: "Skin1004 Hyaluronic Acid Serum. Benefici: idratazione intensa, rimpolpa, migliora elasticità. Quantità: 50ml. Utilizzo: applicare dopo il tonico, prima della crema. Preoccupazioni: pelle disidratata, segni di stanchezza, perdita di tono. Recensioni: 4.9/5 (molto apprezzata per effetto rimpolpante e texture leggera)."
    }
];

// Gestione Carrello
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Gestione Lista dei Desideri
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Inizializzazione
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    updateWishlistCount();

    // Carica prodotti in evidenza nella homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    // Carica tutti i prodotti nella pagina prodotti
    if (document.getElementById('products-container')) {
        loadProducts();
        setupFilters();
    }

    // Carica carrello
    if (document.getElementById('cart-items')) {
        loadCart();
    }

    // Form contatti
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Carica prodotti in evidenza
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featured = products.slice(0, 4);

    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Carica tutti i prodotti
function loadProducts(filter = 'tutti', sort = 'default', search = '') {
    const container = document.getElementById('products-container');

    let filteredProducts = products;

    // Filtro categoria
    if (filter !== 'tutti') {
        filteredProducts = filteredProducts.filter(p => p.category === filter);
    }

    // Filtro ricerca
    if (search) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Ordinamento
    if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: #7f8c8d;">Nessun prodotto trovato</p>';
    } else {
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

// Crea card prodotto
function createProductCard(product) {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const heartClass = isInWishlist ? 'fas fa-heart' : 'far fa-heart';

    return `
        <div class="product-card" onclick="showProductModal(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">€${product.price.toFixed(2)}</span>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Aggiungi
                        </button>
                        <button class="btn-wishlist" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Aggiungi ai preferiti">
                            <i class="${heartClass}"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function getConcerns(desc) {
    const match = desc.match(/Preoccupazioni: ([^\.]+)\./);
    return match ? match[1] : '';
}
function getReviews(desc) {
    const match = desc.match(/Recensioni: ([^\.]+)$/);
    return match ? match[1] : '';
}
// Modale prodotto dettagliato
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    let modal = document.getElementById('product-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal-content product-modal-content">
            <span class="close-modal" onclick="closeProductModal()">&times;</span>
            <img src="${product.image}" alt="${product.name}" style="width:180px;height:180px;margin-bottom:1rem;border-radius:8px;">
            <h2>${product.name}</h2>
            <p><strong>Benefici:</strong> ${getBenefit(product.description)}</p>
            <p><strong>Quantità:</strong> ${getMl(product.description)}</p>
            <p><strong>Utilizzo:</strong> ${getUsage(product.description)}</p>
            <p><strong>Preoccupazioni:</strong> ${getConcerns(product.description)}</p>
            <p><strong>Recensioni:</strong> ${getReviews(product.description)}</p>
            <div style="margin: 1rem 0; display: flex; align-items: center; gap: 10px;">
                <label style="font-weight:500;margin-right:8px;">Quantità:</label>
                <button type="button" id="qty-minus" style="width:32px;height:32px;font-size:1.3rem;border-radius:6px;border:1px solid #e7b2c7;background:#fff;color:#e1007b;cursor:pointer;">-</button>
                <span id="modal-quantity" style="min-width:32px;display:inline-block;text-align:center;font-size:1.2rem;font-weight:600;">1</span>
                <button type="button" id="qty-plus" style="width:32px;height:32px;font-size:1.3rem;border-radius:6px;border:1px solid #e7b2c7;background:#fff;color:#e1007b;cursor:pointer;">+</button>
            </div>
            <button class="btn-add-cart" onclick="addToCartWithQuantity(${product.id});closeProductModal();">Aggiungi al carrello</button>
        </div>
    `;
    // Gestione quantità con - e +
    let qty = 1;
    const qtySpan = modal.querySelector('#modal-quantity');
    modal.querySelector('#qty-minus').addEventListener('click', function () {
        if (qty > 1) qty--;
        qtySpan.textContent = qty;
    });
    modal.querySelector('#qty-plus').addEventListener('click', function () {
        qty++;
        qtySpan.textContent = qty;
    });
    // ...existing code...
}

// Aggiungi al carrello con quantità scelta dal modale (globale)
function addToCartWithQuantity(productId) {
    const qtySpan = document.getElementById('modal-quantity');
    let qty = parseInt(qtySpan.textContent);
    if (isNaN(qty) || qty < 1) qty = 1;
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }
    saveCart();
    updateCartCount();
    showNotification('Prodotto aggiunto al carrello!');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('active');
}

// Funzioni di parsing descrizione
function getBenefit(desc) {
    const match = desc.match(/Benefici: ([^\.]+)\./);
    return match ? match[1] : '';
}
function getMl(desc) {
    const match = desc.match(/Quantità: ([^\.]+)\./);
    return match ? match[1] : '';
}
function getUsage(desc) {
    const match = desc.match(/Utilizzo: ([^\.]+)\./);
    return match ? match[1] : '';
}
function getConcerns(desc) {
    const match = desc.match(/Preoccupazioni: ([^\.]+)\./);
    return match ? match[1] : '';
}
function getReviews(desc) {
    const match = desc.match(/Recensioni: ([^\.]+)$/);
    return match ? match[1] : '';
}

// Aggiungi al carrello
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification('Prodotto aggiunto al carrello!');
}

// Rimuovi dal carrello
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCart();
}

// Aggiorna quantità
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            loadCart();
        }
    }
}

// Salva carrello
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Aggiorna contatore carrello
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counters = document.querySelectorAll('#cart-count');
    counters.forEach(counter => {
        counter.textContent = count;
        counter.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Aggiorna contatore lista desideri
function updateWishlistCount() {
    const count = wishlist.length;
    const counters = document.querySelectorAll('.wishlist-count');
    counters.forEach(counter => {
        counter.textContent = count;
        counter.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Aggiungi/Rimuovi dalla lista desideri
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = wishlist.find(item => item.id === productId);

    if (existingItem) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

// Aggiungi alla lista desideri
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);

    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push(product);
        saveWishlist();
        updateWishlistCount();
        loadProducts(); // aggiorna icone dei cuori
        showNotification('Aggiunto ai preferiti!');
        showWishlistModal();
    }
}

// Rimuovi dalla lista desideri
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist();
    updateWishlistCount();
    loadProducts(); // Ricarica i prodotti per aggiornare l'icona del cuore
    showNotification('Rimosso dai preferiti!');
}

// Salva lista desideri
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Mostra modal lista desideri
function showWishlistModal() {
    let modal = document.getElementById('wishlist-modal');

    // Crea il modal se non esiste
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'wishlist-modal';
        modal.className = 'wishlist-modal';
        document.body.appendChild(modal);
    }

    // Popola il modal
    const wishlistHTML = `
        <div class="wishlist-modal-content">
            <div class="wishlist-modal-header">
                <h2>La mia Lista dei Desideri</h2>
                <button class="close-wishlist" onclick="closeWishlistModal()">&times;</button>
            </div>
            <div class="wishlist-modal-body">
                ${wishlist.length === 0
            ? '<p class="empty-wishlist">La tua lista dei desideri è vuota</p>'
            : `<div class="wishlist-items">
                        ${wishlist.map(item => `
                            <div class="wishlist-item">
                                <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                                <div class="wishlist-item-info">
                                    <h4>${item.name}</h4>
                                    <p class="wishlist-item-price">€${item.price.toFixed(2)}</p>
                                </div>
                                <div class="wishlist-item-actions">
                                    <button class="btn-small" onclick="addToCart(${item.id})">
                                        <i class="fas fa-cart-plus"></i> Carrello
                                    </button>
                                    <button class="btn-remove" onclick="removeFromWishlist(${item.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
        }
            </div>
        </div>
    `;

    modal.innerHTML = wishlistHTML;
    modal.classList.add('active');

    // Chiudi cliccando fuori
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeWishlistModal();
        }
    });
}

// Chiudi modal lista desideri
function closeWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Carica carrello
function loadCart() {
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const cartProducts = cartItems.querySelector('.cart-products');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartItems.style.display = 'grid';

    cartProducts.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Rimuovi
                </button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// Aggiorna riepilogo
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 4.99;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = subtotal > 0 ? `€${shipping.toFixed(2)}` : '€0.00';
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

// Setup filtri
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

// Applica filtri
function applyFilters() {
    const search = document.getElementById('search-input')?.value || '';
    const category = document.getElementById('category-filter')?.value || 'tutti';
    const sort = document.getElementById('sort-filter')?.value || 'default';

    loadProducts(category, sort, search);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Il carrello è vuoto!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Salva il carrello e il totale
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', '€' + total.toFixed(2));

    // Reindirizza a checkout
    window.location.href = 'checkout.html';
}

// Form contatti
function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Crea link mailto con i dati del form
    const subject = encodeURIComponent(`Messaggio da ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMessaggio:\n${message}`);
    const mailtoLink = `mailto:mickystore26@gmail.com?subject=${subject}&body=${body}`;

    // Apri client email
    window.location.href = mailtoLink;

    // Reset form dopo un breve ritardo
    setTimeout(() => {
        e.target.reset();
        showNotification('Client email aperto! Invia il messaggio dal tuo programma email.');
    }, 500);
}

// Notifiche
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Animazioni CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
