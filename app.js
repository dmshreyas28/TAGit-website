// TAGit! NFC Tag Information System - JavaScript Application

// Application data structure
let appData = {
  userProfile: {
    name: "Murty Venugopalan Iyer",
    age: 47,
    emergencyEmail: "murtyiver45@example.com",
    phoneNo: "+91 9876324122",
    dateOfBirth: "10/02/1977",
    languagesSpoken: "English, Hindi, Malayalam",
    fatherName: "Mr. Venugopalan Iyer",
    fatherContact: "+91 9876444563",
    allergies: "Gluten-Free, Pollen, Dust",
    bloodGroup: "O+"
  },
  medicalReports: [
    {name: "Blood Group Analysis", type: "report", action: "View"},
    {name: "Physical Examination", type: "report", action: "View"},
    {name: "Medical Tests", type: "report", action: "View"},
    {name: "Medical History", type: "report", action: "View"}
  ],
  identificationDocs: [
    {name: "Driver's License", action: "Edit"},
    {name: "Passport Copy", action: "Edit"},
    {name: "Residence Permit Copy", action: "Edit"}
  ],
  upcomingAppointments: [
    {
      id: 1,
      date: "15",
      month: "APR",
      doctor: "Dr. Rajesh Kumar",
      type: "Cardiology Consultation",
      time: "10:30 AM",
      status: "scheduled"
    },
    {
      id: 2,
      date: "20",
      month: "APR",
      doctor: "Dr. Priya Sharma", 
      type: "Dental Checkup",
      time: "12:00 PM",
      status: "scheduled"
    }
  ],
  pastAppointments: [
    {
      id: 3,
      date: "05",
      month: "APR",
      doctor: "Dr. Anit Patel",
      type: "General Checkup",
      status: "Completed"
    }
  ],
  doctors: [
    {name: "Dr. Rajesh Kumar", department: "Cardiology"},
    {name: "Dr. Priya Sharma", department: "Dentistry"},
    {name: "Dr. Anit Patel", department: "General Medicine"},
    {name: "Dr. Sarah Johnson", department: "Cardiology"},
    {name: "Dr. Michael Brown", department: "Orthopedics"}
  ],
  departments: ["Cardiology", "Dentistry", "General Medicine", "Orthopedics", "Neurology"],
  walletBalance: 25000,
  transactions: [
    {
      id: 1,
      type: "Payment to Apollo Hospital",
      amount: -5000,
      date: "Today, 2:30 PM"
    },
    {
      id: 2,
      type: "Added Money",
      amount: 10000,
      date: "Yesterday, 4:15 PM"
    }
  ],
  nfcSettings: {
    isActive: true,
    shareSettings: {
      medicalHistory: true,
      emergencyContacts: true,
      insuranceDetails: true
    }
  }
};

// Application state
let currentTab = 'home';
let isEditingPersonalInfo = false;
let nextAppointmentId = 4;
let nextTransactionId = 3;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  loadDataFromLocalStorage();
  initializeApp();
  setupEventListeners();
});

// Load data from localStorage
function loadDataFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('tagitAppData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      appData = { ...appData, ...parsedData };
      console.log('Data loaded from localStorage');
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
}

// Save data to localStorage
function saveDataToLocalStorage() {
  try {
    localStorage.setItem('tagitAppData', JSON.stringify(appData));
    console.log('Data saved to localStorage');
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

// Helper functions for nested object access
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => current[key], obj);
  if (target) {
    target[lastKey] = value;
  }
}

