// --- DATA CONFIGURATION (8 Images Logic) ---
const data = {
    cow: {
        title: "A2 Gir Cow Ghee",
        desc: "Medicinal Grade. Golden Yellow. Good for Heart.",
        // 4 Images for 4 Sizes
        imgs: [
            "cow0.jpg", // 250ml
            "cow1.jpg", // 500ml
            "cow2.jpg", // 750ml
            "cow3.jpg"  // 1L
        ],
        mrp: [1200, 2300, 3400, 4500],
        sale: [1000, 2000, 3000, 4000],
        // Razorpay Links (Baad mein yahan asli links daalna)
        links: ["L1", "L2", "L3", "L4"] 
    },
    buffalo: {
        title: "Pure Buffalo Ghee",
        desc: "High Fat. White Granular. Best for Cooking.",
        imgs: [
            "buff0.jpg", // 250ml
            "buff1.jpg", // 500ml
            "buff2.jpg", // 750ml
            "buff3.jpg"  // 1L
        ],
        mrp: [700, 1300, 1900, 2500],
        sale: [500, 1000, 1500, 2000],
        links: ["L5", "L6", "L7", "L8"]
    }
};

let currentType = 'cow'; // Shuruat Cow se

// --- SWITCH FUNCTION ---
function switchGhee(type) {
    if(currentType === type) return;
    currentType = type;

    // Button Style Change
    document.getElementById('cow-btn').className = `sw-btn ${type==='cow' ? 'active' : ''}`;
    document.getElementById('buff-btn').className = `sw-btn ${type==='buffalo' ? 'active' : ''}`;

    // Title Text Update
    document.getElementById('title').innerText = data[type].title;
    document.getElementById('desc').innerText = data[type].desc;

    // Price Update call karo (Ye image bhi update karega)
    updatePrice();
}

// --- UPDATE PRICE & IMAGE FUNCTION ---
function updatePrice() {
    const qtyIndex = document.getElementById('qty').value; // Value: 0, 1, 2, 3
    const product = data[currentType];

    // 1. Image Update (Sabse Important)
    // Ye code ab `imgs` list se sahi photo uthayega
    document.getElementById('ghee-img').src = product.imgs[qtyIndex];

    // 2. Price Update
    const mrp = product.mrp[qtyIndex];
    const sale = product.sale[qtyIndex];
    const link = product.links[qtyIndex];

    document.getElementById('mrp').innerText = "₹" + mrp;
    document.getElementById('price').innerText = "₹" + sale;
    document.getElementById('pay-link').href = link;

    // 3. Discount Update
    const discount = Math.round(((mrp - sale) / mrp) * 100);
    document.getElementById('disc').innerText = discount + "% OFF";
}

// Page Load hone par run karo
updatePrice();
