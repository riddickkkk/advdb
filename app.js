

// User credentials
const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    user: { username: 'user', password: 'user123', role: 'user', name: 'User' }
};

// Current logged in user
let currentUser = null;

// Current category
let currentCategory = 'Customer';

// Sample data for Customers
let customers = [
    { id: 1, firstName: 'CUST001', lastName: 'John Smith', email: 'john.smith@email.com', phone: '555-0101', address: '123 Main St', status: 'Active', hireDate: '2023-01-15' },
    { id: 2, firstName: 'CUST002', lastName: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '555-0102', address: '456 Oak Ave', status: 'Active', hireDate: '2022-06-20' },
    { id: 3, firstName: 'CUST003', lastName: 'Michael Williams', email: 'michael.williams@email.com', phone: '555-0103', address: '789 Pine Rd', status: 'Active', hireDate: '2023-03-10' },
    { id: 4, firstName: 'CUST004', lastName: 'Emily Brown', email: 'emily.brown@email.com', phone: '555-0104', address: '321 Elm St', status: 'Active', hireDate: '2021-09-05' },
    { id: 5, firstName: 'CUST005', lastName: 'David Davis', email: 'david.davis@email.com', phone: '555-0105', address: '654 Maple Dr', status: 'Inactive', hireDate: '2020-11-12' }
];

// Sample data for Services
let services = [
    { id: 1, serviceId: 'SVC001', serviceName: 'AC Repair', price: 150.00, status: 'Active' },
    { id: 2, serviceId: 'SVC002', serviceName: 'AC Installation', price: 350.00, status: 'Active' },
    { id: 3, serviceId: 'SVC003', serviceName: 'AC Maintenance', price: 80.00, status: 'Active' },
    { id: 4, serviceId: 'SVC004', serviceName: 'Gas Refill', price: 100.00, status: 'Inactive' }
];

// Sample data for Bookings
let bookings = [
    { id: 1, bookingId: 'BKG001', customerId: 'CUST001', serviceId: 'SVC001', bookingDate: '2026-05-01', status: 'Pending', technicianId: '' },
    { id: 2, bookingId: 'BKG002', customerId: 'CUST002', serviceId: 'SVC002', bookingDate: '2026-05-02', status: 'Confirmed', technicianId: 'TECH001' },
    { id: 3, bookingId: 'BKG003', customerId: 'CUST003', serviceId: 'SVC003', bookingDate: '2026-05-03', status: 'Completed', technicianId: 'TECH002' }
];

// Sample data for Technicians
let technicians = [
    { id: 1, technicianId: 'TECH001', name: 'Mike Johnson', contactNumber: '555-1001', specialization: 'Residential', status: 'Active' },
    { id: 2, technicianId: 'TECH002', name: 'James Wilson', contactNumber: '555-1002', specialization: 'Commercial', status: 'Active' },
    { id: 3, technicianId: 'TECH003', name: 'Robert Brown', contactNumber: '555-1003', specialization: 'Residential', status: 'On Leave' }
];

// Sample data for Payments
let payments = [
    { id: 1, paymentId: 'PAY001', bookingId: 'BKG002', amount: 350.00, paymentDate: '2026-04-25', paymentMethod: 'Cash', status: 'Completed' },
    { id: 2, paymentId: 'PAY002', bookingId: 'BKG003', amount: 80.00, paymentDate: '2026-04-26', paymentMethod: 'Credit Card', status: 'Completed' }
];

// Sample data for Service History
let serviceHistory = [
    { id: 1, historyId: 'HIST001', unitServiceRecord: 'CUST001-SVC001', serviceDate: '2026-04-20', remarks: 'Completed successfully' },
    { id: 2, historyId: 'HIST002', unitServiceRecord: 'CUST002-SVC002', serviceDate: '2026-04-22', remarks: 'Installation completed' }
];

// Sample data for Aircon Units
let airconUnits = [
    { id: 1, unitId: 'UNIT001', customerId: 'CUST001', brand: 'Daikin', model: 'FTKF25', type: 'Split Type', status: 'Active' },
    { id: 2, unitId: 'UNIT002', customerId: 'CUST002', brand: 'LG', model: 'LS-Q18CN', type: 'Split Type', status: 'Active' }
];

