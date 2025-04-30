document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('encumbrance-form');
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');
    const talukaSelect = document.getElementById('taluka');
    const villageSelect = document.getElementById('village');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const documentFileInput = document.getElementById('document-file');

    // Sample data for cascading dropdowns
    const locationData = {
        'ANDHRA PRADESH': {
            districts: ['Visakhapatnam', 'Vijayawada', 'Guntur'],
            talukas: {
                'Visakhapatnam': ['Anakapalle', 'Bheemunipatnam', 'Visakhapatnam'],
                'Vijayawada': ['Gannavaram', 'Mylavaram', 'Vijayawada'],
                'Guntur': ['Guntur', 'Tenali', 'Mangalagiri']
            }
        },
        'TAMIL NADU': {
            districts: ['Chennai', 'Coimbatore', 'Madurai'],
            talukas: {
                'Chennai': ['Tondiarpet', 'Egmore', 'Mylapore'],
                'Coimbatore': ['Coimbatore North', 'Coimbatore South', 'Sulur'],
                'Madurai': ['Madurai North', 'Madurai South', 'Melur']
            }
        }
    };

    // Handle state selection
    stateSelect.addEventListener('change', function() {
        const state = this.value;
        districtSelect.innerHTML = '<option value="">Select District</option>';
        talukaSelect.innerHTML = '<option value="">Select Taluka</option>';
        villageSelect.innerHTML = '<option value="">Select Village</option>';
        
        if (state && locationData[state]) {
            districtSelect.disabled = false;
            locationData[state].districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } else {
            districtSelect.disabled = true;
            talukaSelect.disabled = true;
            villageSelect.disabled = true;
        }
    });

    // Handle district selection
    districtSelect.addEventListener('change', function() {
        const state = stateSelect.value;
        const district = this.value;
        talukaSelect.innerHTML = '<option value="">Select Taluka</option>';
        villageSelect.innerHTML = '<option value="">Select Village</option>';
        
        if (state && district && locationData[state].talukas[district]) {
            talukaSelect.disabled = false;
            locationData[state].talukas[district].forEach(taluka => {
                const option = document.createElement('option');
                option.value = taluka;
                option.textContent = taluka;
                talukaSelect.appendChild(option);
            });
        } else {
            talukaSelect.disabled = true;
            villageSelect.disabled = true;
        }
    });

    // Handle taluka selection
    talukaSelect.addEventListener('change', function() {
        villageSelect.innerHTML = '<option value="">Select Village</option>';
        if (this.value) {
            villageSelect.disabled = false;
            // Add sample villages
            const villages = ['Village 1', 'Village 2', 'Village 3'];
            villages.forEach(village => {
                const option = document.createElement('option');
                option.value = village;
                option.textContent = village;
                villageSelect.appendChild(option);
            });
        } else {
            villageSelect.disabled = true;
        }
    });

    // Date validation
    endDateInput.addEventListener('change', function() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(this.value);
        
        if (endDate < startDate) {
            alert('End date cannot be before start date');
            this.value = '';
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
        console.log('Processing encumbrance certificate request:', data);
        
        // Show success message
        alert('Encumbrance certificate request submitted successfully! You will receive the certificate within 24 hours.');
        
        // Reset form
        form.reset();
    });
}); 