document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('land-records-form');
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');
    const talukaSelect = document.getElementById('taluka');
    const villageSelect = document.getElementById('village');
    const surveyNumberInput = document.getElementById('survey-number');
    const khasraNumberInput = document.getElementById('khasra-number');
    const khataNumberInput = document.getElementById('khata-number');
    const recordTypeCheckboxes = document.querySelectorAll('input[name="recordType"]');

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

    // Handle record type selection
    recordTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Ensure at least one record type is selected
            const checkedBoxes = document.querySelectorAll('input[name="recordType"]:checked');
            if (checkedBoxes.length === 0) {
                this.checked = true;
            }
        });
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

        // Get selected record types
        const selectedRecords = Array.from(recordTypeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        data.recordTypes = selectedRecords;

        // Simulate API call
        console.log('Processing land records request:', data);
        
        // Show success message
        alert('Land records request submitted successfully! You will receive the records within 24 hours.');
        
        // Reset form
        form.reset();
    });
}); 