// Alias for backward compatibility
let employees = customers;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const employeeTableBody = document.getElementById('employeeTableBody');
const employeeCount = document.getElementById('employeeCount');
const emptyState = document.getElementById('emptyState');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const viewModal = document.getElementById('viewModal');
const deleteModal = document.getElementById('deleteModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const employeeProfile = document.getElementById('employeeProfile');
const deleteEmployeeName = document.getElementById('deleteEmployeeName');

// Check for existing session
function checkSession() {
    const session = localStorage.getItem('employeeSystemUser');
    if (session) {
        currentUser = JSON.parse(session);
        showMainApp();
    }
}

// Login function
function login(username, password, role) {
    const user = users[role];
    if (user && user.username === username && user.password === password) {
        currentUser = { username: user.username, role: user.role, name: user.name };
        localStorage.setItem('employeeSystemUser', JSON.stringify(currentUser));
        return true;
    }
    return false;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('employeeSystemUser');
    loginPage.style.display = 'flex';
    mainApp.style.display = 'none';
}

// Show main app
function showMainApp() {
    loginPage.style.display = 'none';
    mainApp.style.display = 'flex';
    userInfo.innerHTML = `${currentUser.name} <span class="role-badge">${currentUser.role}</span>`;
    
    // Apply role-based permissions
    applyRolePermissions();
    
    // Initialize category and render
    updateTableHeaders(currentCategory);
    renderRecords();
    setupEventListeners();
}

// Apply role-based permissions
function applyRolePermissions() {
    if (currentUser.role === 'user') {
        // Hide add employee button for regular users
        if (addEmployeeBtn) {
            addEmployeeBtn.style.display = 'none';
        }
    } else {
        // Admin has full access
        if (addEmployeeBtn) {
            addEmployeeBtn.style.display = 'inline-flex';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        if (login(username, password, role)) {
            loginError.classList.remove('visible');
            showMainApp();
        } else {
            loginError.classList.add('visible');
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', logout);
});

// Setup Event Listeners
function setupEventListeners() {
    // Search and filters
    searchInput.addEventListener('input', renderRecords);
    statusFilter.addEventListener('change', renderRecords);

    // Add employee button
    addEmployeeBtn.addEventListener('click', () => openModal());

    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Set current category
            currentCategory = tab.dataset.category;
            
            // Update record type hidden field
            document.getElementById('recordType').value = currentCategory;
            
            // Show/hide appropriate form fields
            showFormFields(currentCategory);
            
            // Update table headers
            updateTableHeaders(currentCategory);
            
            // Render records for this category
            renderRecords();
        });
    });

    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('closeViewModal').addEventListener('click', closeViewModal);
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

    // Modal overlays
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            closeModal();
            closeViewModal();
            closeDeleteModal();
        });
    });

    // Form submission
    employeeForm.addEventListener('submit', handleFormSubmit);

    // Delete confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
}