// Initialize application
function initializeApp() {
  console.log('Initializing app components...');
  renderPersonalInfo();
  renderMedicalReports();
  renderIdentificationDocs();
  renderAppointments();
  renderWallet();
  populateDropdowns();
  setMinDate();
  
  // Initialize toggles after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeToggles();
  }, 100);
  
  console.log('App initialization complete');
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Tab navigation - Fixed implementation
  const tabButtons = document.querySelectorAll('.tab-btn');
  console.log('Found tab buttons:', tabButtons.length);
  
  tabButtons.forEach((btn, index) => {
    console.log(`Setting up tab button ${index}:`, btn.getAttribute('data-tab'));
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const tabName = this.getAttribute('data-tab');
      console.log('Tab clicked:', tabName);
      switchTab(tabName);
    });
  });

  // Personal info editing
  const editBtn = document.getElementById('editPersonalInfo');
  if (editBtn) {
    editBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Edit button clicked');
      togglePersonalInfoEdit();
    });
  }

  const cancelBtn = document.getElementById('cancelEdit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Cancel button clicked');
      cancelPersonalInfoEdit();
    });
  }

  const personalInfoForm = document.getElementById('personalInfoForm');
  if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Personal info form submitted');
      savePersonalInfo(e);
    });
  }

  // Appointment booking
  const bookingForm = document.getElementById('bookAppointmentForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Appointment form submitted');
      bookAppointment(e);
    });
  }

  const deptSelect = document.getElementById('departmentSelect');
  if (deptSelect) {
    deptSelect.addEventListener('change', updateDoctorOptions);
  }

  // Wallet functionality
  const addMoneyBtn = document.getElementById('addMoneyBtn');
  if (addMoneyBtn) {
    addMoneyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Add money button clicked');
      openWalletModal('add');
    });
  }

  const withdrawBtn = document.getElementById('withdrawBtn');
  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Withdraw button clicked');
      openWalletModal('withdraw');
    });
  }

  const walletConfirmBtn = document.getElementById('walletModalConfirm');
  if (walletConfirmBtn) {
    walletConfirmBtn.addEventListener('click', function(e) {
      e.preventDefault();
      processWalletTransaction();
    });
  }

  // Modal functionality
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModals();
    });
  });

  const modalCancel = document.getElementById('modalCancel');
  if (modalCancel) {
    modalCancel.addEventListener('click', function(e) {
      e.preventDefault();
      closeModals();
    });
  }

  const walletCancel = document.getElementById('walletModalCancel');
  if (walletCancel) {
    walletCancel.addEventListener('click', function(e) {
      e.preventDefault();
      closeModals();
    });
  }

  // Click outside modal to close
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModals();
      }
    });
  });

  console.log('Event listeners setup complete');
}

// Tab switching functionality - Fixed implementation
function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  if (!tabName) {
    console.error('No tab name provided');
    return;
  }
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTabBtn) {
    activeTabBtn.classList.add('active');
    console.log('Tab button activated:', tabName);
  } else {
    console.error('Tab button not found for:', tabName);
  }

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  
  const activeTabContent = document.getElementById(tabName);
  if (activeTabContent) {
    activeTabContent.classList.add('active');
    activeTabContent.style.display = 'block';
    console.log('Tab content activated:', tabName);
    
    // Initialize toggles when switching to NFC Settings tab
    if (tabName === 'nfc-settings') {
      console.log('Initializing toggles for NFC Settings tab');
      setTimeout(() => {
        initializeToggles();
      }, 100);
    }
  } else {
    console.error('Tab content not found for:', tabName);
  }

  currentTab = tabName;
  console.log('Current tab set to:', currentTab);
}

// Initialize toggle switches with proper functionality
function initializeToggles() {
  console.log('Initializing toggle switches...');
  
  const toggles = {
    'medicalHistoryToggle': 'shareSettings.medicalHistory',
    'emergencyContactsToggle': 'shareSettings.emergencyContacts',
    'insuranceDetailsToggle': 'shareSettings.insuranceDetails'
  };
  
  Object.entries(toggles).forEach(([toggleId, dataPath]) => {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
      console.log(`Setting up toggle: ${toggleId}`);
      
      // Remove any existing event listeners by cloning the element
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      // Set initial state from data
      const currentValue = getNestedValue(appData.nfcSettings, dataPath);
      newToggle.checked = currentValue;
      console.log(`${toggleId} initial state: ${currentValue}`);
      
      // Add event listener for changes
      newToggle.addEventListener('change', function() {
        console.log(`Toggle ${toggleId} changed to: ${this.checked}`);
        
        // Update the data
        setNestedValue(appData.nfcSettings, dataPath, this.checked);
        
        // Save to localStorage
        saveDataToLocalStorage();
        
        // Show feedback
        const settingName = dataPath.split('.')[1];
        const friendlyName = settingName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        showToast(`${friendlyName} sharing ${this.checked ? 'enabled' : 'disabled'}`, 'success');
      });
      
      console.log(`Toggle ${toggleId} initialized successfully`);
    } else {
      console.error(`Toggle element not found: ${toggleId}`);
    }
  });
  
  console.log('Toggle switches initialization complete');
}

