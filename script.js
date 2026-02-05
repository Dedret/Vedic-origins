// --- DATA CONFIGURATION (8 Images) ---
const data = {
    cow: {
        title: "A2 Gir Cow Ghee",
        desc: "Medicinal Grade. Golden Yellow. Good for Heart.",
        // 4 Images (250ml se 1L tak)
        imgs: [
            "cow0.jpg", 
            "cow1.jpg", 
            "cow2.jpg", 
            "cow3.jpg"
        ],
        mrp: [1200, 2300, 3400, 4500],
        sale: [1000, 2000, 3000, 4000],
        links: ["L1", "L2", "L3", "L4"]
    },
    buffalo: {
        title: "Pure Buffalo Ghee",
        desc: "High Fat. White Granular. Best for Cooking.",
        // 4 Images (250ml se 1L tak)
        imgs: [
            "buff0.jpg", 
            "buff1.jpg", 
            "buff2.jpg", 
            "buff3.jpg"
        ],
        mrp: [700, 1300, 1900, 2500],
        sale: [500, 1000, 1500, 2000],
        links: ["L5", "L6", "L7", "L8"]
    }
};

let currentType = 'cow'; 

// --- SWITCH FUNCTION (Animation ke saath) ---
function switchGhee(type) {
    if(currentType === type) return;

    // 1. Animation Shuru (Ghumne wala effect)
    const img = document.getElementById('ghee-img');
    img.classList.add('spin');

    // 2. Buttons Turant Badlo
    document.getElementById('cow-btn').className = `sw-btn ${type==='cow' ? 'active' : ''}`;
    document.getElementById('buff-btn').className = `sw-btn ${type==='buffalo' ? 'active' : ''}`;

    // 3. 300ms ka Intezaar (Taki photo ghumte waqt change ho)
    setTimeout(() => {
        currentType = type; // Ab type change karo

        // Text Update
        document.getElementById('title').innerText = data[type].title;
        document.getElementById('desc').innerText = data[type].desc;

        // Price aur Image Update call karo
        updatePrice();

        // Animation Roko
        img.classList.remove('spin');
    }, 300);
}

// --- UPDATE PRICE & IMAGE ---
function updatePrice() {
    const qtyIndex = document.getElementById('qty').value; 
    const product = data[currentType];

    // Image Change (Quantity ke hisaab se)
    document.getElementById('ghee-img').src = product.imgs[qtyIndex];

    // Price Logic
    const mrp = product.mrp[qtyIndex];
    const sale = product.sale[qtyIndex];
    const link = product.links[qtyIndex];

    document.getElementById('mrp').innerText = "₹" + mrp;
    document.getElementById('price').innerText = "₹" + sale;
    document.getElementById('pay-link').href = link;

    // Discount Math
    const discount = Math.round(((mrp - sale) / mrp) * 100);
    document.getElementById('disc').innerText = discount + "% OFF";
}

// First Load
updatePrice();