// Render records based on current category
function renderRecords() {
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    
    let data = [];
    let filteredData = [];
    
    // Get data based on category
    switch(currentCategory) {
        case 'Customer':
            data = customers;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.firstName && item.firstName.toLowerCase().includes(searchTerm)) ||
                    (item.lastName && item.lastName.toLowerCase().includes(searchTerm)) ||
                    (item.email && item.email.toLowerCase().includes(searchTerm)) ||
                    (item.phone && item.phone.toLowerCase().includes(searchTerm)) ||
                    (item.address && item.address.toLowerCase().includes(searchTerm));
                const matchesStatus = !status || item.status === status;
                return matchesSearch && matchesStatus;
            });
            break;
        case 'Services':
            data = services;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.serviceId && item.serviceId.toLowerCase().includes(searchTerm)) ||
                    (item.serviceName && item.serviceName.toLowerCase().includes(searchTerm));
                const matchesStatus = !status || item.status === status;
                return matchesSearch && matchesStatus;
            });
            break;
        case 'Bookings':
            data = bookings;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.bookingId && item.bookingId.toLowerCase().includes(searchTerm)) ||
                    (item.customerId && item.customerId.toLowerCase().includes(searchTerm));
                const matchesStatus = !status || item.status === status;
                return matchesSearch && matchesStatus;
            });
            break;
        case 'Technicians':
            data = technicians;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.technicianId && item.technicianId.toLowerCase().includes(searchTerm)) ||
                    (item.name && item.name.toLowerCase().includes(searchTerm));
                const matchesStatus = !status || item.status === status;
                return matchesSearch && matchesStatus;
            });
            break;
        case 'Payments':
            data = payments;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.paymentId && item.paymentId.toLowerCase().includes(searchTerm)) ||
                    (item.bookingId && item.bookingId.toLowerCase().includes(searchTerm));
                const matchesStatus = !status || item.status === status;
                return matchesSearch && matchesStatus;
            });
            break;
        case 'Service History':
            data = serviceHistory;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.historyId && item.historyId.toLowerCase().includes(searchTerm)) ||
                    (item.unitServiceRecord && item.unitServiceRecord.toLowerCase().includes(searchTerm));
                return matchesSearch;
            });
            break;
        case 'Aircon Units':
            data = airconUnits;
            filteredData = data.filter(item => {
                const matchesSearch = !searchTerm || 
                    (item.unitId && item.unitId.toLowerCase().includes(searchTerm)) ||
                    (item.customerId && item.customerId.toLowerCase().includes(searchTerm)) ||
                    (item.brand && item.brand.toLowerCase().includes(searchTerm));
                const matchesStatus = !status || item.status === status;
                return matchesSearch && matchesStatus;
            });
            break;
        default:
            filteredData = [];
    }

    // Update count
    employeeCount.textContent = `${filteredData.length} record${filteredData.length !== 1 ? 's' : ''}`;

    // Show/hide empty state
    if (filteredData.length === 0) {
        employeeTableBody.innerHTML = '';
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');
        employeeTableBody.innerHTML = filteredData.map(item => createRecordRow(item)).join('');
    }
}

// Show/hide form fields based on category
function showFormFields(category) {
    const allFields = ['customerFields', 'serviceFields', 'bookingFields', 'technicianFields', 'paymentFields', 'historyFields', 'airconFields'];
    
    allFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.display = 'none';
        }
    });
    
    // Show the appropriate fields
    const fieldMap = {
        'Customer': 'customerFields',
        'Services': 'serviceFields',
        'Bookings': 'bookingFields',
        'Technicians': 'technicianFields',
        'Payments': 'paymentFields',
        'Service History': 'historyFields',
        'Aircon Units': 'airconFields'
    };
    
    const targetField = fieldMap[category];
    if (targetField) {
        const field = document.getElementById(targetField);
        if (field) {
            field.style.display = 'block';
        }
    }
    
    // Update modal title
    modalTitle.textContent = 'Add ' + category.slice(0, -1);
}

// Update table headers based on category
function updateTableHeaders(category) {
    const tableHead = document.getElementById('tableHead');
    const headers = {
        'Customer': `<tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>`,
        'Services': `<tr>
            <th>Service ID</th>
            <th>Service Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>`,
        'Bookings': `<tr>
            <th>Booking ID</th>
            <th>Customer ID</th>
            <th>Service ID</th>
            <th>Booking Date</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>`,
        'Technicians': `<tr>
            <th>Technician ID</th>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>`,
        'Payments': `<tr>
            <th>Payment ID</th>
            <th>Booking ID</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>`,
        'Service History': `<tr>
            <th>History ID</th>
            <th>Unit/Service Record</th>
            <th>Service Date</th>
            <th>Remarks</th>
            <th>Actions</th>
        </tr>`,
        'Aircon Units': `<tr>
            <th>Unit ID</th>
            <th>Customer ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Type</th>
            <th>Actions</th>
        </tr>`
    };
    
    if (tableHead && headers[category]) {
        tableHead.innerHTML = headers[category];
    }
}

