// Translation data
const translations = {
  en: {
    // Header
    'site-title': 'EstateLink',
    'site-subtitle': 'Property Registration Portal',
    'site-tagline': 'Your One-Stop Solution for Property Registration',
    'login': 'Login',
    'register': 'Register',
    'home': 'Home',
    'services': 'Services',
    'about': 'About',
    'contact': 'Contact',
    'dashboard': 'Dashboard',
    'logout': 'Logout',
    
    // Services
    'encumbrance-certificate': 'Encumbrance Certificate',
    'encumbrance-certificate-desc': 'Get a certificate showing all registered transactions for a property',
    'property-valuation': 'Property Valuation',
    'property-valuation-desc': 'Get an official valuation of your property',
    'land-records': 'Land Records',
    'land-records-desc': 'Access and verify land ownership records',
    'document-verification': 'Document Verification',
    'document-verification-desc': 'Verify the authenticity of property documents',
    'property-tax': 'Property Tax',
    'property-tax-desc': 'Pay and manage your property tax online',
    
    // Buttons
    'apply-now': 'Apply Now',
    'get-valuation': 'Get Valuation',
    'view-records': 'View Records',
    'verify-now': 'Verify Now',
    'pay-tax': 'Pay Tax',
    
    // Footer
    'footer-about': 'About EstateLink',
    'footer-about-desc': 'EstateLink is a comprehensive property registration portal that simplifies the process of property registration and related services.',
    'quick-links': 'Quick Links',
    'contact-us': 'Contact Us',
    'support': 'Support',
    'privacy-policy': 'Privacy Policy',
    'terms-conditions': 'Terms & Conditions',
    'copyright': '© 2024 EstateLink. All rights reserved.'
  },
  mr: {
    // Header
    'site-title': 'एस्टेटलिंक',
    'site-subtitle': 'मालमत्ता नोंदणी पोर्टल',
    'site-tagline': 'मालमत्ता नोंदणीसाठी तुमचे एक-स्टॉप सोल्यूशन',
    'login': 'लॉगिन',
    'register': 'नोंदणी करा',
    'home': 'मुख्यपृष्ठ',
    'services': 'सेवा',
    'about': 'आमच्याबद्दल',
    'contact': 'संपर्क',
    'dashboard': 'डॅशबोर्ड',
    'logout': 'लॉगआउट',
    
    // Services
    'encumbrance-certificate': 'एन्कम्ब्रन्स प्रमाणपत्र',
    'encumbrance-certificate-desc': 'मालमत्तेसाठी सर्व नोंदणीकृत व्यवहार दर्शविणारे प्रमाणपत्र मिळवा',
    'property-valuation': 'मालमत्ता मूल्यांकन',
    'property-valuation-desc': 'तुमच्या मालमत्तेचे अधिकृत मूल्यांकन मिळवा',
    'land-records': 'जमीन नोंदी',
    'land-records-desc': 'जमीन मालकी नोंदी पहा आणि सत्यापित करा',
    'document-verification': 'कागदपत्र सत्यापन',
    'document-verification-desc': 'मालमत्ता कागदपत्रांची प्रामाणिकता सत्यापित करा',
    'property-tax': 'मालमत्ता कर',
    'property-tax-desc': 'तुमचा मालमत्ता कर ऑनलाइन भरा आणि व्यवस्थापित करा',
    
    // Buttons
    'apply-now': 'आता अर्ज करा',
    'get-valuation': 'मूल्यांकन मिळवा',
    'view-records': 'नोंदी पहा',
    'verify-now': 'आता सत्यापित करा',
    'pay-tax': 'कर भरा',
    
    // Footer
    'footer-about': 'एस्टेटलिंक बद्दल',
    'footer-about-desc': 'एस्टेटलिंक हे एक व्यापक मालमत्ता नोंदणी पोर्टल आहे जे मालमत्ता नोंदणी आणि संबंधित सेवांची प्रक्रिया सुलभ करते.',
    'quick-links': 'द्रुत दुवे',
    'contact-us': 'आमच्याशी संपर्क साधा',
    'support': 'आधार',
    'privacy-policy': 'गोपनीयता धोरण',
    'terms-conditions': 'अटी आणि नियम',
    'copyright': '© २०२४ एस्टेटलिंक. सर्व हक्क राखीव.'
  }
};

// Function to update translations
function updateTranslations(language) {
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[language] && translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });
}

// Event listener for language change
document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      updateTranslations(e.target.value);
    });
  }
}); 