// Personal Information Management
function renderPersonalInfo() {
  const profile = appData.userProfile;
  
  // Update user name in header
  const userName = document.getElementById('userName');
  if (userName) {
    userName.textContent = profile.name;
  }

  // Update form fields
  const fieldMappings = {
    'age': profile.age,
    'emergencyEmail': profile.emergencyEmail,
    'phoneNo': profile.phoneNo,
    'dateOfBirth': profile.dateOfBirth,
    'languagesSpoken': profile.languagesSpoken,
    'fatherName': profile.fatherName,
    'fatherContact': profile.fatherContact,
    'allergies': profile.allergies,
    'bloodGroup': profile.bloodGroup
  };

  Object.keys(fieldMappings).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = fieldMappings[fieldId];
    }
  });
}

function togglePersonalInfoEdit() {
  isEditingPersonalInfo = !isEditingPersonalInfo;
  const form = document.getElementById('personalInfoForm');
  const inputs = form.querySelectorAll('.form-control');
  const editBtn = document.getElementById('editPersonalInfo');
  const formActions = document.querySelector('.form-actions');

  console.log('Toggling edit mode:', isEditingPersonalInfo);

  if (isEditingPersonalInfo) {
    inputs.forEach(input => {
      input.removeAttribute('readonly');
      input.style.backgroundColor = 'var(--color-surface)';
    });
    editBtn.textContent = 'Cancel';
    editBtn.classList.remove('btn--outline');
    editBtn.classList.add('btn--secondary');
    if (formActions) {
      formActions.classList.remove('hidden');
    }
  } else {
    inputs.forEach(input => {
      input.setAttribute('readonly', true);
      input.style.backgroundColor = 'var(--color-bg-1)';
    });
    editBtn.textContent = 'Edit';
    editBtn.classList.remove('btn--secondary');
    editBtn.classList.add('btn--outline');
    if (formActions) {
      formActions.classList.add('hidden');
    }
    renderPersonalInfo(); // Reset form
  }
}

function cancelPersonalInfoEdit() {
  if (isEditingPersonalInfo) {
    togglePersonalInfoEdit();
  }
}

function savePersonalInfo(e) {
  e.preventDefault();
  console.log('Saving personal info...');
  
  // Update appData with form values
  appData.userProfile = {
    ...appData.userProfile,
    age: parseInt(document.getElementById('age').value) || appData.userProfile.age,
    emergencyEmail: document.getElementById('emergencyEmail').value,
    phoneNo: document.getElementById('phoneNo').value,
    dateOfBirth: document.getElementById('dateOfBirth').value,
    languagesSpoken: document.getElementById('languagesSpoken').value,
    fatherName: document.getElementById('fatherName').value,
    fatherContact: document.getElementById('fatherContact').value,
    allergies: document.getElementById('allergies').value,
    bloodGroup: document.getElementById('bloodGroup').value
  };

  saveDataToLocalStorage();
  togglePersonalInfoEdit();
  showToast('Personal information updated successfully!', 'success');
}

// Medical Reports Management
function renderMedicalReports() {
  const container = document.getElementById('medicalReportsList');
  if (!container) return;
  
  container.innerHTML = '';

  appData.medicalReports.forEach((report, index) => {
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    reportItem.innerHTML = `
      <span>${report.name}</span>
      <button class="btn btn--sm btn--primary" onclick="viewReport('${report.name}')">
        ${report.action}
      </button>
    `;
    container.appendChild(reportItem);
  });
}

function viewReport(reportName) {
  showModal('View Report', `Viewing ${reportName}. This would open the medical report in a new window or viewer.`);
}

// Identification Documents Management
function renderIdentificationDocs() {
  const container = document.getElementById('identificationDocsList');
  if (!container) return;
  
  container.innerHTML = '';

  appData.identificationDocs.forEach(doc => {
    const docItem = document.createElement('div');
    docItem.className = 'document-item';
    docItem.innerHTML = `
      <span>${doc.name}</span>
      <button class="btn btn--sm btn--outline" onclick="editDocument('${doc.name}')">
        ${doc.action}
      </button>
    `;
    container.appendChild(docItem);
  });
}

function editDocument(docName) {
  showModal('Edit Document', `Editing ${docName}. This would open a document editor or upload interface.`);
}

