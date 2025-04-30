document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('document-verification-form');
    const documentTypeSelect = document.getElementById('document-type');
    const otherDocumentGroup = document.getElementById('other-document-group');
    const verificationPurposeSelect = document.getElementById('verification-purpose');
    const otherPurposeGroup = document.getElementById('other-purpose-group');
    const documentFileInput = document.getElementById('document-file');
    const aadhaarInput = document.getElementById('applicant-aadhaar');
    const phoneInput = document.getElementById('applicant-phone');

    // Handle document type selection
    documentTypeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherDocumentGroup.style.display = 'block';
        } else {
            otherDocumentGroup.style.display = 'none';
        }
    });

    // Handle verification purpose selection
    verificationPurposeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherPurposeGroup.style.display = 'block';
        } else {
            otherPurposeGroup.style.display = 'none';
        }
    });

    // File upload validation
    documentFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should not exceed 5MB');
                this.value = '';
                return;
            }

            // Check file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid file type (PDF, JPG, JPEG, or PNG)');
                this.value = '';
                return;
            }
        }
    });

    // Aadhaar number validation
    aadhaarInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 12) {
            this.value = this.value.slice(0, 12);
        }
    });

    // Phone number validation
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Simulate API call
        console.log('Submitting document verification request:', data);
        
        // Show success message
        alert('Document verification request submitted successfully! You will receive a verification report within 24 hours.');
        
        // Reset form
        form.reset();
    });
}); 