document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'auth.html';
            return;
        }
        
        // Load supplier data
        loadSupplierData(user.uid);
        
        // Set up tabs
        setupTabs();
        
        // Set up logout button
        document.getElementById('logout-btn').addEventListener('click', logout);
    });
    
    function loadSupplierData(userId) {
        db.collection('suppliers').doc(userId).get().then(doc => {
            if (doc.exists) {
                const supplier = doc.data();
                
                // Update header
                document.getElementById('shop-name-header').textContent = supplier.shopName;
                
                // Update profile tab
                document.getElementById('profile-shop-name').textContent = supplier.shopName;
                document.getElementById('profile-phone').textContent = supplier.contactNumber;
                document.getElementById('profile-email').textContent = supplier.email;
                document.getElementById('profile-location').textContent = 
                    `${supplier.location.latitude.toFixed(4)}, ${supplier.location.longitude.toFixed(4)}`;
                
                // Update ratings tab
                document.getElementById('up-count').textContent = supplier.rating.up;
                document.getElementById('down-count').textContent = supplier.rating.down;
                
                // Update status toggle
                const statusToggle = document.getElementById('shop-status');
                statusToggle.checked = supplier.status === 'OPEN';
                document.getElementById('status-text').textContent = supplier.status;
                
                statusToggle.addEventListener('change', function() {
                    document.getElementById('status-text').textContent = 
                        this.checked ? 'OPEN' : 'CLOSED';
                });
                
                // Load stock items
                loadStockItems(supplier.stock);
                
                // Set up save button
                document.getElementById('save-stock').addEventListener('click', () => {
                    saveSupplierData(userId);
                });
            }
        });
    }
    
    function loadStockItems(stock) {
        const stockItemsContainer = document.getElementById('stock-items');
        stockItemsContainer.innerHTML = '';
        
        // Common food items for street vendors
        const commonItems = [
            'Onions', 'Tomatoes', 'Potatoes', 'Oil', 'Wheat Flour',
            'Rice', 'Milk', 'Cheese', 'Butter', 'Eggs',
            'Chicken', 'Spices', 'Lentils', 'Vegetables', 'Fruits'
        ];
        
        commonItems.forEach(item => {
            const itemId = item.toLowerCase().replace(/\s+/g, '-');
            const isChecked = stock[item] || false;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'stock-item';
            itemElement.innerHTML = `
                <input type="checkbox" id="${itemId}" ${isChecked ? 'checked' : ''}>
                <label for="${itemId}">${item}</label>
            `;
            
            stockItemsContainer.appendChild(itemElement);
        });
    }
    
    function saveSupplierData(userId) {
        const status = document.getElementById('shop-status').checked ? 'OPEN' : 'CLOSED';
        
        // Get all checked items
        const stock = {};
        document.querySelectorAll('#stock-items input[type="checkbox"]').forEach(checkbox => {
            const itemName = checkbox.nextElementSibling.textContent;
            stock[itemName] = checkbox.checked;
        });
        //
        console.log(`[${new Date().toISOString()}] Saving stock:`, {
        items: Object.keys(stock).length,
        details: JSON.parse(JSON.stringify(stock)) 
    });

        db.collection('suppliers').doc(userId).update({
            status: status,
            stock: stock
        }).then(() => {
            alert('Changes saved successfully!');
        }).catch(error => {
            console.error('Error saving data:', error);
            alert('Failed to save changes. Please try again.');
        });
    }
    
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    function logout() {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        });
    }
});
