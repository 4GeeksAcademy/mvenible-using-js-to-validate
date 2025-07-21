import "bootstrap";
import "./style.css";


import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";

// window.onload = function() {
//   //write your code here
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const errorAlert = document.querySelector('.error-alert');
    
    errorAlert.style.display = 'none';
    
    setupNumericInputs();
    
    setupTextInputs();
    
    form.addEventListener('submit', function(e) {
        
        e.preventDefault();
        
        const formData = getFormData();
        const validationErrors = validateForm(formData);
        
        if (validationErrors.length > 0) {
            showErrors(validationErrors);
            highlightInvalidFields(validationErrors);
        } else {
            hideErrors();
            clearFieldHighlights();
            console.log('Form is valid! Processing payment...', formData);
            alert('Payment processed successfully!');
        }
    });
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearFieldHighlight(this);
        });
    });
});

function getFormData() {
    return {
        cardNumber: document.getElementById('cardNumber').value.trim(),
        cvc: document.getElementById('cvc').value.trim(),
        amount: document.getElementById('amount').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value,
        postalCode: document.getElementById('postalCode').value.trim(),
        cardType: document.querySelector('input[name="cardType"]:checked'),
        message: document.getElementById('message').value.trim()
    };
}

function validateForm(data) {
    const errors = [];
    
    if (!data.cardNumber) {
        errors.push({ field: 'cardNumber', message: 'Card number is required' });
    } else if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
        errors.push({ field: 'cardNumber', message: 'Card number must be exactly 16 digits' });
    }
    
    if (!data.cvc) {
        errors.push({ field: 'cvc', message: 'CVC is required' });
    } else if (!/^\d{3,4}$/.test(data.cvc)) {
        errors.push({ field: 'cvc', message: 'CVC must be 3 or 4 digits' });
    }
    
    if (!data.amount) {
        errors.push({ field: 'amount', message: 'Amount is required' });
    } else if (isNaN(data.amount) || parseFloat(data.amount) <= 0) {
        errors.push({ field: 'amount', message: 'Amount must be a valid positive number' });
    }
    
    if (!data.firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
    } else if (data.firstName.length < 2) {
        errors.push({ field: 'firstName', message: 'First name must be at least 2 characters' });
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.firstName)) {
        errors.push({ field: 'firstName', message: 'First name can only contain letters, spaces, hyphens, and apostrophes' });
    }
    
    if (!data.lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
    } else if (data.lastName.length < 2) {
        errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters' });
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.lastName)) {
        errors.push({ field: 'lastName', message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' });
    }
    
    if (!data.city) {
        errors.push({ field: 'city', message: 'City is required' });
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.city)) {
        errors.push({ field: 'city', message: 'City can only contain letters, spaces, hyphens, and apostrophes' });
    }
    
    if (!data.state || data.state === 'Pick a state') {
        errors.push({ field: 'state', message: 'Please select a state' });
    }
    
    if (!data.postalCode) {
        errors.push({ field: 'postalCode', message: 'Postal code is required' });
    } else if (!/^\d{5}(-\d{4})?$/.test(data.postalCode)) {
        errors.push({ field: 'postalCode', message: 'Postal code must be in format 12345 or 12345-6789' });
    }
    
    if (!data.cardType) {
        errors.push({ field: 'cardType', message: 'Please select a card type' });
    }
    
    if (data.message && data.message.length > 500) {
        errors.push({ field: 'message', message: 'Message cannot exceed 500 characters' });
    }
    
    return errors;
}

function showErrors(errors) {
    const errorAlert = document.querySelector('.error-alert');
    
    if (errors.length === 1) {
        errorAlert.textContent = errors[0].message;
    } else {
        let errorMessage = 'Please fix the following errors: ';
        errors.forEach((error, index) => {
            errorMessage += error.message;
            if (index < errors.length - 1) {
                errorMessage += ', ';
            }
        });
        errorAlert.textContent = errorMessage;
    }
    
    errorAlert.style.display = 'block';
    
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideErrors() {
    const errorAlert = document.querySelector('.error-alert');
    errorAlert.style.display = 'none';
}

function highlightInvalidFields(errors) {
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (field) {
            field.style.backgroundColor = '#f8d7da';
            field.style.borderColor = '#dc3545';
        }
        
        if (error.field === 'cardType') {
            const cardTypeContainer = document.querySelector('.payment-icons');
            if (cardTypeContainer) {
                cardTypeContainer.style.backgroundColor = '#dc3545';
            }
        }
    });
}

function clearFieldHighlights() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        clearFieldHighlight(input);
    });
    
    const cardTypeContainer = document.querySelector('.payment-icons');
    if (cardTypeContainer) {
        cardTypeContainer.style.backgroundColor = '#6c757d';
    }
}

function clearFieldHighlight(field) {
    field.style.backgroundColor = '';
    field.style.borderColor = '';
}

function setupNumericInputs() {
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });
    
    cardNumberInput.addEventListener('keypress', function(e) {
        if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    const cvcInput = document.getElementById('cvc');
    cvcInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 4);
        e.target.value = value;
    });
    
    cvcInput.addEventListener('keypress', function(e) {
        if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    const amountInput = document.getElementById('amount');
    amountInput.addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/[^\d.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts.length === 2 && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        e.target.value = value;
    });
    
    amountInput.addEventListener('keypress', function(e) {
        if (!/[\d.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    const postalCodeInput = document.getElementById('postalCode');
    postalCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d-]/g, '');
        if (value.length > 5 && !value.includes('-')) {
            value = value.substring(0, 5) + '-' + value.substring(5, 9);
        }
        e.target.value = value;
    });
    
    postalCodeInput.addEventListener('keypress', function(e) {
        if (!/[\d-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
}

function setupTextInputs() {
    const firstNameInput = document.getElementById('firstName');
    firstNameInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
        e.target.value = value;
    });
    
    firstNameInput.addEventListener('keypress', function(e) {
        if (!/[a-zA-Z\s'-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    const lastNameInput = document.getElementById('lastName');
    lastNameInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
        e.target.value = value;
    });
    
    lastNameInput.addEventListener('keypress', function(e) {
        if (!/[a-zA-Z\s'-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    const cityInput = document.getElementById('city');
    cityInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
        e.target.value = value;
    });
    
    cityInput.addEventListener('keypress', function(e) {
        if (!/[a-zA-Z\s'-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
    });
}