// Create table row based on category
function createRecordRow(item) {
    const statusClass = item.status ? item.status.toLowerCase().replace(' ', '-') : 'active';
    const isAdmin = currentUser && currentUser.role === 'admin';
    const deleteButton = isAdmin ? `<button class="btn btn-icon" onclick="deleteRecord(${item.id})" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>` : '';
    
    let row = '';
    
    switch(currentCategory) {
        case 'Customer':
            row = `<tr data-id="${item.id}">
                <td>${item.firstName || 'N/A'}</td>
                <td>${item.lastName || 'N/A'}</td>
                <td>${item.phone || 'N/A'}</td>
                <td>${item.address || 'N/A'}</td>
                <td><span class="status-badge status-${statusClass}">${item.status || 'Active'}</span></td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
        case 'Services':
            row = `<tr data-id="${item.id}">
                <td>${item.serviceId || 'N/A'}</td>
                <td>${item.serviceName || 'N/A'}</td>
                <td>$${item.price ? item.price.toFixed(2) : '0.00'}</td>
                <td><span class="status-badge status-${statusClass}">${item.status || 'Active'}</span></td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
        case 'Bookings':
            row = `<tr data-id="${item.id}">
                <td>${item.bookingId || 'N/A'}</td>
                <td>${item.customerId || 'N/A'}</td>
                <td>${item.serviceId || 'N/A'}</td>
                <td>${item.bookingDate || 'N/A'}</td>
                <td><span class="status-badge status-${statusClass}">${item.status || 'Pending'}</span></td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
        case 'Technicians':
            row = `<tr data-id="${item.id}">
                <td>${item.technicianId || 'N/A'}</td>
                <td>${item.name || 'N/A'}</td>
                <td>${item.contactNumber || 'N/A'}</td>
                <td>${item.specialization || 'N/A'}</td>
                <td><span class="status-badge status-${statusClass}">${item.status || 'Active'}</span></td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
        case 'Payments':
            row = `<tr data-id="${item.id}">
                <td>${item.paymentId || 'N/A'}</td>
                <td>${item.bookingId || 'N/A'}</td>
                <td>$${item.amount ? item.amount.toFixed(2) : '0.00'}</td>
                <td>${item.paymentDate || 'N/A'}</td>
                <td><span class="status-badge status-${statusClass}">${item.status || 'Pending'}</span></td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
        case 'Service History':
            row = `<tr data-id="${item.id}">
                <td>${item.historyId || 'N/A'}</td>
                <td>${item.unitServiceRecord || 'N/A'}</td>
                <td>${item.serviceDate || 'N/A'}</td>
                <td>${item.remarks || 'N/A'}</td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
        case 'Aircon Units':
            row = `<tr data-id="${item.id}">
                <td>${item.unitId || 'N/A'}</td>
                <td>${item.customerId || 'N/A'}</td>
                <td>${item.brand || 'N/A'}</td>
                <td>${item.model || 'N/A'}</td>
                <td>${item.type || 'N/A'}</td>
                <td><div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewRecord(${item.id})" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                    <button class="btn btn-icon" onclick="editRecord(${item.id})" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    ${deleteButton}
                </div></td>
            </tr>`;
            break;
    }
    
    return row;
}

