const greetings = [
    "नमस्ते (Hindi)",
    "নমস্তে (Bengali)",
    "नमस्कार (Marathi)",
    "నమస్తే (Telugu)",
    "வணக்கம் (Tamil)",
    "નમસ્તે (Gujarati)",
    "ನಮಸ್ಕಾರ (Kannada)",
    "നമസ്കാരം (Malayalam)",
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Punjabi)",
    "سلام (Urdu)",
    "Namaste (English)"
];

document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting');
    
    if (!greetingElement) {
        console.error('Greeting element not found!');
        return;
    }

    let currentIndex = 0;

    function updateGreeting() {
        // Add fade-out animation
        greetingElement.style.animation = 'none';
        greetingElement.offsetHeight; // Trigger reflow
        greetingElement.style.animation = 'fadeOut 0.5s ease forwards';
        
        // Wait for fade-out to complete before changing text
        setTimeout(() => {
            greetingElement.textContent = greetings[currentIndex];
            // Reset animation and add fade-in
            greetingElement.style.animation = 'none';
            greetingElement.offsetHeight; // Trigger reflow
            greetingElement.style.animation = 'fadeIn 0.5s ease forwards';
            
            // Move to next greeting
            currentIndex = (currentIndex + 1) % greetings.length;
        }, 500);
    }

    // Initial greeting
    updateGreeting();

    // Update greeting every 2 seconds
    setInterval(updateGreeting, 2000);
}); 