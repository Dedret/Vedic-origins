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
// --- LOGIN PAGE LOGIC ---

// Check if we are on the login page
if(document.getElementById('mobile')) {

    let currentMode = 'login'; 

    // 1. SWITCH TABS
    window.switchTab = function(mode) {
        currentMode = mode;
        const btns = document.querySelectorAll('.tab-btn');
        const nameField = document.getElementById('name-field');
        const title = document.getElementById('form-title');

        if (mode === 'signup') {
            btns[0].classList.remove('active-tab');
            btns[1].classList.add('active-tab');
            nameField.style.display = 'flex';
            title.innerText = "Join Family";
        } else {
            btns[1].classList.remove('active-tab');
            btns[0].classList.add('active-tab');
            nameField.style.display = 'none';
            title.innerText = "Welcome Back";
        }
    }

    // 2. VALIDATE MOBILE
    window.validateMobile = function() {
        const mobileInput = document.getElementById('mobile');
        const btn = document.getElementById('get-otp-btn');

        // Safe Regex
        const regex = new RegExp("[^0-9]", "g");
        mobileInput.value = mobileInput.value.replace(regex, "");
        
        if (mobileInput.value.length === 10) {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        } else {
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
        }
    }

    // 3. SEND OTP
    window.sendOTP = function() {
        const mobile = document.getElementById('mobile').value;
        const name = document.getElementById('fullname').value;

        if(currentMode === 'signup' && name === "") {
            alert("Please enter your Full Name first!");
            return;
        }

        document.getElementById('get-otp-btn').innerText = "Sending...";
        
        setTimeout(() => {
            document.getElementById('step-1').style.display = 'none';
            document.getElementById('step-2').style.display = 'block';
            document.getElementById('user-mobile').innerText = "+91 " + mobile;
            
            alert("Vedic Origins OTP: 1234");
            document.getElementById('otp1').focus();
        }, 1000);
    }

    // 4. AUTO MOVE CURSOR
    window.moveNext = function(current, nextID) {
        if(current.value.length >= 1) {
            if(nextID) {
                document.getElementById(nextID).focus();
            } else {
                document.querySelector('#step-2 .auth-btn').focus();
            }
        }
    }

    // 5. VERIFY LOGIN
    window.verifyLogin = function() {
        const o1 = document.getElementById('otp1').value;
        const o2 = document.getElementById('otp2').value;
        const o3 = document.getElementById('otp3').value;
        const o4 = document.getElementById('otp4').value;
        const code = o1 + o2 + o3 + o4;

        if(code === "1234") {
            alert("✅ Success! Welcome to Vedic Origins.");
            window.location.href = "index.html"; 
        } else {
            alert("❌ Wrong OTP! Try 1234");
            document.getElementById('otp1').value = "";
            document.getElementById('otp2').value = "";
            document.getElementById('otp3').value = "";
            document.getElementById('otp4').value = "";
        }
    }
}