// Appointments Management
function renderAppointments() {
  renderUpcomingAppointments();
  renderPastAppointments();
}

function renderUpcomingAppointments() {
  const container = document.getElementById('upcomingAppointmentsList');
  if (!container) return;
  
  container.innerHTML = '';

  if (appData.upcomingAppointments.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: var(--color-text-secondary);">No upcoming appointments</p>';
    return;
  }

  appData.upcomingAppointments.forEach(appointment => {
    const appointmentItem = document.createElement('div');
    appointmentItem.className = 'appointment-item';
    appointmentItem.innerHTML = `
      <div class="appointment-date">
        <div class="date">${appointment.date}</div>
        <div class="month">${appointment.month}</div>
      </div>
      <div class="appointment-details">
        <h4>${appointment.doctor}</h4>
        <p>${appointment.type}</p>
        <p><strong>${appointment.time}</strong></p>
      </div>
      <div class="appointment-actions">
        <button class="btn btn--sm btn--outline" onclick="rescheduleAppointment(${appointment.id})">
          Reschedule
        </button>
        <button class="btn btn--sm btn--outline" style="color: var(--color-error); border-color: var(--color-error);" onclick="cancelAppointment(${appointment.id})">
          Cancel
        </button>
      </div>
    `;
    container.appendChild(appointmentItem);
  });
}

function renderPastAppointments() {
  const container = document.getElementById('pastAppointmentsList');
  if (!container) return;
  
  container.innerHTML = '';

  if (appData.pastAppointments.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: var(--color-text-secondary);">No past appointments</p>';
    return;
  }

  appData.pastAppointments.forEach(appointment => {
    const appointmentItem = document.createElement('div');
    appointmentItem.className = 'appointment-item';
    appointmentItem.innerHTML = `
      <div class="appointment-date">
        <div class="date">${appointment.date}</div>
        <div class="month">${appointment.month}</div>
      </div>
      <div class="appointment-details">
        <h4>${appointment.doctor}</h4>
        <p>${appointment.type}</p>
        <p><span class="status status--success">${appointment.status}</span></p>
      </div>
      <div class="appointment-actions">
        <button class="btn btn--sm btn--primary" onclick="viewReport('${appointment.doctor} - ${appointment.type}')">
          View Report
        </button>
      </div>
    `;
    container.appendChild(appointmentItem);
  });
}

function populateDropdowns() {
  // Populate departments
  const departmentSelect = document.getElementById('departmentSelect');
  if (!departmentSelect) return;
  
  departmentSelect.innerHTML = '<option value="">Choose Department</option>';
  appData.departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept;
    option.textContent = dept;
    departmentSelect.appendChild(option);
  });
}

function updateDoctorOptions() {
  const selectedDept = document.getElementById('departmentSelect').value;
  const doctorSelect = document.getElementById('doctorSelect');
  
  if (!doctorSelect) return;
  
  doctorSelect.innerHTML = '<option value="">Choose Doctor</option>';
  
  if (selectedDept) {
    const filteredDoctors = appData.doctors.filter(doctor => doctor.department === selectedDept);
    filteredDoctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.name;
      option.textContent = doctor.name;
      doctorSelect.appendChild(option);
    });
  }
}

function setMinDate() {
  const appointmentDate = document.getElementById('appointmentDate');
  if (!appointmentDate) return;
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  appointmentDate.min = tomorrow.toISOString().split('T')[0];
}

function bookAppointment(e) {
  e.preventDefault();
  
  const department = document.getElementById('departmentSelect').value;
  const doctor = document.getElementById('doctorSelect').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;

  if (!department || !doctor || !date || !time) {
    showToast('Please fill all fields to book an appointment.', 'error');
    return;
  }

  // Create appointment object
  const appointmentDate = new Date(date);
  const newAppointment = {
    id: nextAppointmentId++,
    date: appointmentDate.getDate().toString(),
    month: appointmentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    doctor: doctor,
    type: `${department} Consultation`,
    time: time,
    status: 'scheduled'
  };

  appData.upcomingAppointments.push(newAppointment);
  saveDataToLocalStorage();
  renderUpcomingAppointments();
  
  // Reset form
  document.getElementById('bookAppointmentForm').reset();
  showToast('Appointment booked successfully!', 'success');
}

