// ========================================
// Employee Records System - JavaScript
// ========================================

// User credentials
const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    user: { username: 'user', password: 'user123', role: 'user', name: 'User' }
};

// Current logged in user
let currentUser = null;

// Sample data
let employees = [
    { id: 1, firstName: 'CUST001', lastName: 'John Smith', email: 'john.smith@email.com', department: 'Customer', position: 'Residential', phone: '555-0101', status: 'Active', hireDate: '2023-01-15', address: '123 Main St' },
    { id: 2, firstName: 'CUST002', lastName: 'Sarah Johnson', email: 'sarah.johnson@email.com', department: 'Customer', position: 'Commercial', phone: '555-0102', status: 'Active', hireDate: '2022-06-20', address: '456 Oak Ave' },
    { id: 3, firstName: 'CUST003', lastName: 'Michael Williams', email: 'michael.williams@email.com', department: 'Customer', position: 'Residential', phone: '555-0103', status: 'Active', hireDate: '2023-03-10', address: '789 Pine Rd' },
    { id: 4, firstName: 'CUST004', lastName: 'Emily Brown', email: 'emily.brown@email.com', department: 'Customer', position: 'Commercial', phone: '555-0104', status: 'Active', hireDate: '2021-09-05', address: '321 Elm St' },
    { id: 5, firstName: 'CUST005', lastName: 'David Davis', email: 'david.davis@email.com', department: 'Customer', position: 'Residential', phone: '555-0105', status: 'Inactive', hireDate: '2020-11-12', address: '654 Maple Dr' }
];

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const departmentFilter = document.getElementById('departmentFilter');
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
    
    renderEmployees();
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
    
    // Setup event listeners for main app
    setupEventListeners();
    
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
    searchInput.addEventListener('input', renderEmployees);
    departmentFilter.addEventListener('change', renderEmployees);
    statusFilter.addEventListener('change', renderEmployees);

    // Add employee button
    addEmployeeBtn.addEventListener('click', () => openModal());

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

// Render employees
function renderEmployees() {
    const searchTerm = searchInput.value.toLowerCase();
    const department = departmentFilter.value;
    const status = statusFilter.value;

    // Filter employees
    let filteredEmployees = employees.filter(emp => {
        const matchesSearch = !searchTerm || 
            emp.firstName.toLowerCase().includes(searchTerm) ||
            emp.lastName.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm) ||
            (emp.phone && emp.phone.toLowerCase().includes(searchTerm)) ||
            (emp.address && emp.address.toLowerCase().includes(searchTerm));
        
        const matchesDepartment = !department || emp.department === department;
        const matchesStatus = !status || emp.status === status;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Update employee count
    employeeCount.textContent = `${filteredEmployees.length} record${filteredEmployees.length !== 1 ? 's' : ''}`;

    // Show/hide empty state
    if (filteredEmployees.length === 0) {
        employeeTableBody.innerHTML = '';
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');
        employeeTableBody.innerHTML = filteredEmployees.map(emp => createEmployeeRow(emp)).join('');
    }
}

// Create employee table row
function createEmployeeRow(emp) {
    const statusClass = emp.status.toLowerCase().replace(' ', '-');
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
            <td>${emp.firstName}</td>
            <td>${emp.lastName}</td>
            <td>${emp.email || 'N/A'}</td>
            <td>${emp.phone || 'N/A'}</td>
            <td>${emp.address || 'N/A'}</td>
            <td><span class="status-badge status-${statusClass}">${emp.status}</span></td>
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
    modalTitle.textContent = employee ? 'Edit Customer' : 'Add Customer';
    
    if (employee) {
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email || '';
        document.getElementById('department').value = employee.department;
        document.getElementById('position').value = employee.position;
        document.getElementById('phone').value = employee.phone || '';
        document.getElementById('status').value = employee.status;
        document.getElementById('hireDate').value = employee.hireDate || '';
        document.getElementById('address').value = employee.address || '';
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
        employees = employees.filter(emp => emp.id !== employeeToDelete);
        renderEmployees();
        closeDeleteModal();
    }
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const employeeData = {
        id: employeeId ? parseInt(employeeId) : Math.max(...employees.map(e => e.id), 0) + 1,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        phone: document.getElementById('phone').value,
        status: document.getElementById('status').value,
        hireDate: document.getElementById('hireDate').value,
        address: document.getElementById('address').value
    };

    if (employeeId) {
        // Update existing employee
        const index = employees.findIndex(emp => emp.id === parseInt(employeeId));
        if (index !== -1) {
            employees[index] = employeeData;
        }
    } else {
        // Add new employee
        employees.push(employeeData);
    }

    renderEmployees();
    closeModal();
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}