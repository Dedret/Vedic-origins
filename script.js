// --- DATA CONFIGURATION ---
const data = {
    cow: {
        title: "A2 Gir Cow Ghee",
        desc: "Medicinal Grade. Golden Yellow. Good for Heart.",
        img: "https://via.placeholder.com/400x400/f1c40f/fff?text=Cow+Ghee", // Yahan apni Cow Image link daalna
        // Price Settings: [250ml, 500ml, 750ml, 1L]
        mrp: [1200, 2300, 3400, 4500],   // Nakli MRP (Kata hua price)
        sale: [1000, 2000, 3000, 4000],  // Asli Selling Price
        // Razorpay Links (Paste your generated links inside quotes)
        links: [
            "LINK_COW_250",
            "LINK_COW_500",
            "LINK_COW_750",
            "LINK_COW_1L"
        ]
    },
    buffalo: {
        title: "Pure Buffalo Ghee",
        desc: "High Fat. Creamy White. Best for Mithai.",
        img: "https://via.placeholder.com/400x400/ecf0f1/333?text=Buffalo+Ghee", // Yahan apni Buffalo Image link daalna
        // Price Settings: [250ml, 500ml, 750ml, 1L]
        mrp: [700, 1300, 1900, 2500],    // Nakli MRP
        sale: [500, 1000, 1500, 2000],   // Asli Selling Price
        // Razorpay Links
        links: [
            "LINK_BUFF_250",
            "LINK_BUFF_500",
            "LINK_BUFF_750",
            "LINK_BUFF_1L"
        ]
    }
};

let currentType = 'cow'; // Shuruat Cow se hogi

// --- SWITCH FUNCTION (Cow <-> Buffalo) ---
function switchGhee(type) {
    if(currentType === type) return; // Agar same button dabaya to kuch mat karo
    currentType = type;

    // Buttons Update
    document.getElementById('cow-btn').className = `sw-btn ${type==='cow' ? 'active' : ''}`;
    document.getElementById('buff-btn').className = `sw-btn ${type==='buffalo' ? 'active' : ''}`;

    // Image Spin Animation
    const img = document.getElementById('ghee-img');
    img.classList.add('spin');

    // Data Change after small delay
    setTimeout(() => {
        img.src = data[type].img;
        document.getElementById('title').innerText = data[type].title;
        document.getElementById('desc').innerText = data[type].desc;
        updatePrice(); // Price update call
        img.classList.remove('spin');
    }, 300);
}

// --- PRICE UPDATE FUNCTION ---
function updatePrice() {
    const qtyIndex = document.getElementById('qty').value; // 0, 1, 2, or 3
    const product = data[currentType];

    const mrp = product.mrp[qtyIndex];
    const sale = product.sale[qtyIndex];
    const link = product.links[qtyIndex];

    // Screen par numbers change karo
    document.getElementById('mrp').innerText = "₹" + mrp;
    document.getElementById('price').innerText = "₹" + sale;
    document.getElementById('pay-link').href = link;

    // Discount Math Calculation
    const discount = Math.round(((mrp - sale) / mrp) * 100);
    document.getElementById('disc').innerText = discount + "% OFF";
}

// First Load par run karo
updatePrice();