function rescheduleAppointment(appointmentId) {
  showModal('Reschedule Appointment', 'Rescheduling functionality would be implemented here. This would open a form to select new date and time.');
}

function cancelAppointment(appointmentId) {
  showConfirmModal(
    'Cancel Appointment', 
    'Are you sure you want to cancel this appointment?',
    () => {
      appData.upcomingAppointments = appData.upcomingAppointments.filter(apt => apt.id !== appointmentId);
      saveDataToLocalStorage();
      renderUpcomingAppointments();
      showToast('Appointment cancelled successfully.', 'success');
    }
  );
}

// Wallet Management
function renderWallet() {
  const balanceElement = document.getElementById('walletBalance');
  if (balanceElement) {
    balanceElement.textContent = formatCurrency(appData.walletBalance);
  }
  renderTransactions();
}

function renderTransactions() {
  const container = document.getElementById('transactionsList');
  if (!container) return;
  
  container.innerHTML = '';

  if (appData.transactions.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: var(--color-text-secondary);">No transactions yet</p>';
    return;
  }

  appData.transactions.forEach(transaction => {
    const transactionItem = document.createElement('div');
    transactionItem.className = 'transaction-item';
    transactionItem.innerHTML = `
      <div class="transaction-details">
        <h4>${transaction.type}</h4>
        <p>${transaction.date}</p>
      </div>
      <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
        ${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
      </div>
    `;
    container.appendChild(transactionItem);
  });
}

function openWalletModal(type) {
  const modal = document.getElementById('walletModal');
  const title = document.getElementById('walletModalTitle');
  const amountInput = document.getElementById('walletAmount');
  
  if (!modal || !title || !amountInput) return;
  
  title.textContent = type === 'add' ? 'Add Money' : 'Withdraw Money';
  amountInput.value = '';
  amountInput.dataset.type = type;
  
  if (type === 'withdraw') {
    amountInput.max = appData.walletBalance;
  } else {
    amountInput.removeAttribute('max');
  }
  
  modal.classList.remove('hidden');
}

function processWalletTransaction() {
  const amountInput = document.getElementById('walletAmount');
  if (!amountInput) return;
  
  const amount = parseInt(amountInput.value);
  const type = amountInput.dataset.type;
  
  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount.', 'error');
    return;
  }
  
  if (type === 'withdraw' && amount > appData.walletBalance) {
    showToast('Insufficient balance.', 'error');
    return;
  }
  
  // Create transaction
  const transaction = {
    id: nextTransactionId++,
    type: type === 'add' ? 'Added Money' : 'Money Withdrawn',
    amount: type === 'add' ? amount : -amount,
    date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  };
  
  // Update balance
  appData.walletBalance += type === 'add' ? amount : -amount;
  appData.transactions.unshift(transaction);
  
  saveDataToLocalStorage();
  renderWallet();
  closeModals();
  showToast(`₹${amount.toLocaleString()} ${type === 'add' ? 'added to' : 'withdrawn from'} your wallet.`, 'success');
}

// Toast notification system
function showToast(message, type = 'info') {
  console.log(`Showing toast: ${message} (${type})`);
  
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastMessage) {
    console.error('Toast elements not found');
    return;
  }
  
  // Set message and type
  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  
  // Show toast
  toast.classList.remove('hidden');
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Modal Management
function showModal(title, message) {
  const modal = document.getElementById('confirmModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const confirmBtn = document.getElementById('modalConfirm');
  
  if (!modal || !modalTitle || !modalMessage) return;
  
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  if (confirmBtn) {
    confirmBtn.style.display = 'none';
  }
  modal.classList.remove('hidden');
}

function showConfirmModal(title, message, callback) {
  const modal = document.getElementById('confirmModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const confirmBtn = document.getElementById('modalConfirm');
  
  if (!modal || !modalTitle || !modalMessage || !confirmBtn) return;
  
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmBtn.style.display = 'block';
  confirmBtn.onclick = () => {
    callback();
    closeModals();
  };
  
  modal.classList.remove('hidden');
}

function closeModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

// Utility Functions
function formatCurrency(amount) {
  return amount.toLocaleString();
}

// Make functions globally available for onclick handlers
window.viewReport = viewReport;
window.editDocument = editDocument;
window.rescheduleAppointment = rescheduleAppointment;
window.cancelAppointment = cancelAppointment;