// View record
function viewRecord(id) {
    let item = null;
    let dataArray = [];
    
    switch(currentCategory) {
        case 'Customer': dataArray = customers; break;
        case 'Services': dataArray = services; break;
        case 'Bookings': dataArray = bookings; break;
        case 'Technicians': dataArray = technicians; break;
        case 'Payments': dataArray = payments; break;
        case 'Service History': dataArray = serviceHistory; break;
        case 'Aircon Units': dataArray = airconUnits; break;
    }
    
    item = dataArray.find(x => x.id === id);
    if (!item) return;
    
    let details = '';
    for (const [key, value] of Object.entries(item)) {
        if (key !== 'id') {
            details += `<div class="profile-item"><label>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label><span>${value || 'N/A'}</span></div>`;
        }
    }
    
    employeeProfile.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${currentCategory.slice(0, 4)}</div>
            <div class="profile-info">
                <h3>${currentCategory} Details</h3>
                <p>${item.name || item.lastName || item.serviceName || item.bookingId || item.technicianId || item.paymentId || item.historyId || item.unitId || 'Record'}</p>
            </div>
        </div>
        <div class="profile-details">${details}</div>
    `;
    
    viewModal.classList.add('active');
}

// Edit record
function editRecord(id) {
    let item = null;
    
    switch(currentCategory) {
        case 'Customer': item = customers.find(x => x.id === id); break;
        case 'Services': item = services.find(x => x.id === id); break;
        case 'Bookings': item = bookings.find(x => x.id === id); break;
        case 'Technicians': item = technicians.find(x => x.id === id); break;
        case 'Payments': item = payments.find(x => x.id === id); break;
        case 'Service History': item = serviceHistory.find(x => x.id === id); break;
        case 'Aircon Units': item = airconUnits.find(x => x.id === id); break;
    }
    
    if (item) {
        openModal(item);
    }
}

// Delete record
function deleteRecord(id) {
    let item = null;
    
    switch(currentCategory) {
        case 'Customer': item = customers.find(x => x.id === id); break;
        case 'Services': item = services.find(x => x.id === id); break;
        case 'Bookings': item = bookings.find(x => x.id === id); break;
        case 'Technicians': item = technicians.find(x => x.id === id); break;
        case 'Payments': item = payments.find(x => x.id === id); break;
        case 'Service History': item = serviceHistory.find(x => x.id === id); break;
        case 'Aircon Units': item = airconUnits.find(x => x.id === id); break;
    }
    
    if (!item) return;
    
    employeeToDelete = { id: id, category: currentCategory };
    deleteEmployeeName.textContent = item.name || item.lastName || item.serviceName || item.bookingId || item.technicianId || item.paymentId || item.historyId || item.unitId || 'this record';
    deleteModal.classList.add('active');
}

// Create employee table row
function createEmployeeRow(emp) {
    const statusClass = emp.status ? emp.status.toLowerCase().replace(' ', '-') : 'active';
    const isAdmin = currentUser && currentUser.role === 'admin';
    const deleteButton = isAdmin ? `
        <button class="btn btn-icon" onclick="deleteEmployee(${emp.id})" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        </button>
    ` : '';
    
    return `
        <tr data-id="${emp.id}">
            <td>${emp.firstName || 'N/A'}</td>
            <td>${emp.lastName || 'N/A'}</td>
            <td>${emp.phone || 'N/A'}</td>
            <td>${emp.address || 'N/A'}</td>
            <td><span class="status-badge status-${statusClass}">${emp.status || 'Active'}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-icon" onclick="viewEmployee(${emp.id})" title="View">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="btn btn-icon" onclick="editEmployee(${emp.id})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    ${deleteButton}
                </div>
            </td>
        </tr>
    `;
}

// Modal functions
function openModal(employee = null) {
    employeeModal.classList.add('active');
    
    // Show appropriate form fields for current category
    showFormFields(currentCategory);
    
    modalTitle.textContent = employee ? 'Edit ' + currentCategory.slice(0, -1) : 'Add ' + currentCategory.slice(0, -1);
    
    if (employee) {
        document.getElementById('employeeId').value = employee.id;
        
        // Populate fields based on category
        switch(currentCategory) {
            case 'Customer':
                document.getElementById('customerId').value = employee.firstName || '';
                document.getElementById('customerName').value = employee.lastName || '';
                document.getElementById('email').value = employee.email || '';
                document.getElementById('contactNumber').value = employee.phone || '';
                document.getElementById('address').value = employee.address || '';
                const statusEl = document.getElementById('status');
                if (statusEl) statusEl.value = employee.status || 'Active';
                break;
            case 'Services':
                document.getElementById('serviceId').value = employee.serviceId || '';
                document.getElementById('serviceName').value = employee.serviceName || '';
                document.getElementById('price').value = employee.price || '';
                break;
            case 'Bookings':
                document.getElementById('bookingId').value = employee.bookingId || '';
                document.getElementById('bookingCustomerId').value = employee.customerId || '';
                document.getElementById('bookingServiceId').value = employee.serviceId || '';
                document.getElementById('bookingDate').value = employee.bookingDate || '';
                document.getElementById('bookingStatus').value = employee.status || 'Pending';
                break;
            case 'Technicians':
                document.getElementById('technicianId').value = employee.technicianId || '';
                document.getElementById('technicianName').value = employee.name || '';
                document.getElementById('techContactNumber').value = employee.contactNumber || '';
                document.getElementById('specialization').value = employee.specialization || '';
                break;
            case 'Payments':
                document.getElementById('paymentId').value = employee.paymentId || '';
                document.getElementById('paymentBookingId').value = employee.bookingId || '';
                document.getElementById('amount').value = employee.amount || '';
                document.getElementById('paymentDate').value = employee.paymentDate || '';
                document.getElementById('paymentMethod').value = employee.paymentMethod || 'Cash';
                break;
            case 'Service History':
                document.getElementById('historyId').value = employee.historyId || '';
                document.getElementById('unitServiceRecord').value = employee.unitServiceRecord || '';
                document.getElementById('serviceDate').value = employee.serviceDate || '';
                document.getElementById('remarks').value = employee.remarks || '';
                break;
            case 'Aircon Units':
                document.getElementById('unitId').value = employee.unitId || '';
                document.getElementById('airconCustomerId').value = employee.customerId || '';
                document.getElementById('brand').value = employee.brand || '';
                document.getElementById('model').value = employee.model || '';
                document.getElementById('type').value = employee.type || '';
                break;
        }
    } else {
        employeeForm.reset();
        document.getElementById('employeeId').value = '';
    }
}

function closeModal() {
    employeeModal.classList.remove('active');
    employeeForm.reset();
}

function viewEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    const statusClass = employee.status.toLowerCase().replace(' ', '-');
    
    employeeProfile.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${employee.firstName.substring(0, 4)}</div>
            <div class="profile-info">
                <h3>${employee.lastName}</h3>
                <p>${employee.position} - ${employee.department}</p>
            </div>
        </div>
        <div class="profile-details">
            <div class="profile-item">
                <label>Customer ID</label>
                <span>${employee.firstName}</span>
            </div>
            <div class="profile-item">
                <label>Customer Name</label>
                <span>${employee.lastName}</span>
            </div>
            <div class="profile-item">
                <label>Email</label>
                <span>${employee.email || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Contact Number</label>
                <span>${employee.phone || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Address</label>
                <span>${employee.address || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Category</label>
                <span>${employee.department}</span>
            </div>
            <div class="profile-item">
                <label>Service</label>
                <span>${employee.position}</span>
            </div>
            <div class="profile-item">
                <label>Status</label>
                <span class="status-badge status-${statusClass}">${employee.status}</span>
            </div>
            <div class="profile-item">
                <label>Date Added</label>
                <span>${employee.hireDate ? formatDate(employee.hireDate) : 'N/A'}</span>
            </div>
        </div>
    `;
    
    viewModal.classList.add('active');
}

