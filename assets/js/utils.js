// Utility functions for the structure prediction tools

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        showNotification('Failed to copy', 'error');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function validateSequence(sequence) {
    const validChars = new Set('ACDEFGHIKLMNPQRSTVWY');
    return sequence.split('').every(char => validChars.has(char.toUpperCase()));
}

function formatFasta(name, sequence) {
    return `>${name}\n${sequence.match(/.{1,60}/g).join('\n')}`;
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Enhanced validation functions
function validateSequence(sequence) {
    if (!sequence || typeof sequence !== 'string') return false;
    
    // Remove whitespace and convert to uppercase
    const cleanSeq = sequence.replace(/\s/g, '').toUpperCase();
    
    // Check for valid amino acid characters only
    const validAminoAcids = /^[ACDEFGHIKLMNPQRSTVWY]+$/;
    return validAminoAcids.test(cleanSeq);
}

function validateRequiredField(value, fieldName) {
    if (!value || value.trim() === '') {
        showNotification(`${fieldName} is required`, 'error');
        return false;
    }
    return true;
}

function validateSequenceField(sequence, fieldName) {
    if (!sequence || sequence.trim() === '') {
        return true; // Optional fields can be empty
    }
    
    if (!validateSequence(sequence)) {
        showNotification(`${fieldName} contains invalid characters. Use only standard amino acid codes: ACDEFGHIKLMNPQRSTVWY`, 'error');
        return false;
    }
    
    if (sequence.replace(/\s/g, '').length < 10) {
        showNotification(`${fieldName} is too short. Protein sequences should be at least 10 amino acids long`, 'error');
        return false;
    }
    
    return true;
}

// Loading state management
function showLoadingState(buttonElement, message = 'Processing...') {
    if (!buttonElement) return;
    
    buttonElement.originalText = buttonElement.textContent;
    buttonElement.textContent = message;
    buttonElement.disabled = true;
    buttonElement.classList.add('loading');
}

function hideLoadingState(buttonElement) {
    if (!buttonElement) return;
    
    buttonElement.textContent = buttonElement.originalText || 'Generate';
    buttonElement.disabled = false;
    buttonElement.classList.remove('loading');
}

// Safe error handling wrapper
function safeExecute(fn, errorMessage = 'An error occurred') {
    try {
        return fn();
    } catch (error) {
        console.error('Error:', error);
        showNotification(errorMessage, 'error');
        return null;
    }
}
