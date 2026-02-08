/* =========================================
   PART 1: HOME PAGE LOGIC (Product & Price)
   Only runs if 'ghee-img' exists (Home Page)
   ========================================= */

// Sidebar Toggle Function (Global)
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburger');
    
    if (sidebar && overlay && hamburger) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// Navbar Scroll Effect (Global)
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Intersection Observer for Scroll Animations (Global)
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const animatedElements = document.querySelectorAll('.p-step, .review-card, .section-box');
        animatedElements.forEach(el => {
            if (!el.style.opacity) {
                observer.observe(el);
            }
        });
    });
}

// Ripple Effect for Buttons (Global)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple-container') || e.target.closest('.ripple-container')) {
        const button = e.target.classList.contains('ripple-container') ? e.target : e.target.closest('.ripple-container');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Preloader (Global)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
});

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
        const switchBox = document.querySelector('.switch-box');
        
        img.classList.add('spin');
        
        // Update switch box indicator
        if (switchBox) {
            if (type === 'buffalo') {
                switchBox.classList.add('buffalo');
            } else {
                switchBox.classList.remove('buffalo');
            }
        }

        // Toggle Active Buttons
        document.getElementById('cow-btn').className = `sw-btn ${type==='cow' ? 'active' : ''}`;
        document.getElementById('buff-btn').className = `sw-btn ${type==='buffalo' ? 'active' : ''}`;

        setTimeout(() => {
            currentType = type; 
            
            // Update Text with animation
            const title = document.getElementById('title');
            const desc = document.getElementById('desc');
            
            title.style.opacity = '0';
            desc.style.opacity = '0';
            
            setTimeout(() => {
                title.innerText = data[type].title;
                desc.innerText = data[type].desc;
                title.style.opacity = '1';
                desc.style.opacity = '1';
            }, 200);

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

        // B. Price Update with animation
        const priceElement = document.getElementById('price');
        const currentPrice = product.sale[qtyIndex];
        
        priceElement.style.transform = 'scale(0.8)';
        priceElement.style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('mrp').innerText = "₹" + product.mrp[qtyIndex];
            priceElement.innerText = "₹" + currentPrice;
            priceElement.style.transform = 'scale(1)';
            priceElement.style.opacity = '1';
        }, 200);

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

    // 1. SWITCH TABS WITH ANIMATION
    window.switchTab = function(mode) {
        currentMode = mode;
        const btns = document.querySelectorAll('.tab-btn');
        const nameField = document.getElementById('name-field');
        const title = document.getElementById('form-title');
        const authTabs = document.querySelector('.auth-tabs');

        if (mode === 'signup') {
            btns[0].classList.remove('active-tab');
            btns[1].classList.add('active-tab');
            if (authTabs) authTabs.classList.add('signup-active');
            
            // Slide in name field
            if (nameField) {
                nameField.style.display = 'flex';
                nameField.style.animation = 'slideInLeft 0.5s ease';
            }
            
            if (title) {
                title.style.animation = 'fadeIn 0.5s ease';
                title.innerText = "Join Family";
            }
        } else {
            btns[1].classList.remove('active-tab');
            btns[0].classList.add('active-tab');
            if (authTabs) authTabs.classList.remove('signup-active');
            
            // Slide out name field
            if (nameField) {
                nameField.style.animation = 'slideOutLeft 0.3s ease';
                setTimeout(() => {
                    nameField.style.display = 'none';
                }, 300);
            }
            
            if (title) {
                title.style.animation = 'fadeIn 0.5s ease';
                title.innerText = "Welcome Back";
            }
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

    // 3. SEND OTP WITH LOADING ANIMATION
    window.sendOTP = function() {
        const mobile = document.getElementById('mobile').value;
        const name = document.getElementById('fullname') ? document.getElementById('fullname').value : '';
        const btn = document.getElementById('get-otp-btn');

        if(currentMode === 'signup' && name === "") {
            alert("Please enter your Full Name first!");
            return;
        }

        btn.innerText = "Sending...";
        btn.classList.add('loading');
        
        setTimeout(() => {
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            
            // Animate transition
            step1.style.animation = 'slideOutLeft 0.4s ease';
            setTimeout(() => {
                step1.style.display = 'none';
                step2.style.display = 'block';
                step2.style.animation = 'slideInRight 0.4s ease';
            }, 400);
            
            document.getElementById('user-mobile').innerText = "+91 " + mobile;
            
            alert("Vedic Origins OTP: 1234");
            setTimeout(() => {
                document.getElementById('otp1').focus();
            }, 500);
        }, 1000);
    }

    // 4. AUTO MOVE CURSOR WITH ANIMATION
    window.moveNext = function(current, nextID) {
        // Add success animation to filled box
        if(current.value.length >= 1) {
            current.classList.add('success');
            
            if(nextID) {
                document.getElementById(nextID).focus();
            } else {
                // If last box, verify automatically or focus button
                document.querySelector('#step-2 .auth-btn').focus();
            }
        }
    }

    // 5. VERIFY LOGIN WITH ENHANCED FEEDBACK
    window.verifyLogin = function() {
        const o1 = document.getElementById('otp1').value;
        const o2 = document.getElementById('otp2').value;
        const o3 = document.getElementById('otp3').value;
        const o4 = document.getElementById('otp4').value;
        const code = o1 + o2 + o3 + o4;

        if(code === "1234") {
            // Success animation
            document.querySelectorAll('.otp-box').forEach(box => {
                box.classList.add('success');
            });
            
            setTimeout(() => {
                alert("✅ Success! Welcome to Vedic Origins.");
                window.location.href = "profile.html"; 
            }, 500);
        } else {
            // Error animation
            document.querySelectorAll('.otp-box').forEach(box => {
                box.classList.add('error');
                box.classList.remove('success');
            });
            
            setTimeout(() => {
                document.querySelectorAll('.otp-box').forEach(box => {
                    box.classList.remove('error');
                    box.value = "";
                });
                document.getElementById('otp1').focus();
            }, 500);
            
            alert("❌ Wrong OTP! Try 1234");
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
    
    // Edit Address Functionality
    window.editAddress = function() {
        const newAddress = prompt("Enter new address:", "123, Village Road, Near Old Temple, Guna, Madhya Pradesh - 473001");
        if(newAddress && newAddress.trim() !== "") {
            alert("✅ Address Updated Successfully!");
            // In real app, this would update the database
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