function closeViewModal() {
    viewModal.classList.remove('active');
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        openModal(employee);
    }
}

let employeeToDelete = null;

function deleteEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    employeeToDelete = id;
    deleteEmployeeName.textContent = `${employee.firstName} ${employee.lastName}`;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    employeeToDelete = null;
}

function confirmDelete() {
    if (employeeToDelete) {
        const { id, category } = employeeToDelete;
        
        switch(category) {
            case 'Customer':
                customers = customers.filter(emp => emp.id !== id);
                employees = customers; // maintain alias
                break;
            case 'Services':
                services = services.filter(s => s.id !== id);
                break;
            case 'Bookings':
                bookings = bookings.filter(b => b.id !== id);
                break;
            case 'Technicians':
                technicians = technicians.filter(t => t.id !== id);
                break;
            case 'Payments':
                payments = payments.filter(p => p.id !== id);
                break;
            case 'Service History':
                serviceHistory = serviceHistory.filter(h => h.id !== id);
                break;
            case 'Aircon Units':
                airconUnits = airconUnits.filter(u => u.id !== id);
                break;
        }
        
        renderRecords();
        closeDeleteModal();
    }
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const recordType = document.getElementById('recordType').value;
    const employeeId = document.getElementById('employeeId').value;
    
    let newId;
    
    switch(recordType) {
        case 'Customer':
            newId = employeeId ? parseInt(employeeId) : Math.max(...customers.map(e => e.id), 0) + 1;
            const customerData = {
                id: newId,
                firstName: document.getElementById('customerId').value || 'CUST' + String(newId).padStart(3, '0'),
                lastName: document.getElementById('customerName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('contactNumber').value,
                address: document.getElementById('address').value,
                status: document.getElementById('status') ? document.getElementById('status').value : 'Active',
                hireDate: new Date().toISOString().split('T')[0]
            };
            if (employeeId) {
                const idx = customers.findIndex(c => c.id === parseInt(employeeId));
                if (idx !== -1) customers[idx] = customerData;
            } else {
                customers.push(customerData);
            }
            employees = customers;
            break;
            
        case 'Services':
            newId = employeeId ? parseInt(employeeId) : Math.max(...services.map(e => e.id), 0) + 1;
            const serviceData = {
                id: newId,
                serviceId: document.getElementById('serviceId').value || 'SVC' + String(newId).padStart(3, '0'),
                serviceName: document.getElementById('serviceName').value,
                price: parseFloat(document.getElementById('price').value) || 0,
                status: 'Active'
            };
            if (employeeId) {
                const idx = services.findIndex(s => s.id === parseInt(employeeId));
                if (idx !== -1) services[idx] = serviceData;
            } else {
                services.push(serviceData);
            }
            break;
            
        case 'Bookings':
            newId = employeeId ? parseInt(employeeId) : Math.max(...bookings.map(e => e.id), 0) + 1;
            const bookingData = {
                id: newId,
                bookingId: document.getElementById('bookingId').value || 'BKG' + String(newId).padStart(3, '0'),
                customerId: document.getElementById('bookingCustomerId').value,
                serviceId: document.getElementById('bookingServiceId').value,
                bookingDate: document.getElementById('bookingDate').value,
                status: document.getElementById('bookingStatus').value,
                technicianId: ''
            };
            if (employeeId) {
                const idx = bookings.findIndex(b => b.id === parseInt(employeeId));
                if (idx !== -1) bookings[idx] = bookingData;
            } else {
                bookings.push(bookingData);
            }
            break;
            
        case 'Technicians':
            newId = employeeId ? parseInt(employeeId) : Math.max(...technicians.map(e => e.id), 0) + 1;
            const techData = {
                id: newId,
                technicianId: document.getElementById('technicianId').value || 'TECH' + String(newId).padStart(3, '0'),
                name: document.getElementById('technicianName').value,
                contactNumber: document.getElementById('techContactNumber').value,
                specialization: document.getElementById('specialization').value,
                status: 'Active'
            };
            if (employeeId) {
                const idx = technicians.findIndex(t => t.id === parseInt(employeeId));
                if (idx !== -1) technicians[idx] = techData;
            } else {
                technicians.push(techData);
            }
            break;
            
        case 'Payments':
            newId = employeeId ? parseInt(employeeId) : Math.max(...payments.map(e => e.id), 0) + 1;
            const paymentData = {
                id: newId,
                paymentId: document.getElementById('paymentId').value || 'PAY' + String(newId).padStart(3, '0'),
                bookingId: document.getElementById('paymentBookingId').value,
                amount: parseFloat(document.getElementById('amount').value) || 0,
                paymentDate: document.getElementById('paymentDate').value,
                paymentMethod: document.getElementById('paymentMethod').value,
                status: 'Completed'
            };
            if (employeeId) {
                const idx = payments.findIndex(p => p.id === parseInt(employeeId));
                if (idx !== -1) payments[idx] = paymentData;
            } else {
                payments.push(paymentData);
            }
            break;
            
        case 'Service History':
            newId = employeeId ? parseInt(employeeId) : Math.max(...serviceHistory.map(e => e.id), 0) + 1;
            const historyData = {
                id: newId,
                historyId: document.getElementById('historyId').value || 'HIST' + String(newId).padStart(3, '0'),
                unitServiceRecord: document.getElementById('unitServiceRecord').value,
                serviceDate: document.getElementById('serviceDate').value,
                remarks: document.getElementById('remarks').value
            };
            if (employeeId) {
                const idx = serviceHistory.findIndex(h => h.id === parseInt(employeeId));
                if (idx !== -1) serviceHistory[idx] = historyData;
            } else {
                serviceHistory.push(historyData);
            }
            break;
            
        case 'Aircon Units':
            newId = employeeId ? parseInt(employeeId) : Math.max(...airconUnits.map(e => e.id), 0) + 1;
            const airconData = {
                id: newId,
                unitId: document.getElementById('unitId').value || 'UNIT' + String(newId).padStart(3, '0'),
                customerId: document.getElementById('airconCustomerId').value,
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                type: document.getElementById('type').value,
                status: 'Active'
            };
            if (employeeId) {
                const idx = airconUnits.findIndex(u => u.id === parseInt(employeeId));
                if (idx !== -1) airconUnits[idx] = airconData;
            } else {
                airconUnits.push(airconData);
            }
            break;
    }

    renderRecords();
    closeModal();
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}