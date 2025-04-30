document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('property-tax-form');
    const propertyIdInput = document.getElementById('property-id');
    const assessmentYearSelect = document.getElementById('assessment-year');
    const taxAmountInput = document.getElementById('tax-amount');
    const penaltyInput = document.getElementById('penalty');
    const totalAmountInput = document.getElementById('total-amount');

    // Function to calculate tax and penalty
    function calculateTax() {
        if (propertyIdInput.value && assessmentYearSelect.value) {
            // Simulate tax calculation based on property ID and assessment year
            const baseTax = 5000; // This would come from an API in real implementation
            const currentYear = new Date().getFullYear();
            const selectedYear = parseInt(assessmentYearSelect.value);
            
            // Calculate penalty for late payment
            let penalty = 0;
            if (selectedYear < currentYear) {
                penalty = baseTax * 0.1; // 10% penalty for late payment
            }
            
            // Update form fields
            taxAmountInput.value = baseTax;
            penaltyInput.value = penalty;
            totalAmountInput.value = baseTax + penalty;
        } else {
            // Reset values if required fields are empty
            taxAmountInput.value = '';
            penaltyInput.value = '';
            totalAmountInput.value = '';
        }
    }

    // Add event listeners for tax calculation
    propertyIdInput.addEventListener('input', calculateTax);
    assessmentYearSelect.addEventListener('change', calculateTax);

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
        console.log('Processing property tax payment:', data);
        
        // Show success message
        alert('Property tax payment processed successfully! A receipt will be sent to your registered email.');
        
        // Reset form
        form.reset();
    });
}); 