/* =========================================
   PART 1: HOME PAGE LOGIC (Product & Price)
   Only runs if 'ghee-img' exists (Home Page)
   ========================================= */
if (document.getElementById('ghee-img')) {

    // 1. DATA CONFIGURATION
    const data = {
        cow: {
            title: "Pure Desi Cow Ghee",
            desc: "Medicinal Grade. Golden Yellow. Good for Heart.",
            imgs: ["cow0.jpg", "cow1.jpg", "cow2.jpg", "cow3.jpg"],
            mrp: [1200, 2300, 3400, 4500],
            sale: [1000, 2000, 3000, 4000]
        },
        buffalo: {
            title: "Pure Buffalo Ghee",
            desc: "High Fat. White Granular. Best for Cooking.",
            imgs: ["buff0.jpg", "buff1.jpg", "buff2.jpg", "buff3.jpg"],
            mrp: [700, 1300, 1900, 2500],
            sale: [500, 1000, 1500, 2000]
        }
    };

    let currentType = 'cow'; 

    // 2. SWITCH GHEE TYPE (Attached to window)
    window.switchGhee = function(type) {
        if(currentType === type) return;

        const img = document.getElementById('ghee-img');
        img.classList.add('spin');

        // Toggle Active Buttons
        document.getElementById('cow-btn').className = `sw-btn ${type==='cow' ? 'active' : ''}`;
        document.getElementById('buff-btn').className = `sw-btn ${type==='buffalo' ? 'active' : ''}`;

        setTimeout(() => {
            currentType = type; 
            
            // Update Text
            document.getElementById('title').innerText = data[type].title;
            document.getElementById('desc').innerText = data[type].desc;

            // Update Price & Image
            window.updatePrice();

            img.classList.remove('spin');
        }, 300);
    }

    // 3. UPDATE PRICE & LINK GENERATOR
    window.updatePrice = function() {
        const qtyIndex = document.getElementById('qty').value; 
        const product = data[currentType];

        // A. Image Update
        document.getElementById('ghee-img').src = product.imgs[qtyIndex];

        // B. Price Update
        const currentPrice = product.sale[qtyIndex];
        document.getElementById('mrp').innerText = "₹" + product.mrp[qtyIndex];
        document.getElementById('price').innerText = "₹" + currentPrice;

        // C. Discount Badge
        const discount = Math.round(((product.mrp[qtyIndex] - currentPrice) / product.mrp[qtyIndex]) * 100);
        document.getElementById('disc').innerText = discount + "% OFF";

        // D. Checkout Link Logic
        const sizeLabels = ["250ml", "500ml", "750ml", "1 Litre"];
        const selectedSize = sizeLabels[qtyIndex];
        const fullName = `Vedic Origins ${product.title} - ${selectedSize}`;
        
        const checkoutLink = `checkout.html?product=${encodeURIComponent(fullName)}&price=${currentPrice}`;

        const btn = document.getElementById('pay-link');
        if(btn) {
            btn.href = checkoutLink;
        }
    }

    // Initialize on Load
    window.updatePrice();
}

/* =========================================
   PART 2: LOGIN PAGE LOGIC
   Only runs if 'mobile' input exists (Login Page)
   ========================================= */
if (document.getElementById('mobile')) {

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

        // Regex to remove non-numeric chars
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
                // If last box, verify automatically or focus button
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
            // REDIRECT TO PROFILE (Updated)
            window.location.href = "profile.html"; 
        } else {
            alert("❌ Wrong OTP! Try 1234");
            document.getElementById('otp1').value = "";
            document.getElementById('otp2').value = "";
            document.getElementById('otp3').value = "";
            document.getElementById('otp4').value = "";
            document.getElementById('otp1').focus();
        }
    }
}

/* =========================================
   PART 3: PROFILE PAGE LOGIC
   Only runs if profile-container exists (Profile Page)
   ========================================= */
if (document.querySelector('.profile-container')) {
    
    // Track Order Functionality
    window.trackOrder = function(orderDate, product) {
        alert(`Tracking Order:\n\nProduct: ${product}\nOrdered: ${orderDate}\n\nStatus: Order is on the way! 🚚`);
    }
    
    // Save Profile Details and reflect on page
    window.saveProfile = function(event) {
        event.preventDefault();
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const mobile = document.getElementById('profile-mobile').value.trim();
        const address = document.getElementById('profile-address').value.trim();

        if(!name || !email || !mobile || !address) {
            alert("Please fill all details before saving.");
            return;
        }

        document.getElementById('display-name').innerText = name;
        document.getElementById('display-email').innerText = email;
        document.getElementById('display-mobile').innerText = "+91 " + mobile;
        document.getElementById('display-address').innerText = address;

        alert("✅ Profile updated successfully!");
    }
    
    // Edit Address Functionality
    window.editAddress = function() {
        const newAddress = prompt("Enter new address:", "123, Village Road, Near Old Temple, Guna, Madhya Pradesh - 473001");
        if(newAddress && newAddress.trim() !== "") {
            alert("✅ Address Updated Successfully!");
            document.getElementById('profile-address').value = newAddress.trim();
            document.getElementById('display-address').innerText = newAddress.trim();
        }
    }
    
    // Logout Function (moved from inline to here)
    window.logout = function() {
        if(confirm("Are you sure you want to logout?")) {
            alert("👋 Logged out successfully!");
            window.location.href = "index.html";
        }
    }
}
