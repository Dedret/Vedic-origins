// --- 1. DATA CONFIGURATION ---
// Yahan aap Product ka Naam aur Daam change kar sakte ho
const data = {
    cow: {
        title: "Pure Desi Cow Ghee", // <-- Yahan naam badal lo agar chahiye to
        desc: "Medicinal Grade. Golden Yellow. Good for Heart.",
        // 4 Images (250ml, 500ml, 750ml, 1L)
        imgs: ["cow0.jpg", "cow1.jpg", "cow2.jpg", "cow3.jpg"],
        mrp: [1200, 2300, 3400, 4500],   // Market Price
        sale: [1000, 2000, 3000, 4000]   // Selling Price
    },
    buffalo: {
        title: "Pure Buffalo Ghee",
        desc: "High Fat. White Granular. Best for Cooking.",
        imgs: ["buff0.jpg", "buff1.jpg", "buff2.jpg", "buff3.jpg"],
        mrp: [700, 1300, 1900, 2500],
        sale: [500, 1000, 1500, 2000]
    }
};

let currentType = 'cow'; // Shuruat Cow se hogi

// --- 2. SWITCH GHEE TYPE (Animation ke saath) ---
function switchGhee(type) {
    if(currentType === type) return;

    // Animation Shuru (Ghumne wala effect)
    const img = document.getElementById('ghee-img');
    img.classList.add('spin');

    // Buttons ka color badlo
    document.getElementById('cow-btn').className = `sw-btn ${type==='cow' ? 'active' : ''}`;
    document.getElementById('buff-btn').className = `sw-btn ${type==='buffalo' ? 'active' : ''}`;

    // 300ms ka Intezaar (Jab tak photo ghum rahi hai)
    setTimeout(() => {
        currentType = type; 

        // Text aur Description update karo
        document.getElementById('title').innerText = data[type].title;
        document.getElementById('desc').innerText = data[type].desc;

        // Price aur Image update call karo
        updatePrice();

        // Animation Roko
        img.classList.remove('spin');
    }, 300);
}

// --- 3. UPDATE PRICE & LINK GENERATOR (Main Logic) ---
function updatePrice() {
    // Dropdown se value nikalo (0, 1, 2, ya 3)
    const qtyIndex = document.getElementById('qty').value; 
    const product = data[currentType];

    // A. Image Update
    document.getElementById('ghee-img').src = product.imgs[qtyIndex];

    // B. Price Update
    const currentPrice = product.sale[qtyIndex];
    document.getElementById('mrp').innerText = "₹" + product.mrp[qtyIndex];
    document.getElementById('price').innerText = "₹" + currentPrice;

    // C. Discount Badge Calculation
    const discount = Math.round(((product.mrp[qtyIndex] - currentPrice) / product.mrp[qtyIndex]) * 100);
    document.getElementById('disc').innerText = discount + "% OFF";

    // --- D. CHECKOUT LINK LOGIC (Magic Part) ---
    
    // Size ka naam pata karo
    const sizeLabels = ["250ml", "500ml", "750ml", "1 Litre"];
    const selectedSize = sizeLabels[qtyIndex];

    // Full Product Name banao (Ex: Vedic Origins Pure Desi Cow Ghee - 1 Litre)
    const fullName = `Vedic Origins ${product.title} - ${selectedSize}`;

    // Link generate karo jo data lekar jayega
    const checkoutLink = `checkout.html?product=${encodeURIComponent(fullName)}&price=${currentPrice}`;

    // 'Order Now' button par ye link laga do
    const btn = document.getElementById('pay-link');
    if(btn) {
        btn.href = checkoutLink;
    }
}

// Page load hone par ek baar chalao
updatePrice();
