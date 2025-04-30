// Language translation service
const translations = {
  en: {
    // English translations (default)
    'site-title': 'BhumiSetu',
    'site-subtitle': 'Government of India',
    'site-tagline': 'Unified Property Management System',
    'login': 'Login',
    'register': 'Register',
    'home': 'Home',
    'property-search': 'Property Search',
    'encumbrances': 'Encumbrances',
    'documents': 'Documents',
    'services': 'Services',
    'about': 'About',
    'contact': 'Contact',
    'property-details': 'Property Details',
    'property-type': 'Property Type',
    'property-area': 'Property Area',
    'location': 'Location',
    'submit': 'Submit',
    'reset': 'Reset',
    'select-language': 'Select Language',
    'help': 'Need Help?',
    'support': '24/7 Support',
    'live-chat': 'Live Chat',
    'email-support': 'Email Support',
    'call-now': 'Call Now',
    'start-chat': 'Start Chat',
    'email-us': 'Email Us',
    'information': 'Information',
    'help-support': 'Help & Support',
    'legal': 'Legal',
    'connect-with-us': 'Connect with Us',
    'copyright': '© 2025 Government of India. All Rights Reserved.',
    'last-updated': 'Last Updated:',
    'site-visitors': 'Site Visitors:',
    'footer-about': 'About BhumiSetu',
    'footer-about-desc': 'BhumiSetu is a comprehensive property registration portal that simplifies the process of property registration and related services.'
  },
  hi: {
    // Hindi translations
    'site-title': 'भूमिसेतु',
    'site-subtitle': 'भारत सरकार',
    'site-tagline': 'एकीकृत संपत्ति प्रबंधन प्रणाली',
    'login': 'लॉग इन',
    'register': 'पंजीकरण',
    'home': 'होम',
    'property-search': 'संपत्ति खोज',
    'encumbrances': 'बाधाएं',
    'documents': 'दस्तावेज़',
    'services': 'सेवाएं',
    'about': 'हमारे बारे में',
    'contact': 'संपर्क करें',
    'property-details': 'संपत्ति विवरण',
    'property-type': 'संपत्ति का प्रकार',
    'property-area': 'संपत्ति का क्षेत्रफल',
    'location': 'स्थान',
    'submit': 'जमा करें',
    'reset': 'रीसेट करें',
    'select-language': 'भाषा चुनें',
    'help': 'सहायता चाहिए?',
    'support': '24/7 सहायता',
    'live-chat': 'लाइव चैट',
    'email-support': 'ईमेल सहायता',
    'call-now': 'अभी कॉल करें',
    'start-chat': 'चैट शुरू करें',
    'email-us': 'हमें ईमेल करें',
    'information': 'जानकारी',
    'help-support': 'सहायता और समर्थन',
    'legal': 'कानूनी',
    'connect-with-us': 'हमसे जुड़ें',
    'copyright': '© 2025 भारत सरकार। सर्वाधिकार सुरक्षित।',
    'last-updated': 'अंतिम अद्यतन:',
    'site-visitors': 'साइट आगंतुक:',
    'footer-about': 'भूमिसेतु के बारे में',
    'footer-about-desc': 'भूमिसेतु एक व्यापक संपत्ति पंजीकरण पोर्टल है जो संपत्ति पंजीकरण और संबंधित सेवाओं की प्रक्रिया को सरल बनाता है।'
  },
  mr: {
    // Marathi translations
    'site-title': 'भूमिसेतु',
    'site-subtitle': 'भारत सरकार',
    'site-tagline': 'एकीकृत मालमत्ता व्यवस्थापन प्रणाली',
    'login': 'लॉग इन',
    'register': 'नोंदणी',
    'home': 'मुख्यपृष्ठ',
    'property-search': 'मालमत्ता शोध',
    'encumbrances': 'बंधने',
    'documents': 'कागदपत्रे',
    'services': 'सेवा',
    'about': 'आमच्याबद्दल',
    'contact': 'संपर्क',
    'property-details': 'मालमत्ता तपशील',
    'property-type': 'मालमत्ता प्रकार',
    'property-area': 'मालमत्ता क्षेत्र',
    'location': 'स्थान',
    'submit': 'सबमिट करा',
    'reset': 'रीसेट करा',
    'select-language': 'भाषा निवडा',
    'help': 'मदत हवी आहे?',
    'support': '24/7 समर्थन',
    'live-chat': 'लाइव्ह चॅट',
    'email-support': 'ईमेल समर्थन',
    'call-now': 'आता कॉल करा',
    'start-chat': 'चॅट सुरू करा',
    'email-us': 'आम्हाला ईमेल करा',
    'information': 'माहिती',
    'help-support': 'मदत आणि समर्थन',
    'legal': 'कायदेशीर',
    'connect-with-us': 'आमच्याशी जोडा',
    'copyright': '© 2025 भारत सरकार. सर्व हक्क राखीव.',
    'last-updated': 'शेवटचे अद्यतन:',
    'site-visitors': 'साइट भेटी:',
    'footer-about': 'भूमिसेतु बद्दल',
    'footer-about-desc': 'भूमिसेतु हे एक व्यापक मालमत्ता नोंदणी पोर्टल आहे जे मालमत्ता नोंदणी आणि संबंधित सेवांची प्रक्रिया सुलभ करते.'
  }
};

// Function to translate text
function translateText(element, language) {
  const translationKey = element.getAttribute('data-translate');
  if (translationKey && translations[language] && translations[language][translationKey]) {
    element.textContent = translations[language][translationKey];
  }
}

// Function to translate the entire page
function translatePage(language) {
  // Translate all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    translateText(element, language);
  });

  // Update language selector
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = language;
  }

  // Store selected language in localStorage
  localStorage.setItem('selectedLanguage', language);

  // Update HTML lang attribute
  document.documentElement.lang = language;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  // Get saved language preference or default to English
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
  translatePage(savedLanguage);

  // Add event listener to language selector
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      translatePage(e.target.value);
    });
  }
}); 