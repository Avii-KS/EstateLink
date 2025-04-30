document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('property-valuation-form');
    const propertyTypeSelect = document.getElementById('property-type');
    const propertyAreaInput = document.getElementById('property-area');
    const locationSelect = document.getElementById('location');
    const ageInput = document.getElementById('property-age');
    const valuationResult = document.getElementById('valuation-result');
    const estimatedValue = document.getElementById('estimated-value');

    // Sample data for property valuation
    const valuationData = {
        'residential': {
            'urban': {
                baseRate: 5000,
                ageFactor: 0.02
            },
            'suburban': {
                baseRate: 3000,
                ageFactor: 0.015
            },
            'rural': {
                baseRate: 1500,
                ageFactor: 0.01
            }
        },
        'commercial': {
            'urban': {
                baseRate: 8000,
                ageFactor: 0.015
            },
            'suburban': {
                baseRate: 5000,
                ageFactor: 0.01
            },
            'rural': {
                baseRate: 2500,
                ageFactor: 0.008
            }
        },
        'industrial': {
            'urban': {
                baseRate: 6000,
                ageFactor: 0.02
            },
            'suburban': {
                baseRate: 4000,
                ageFactor: 0.015
            },
            'rural': {
                baseRate: 2000,
                ageFactor: 0.01
            }
        }
    };

    // Function to calculate property value
    function calculateValue() {
        const propertyType = propertyTypeSelect.value;
        const location = locationSelect.value;
        const area = parseFloat(propertyAreaInput.value) || 0;
        const age = parseInt(ageInput.value) || 0;

        if (propertyType && location && area > 0) {
            const baseRate = valuationData[propertyType][location].baseRate;
            const ageFactor = valuationData[propertyType][location].ageFactor;
            
            // Calculate depreciation based on age
            const depreciation = 1 - (age * ageFactor);
            const finalDepreciation = Math.max(depreciation, 0.5); // Minimum 50% value
            
            // Calculate final value
            const value = baseRate * area * finalDepreciation;
            
            // Update UI
            valuationResult.style.display = 'block';
            estimatedValue.textContent = `₹${value.toLocaleString('en-IN')}`;
        } else {
            valuationResult.style.display = 'none';
        }
    }

    // Add event listeners for real-time calculation
    propertyTypeSelect.addEventListener('change', calculateValue);
    locationSelect.addEventListener('change', calculateValue);
    propertyAreaInput.addEventListener('input', calculateValue);
    ageInput.addEventListener('input', calculateValue);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Add calculated value to form data
        data.estimatedValue = estimatedValue.textContent.replace(/[^0-9]/g, '');

        // Simulate API call
        console.log('Processing property valuation request:', data);
        
        // Show success message
        alert('Property valuation request submitted successfully! A detailed report will be sent to your email.');
        
        // Reset form
        form.reset();
        valuationResult.style.display = 'none';
    });
}); 