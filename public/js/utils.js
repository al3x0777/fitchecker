// Funzioni di utilità comuni

// Mostra toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2E7D32;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: inherit;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Formatta data in formato italiano
function formatDate(date) {
    return new Date(date).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Validazione email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Calcola età da data di nascita
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Salva preferenze in localStorage
function savePreference(key, value) {
    localStorage.setItem(`fitchecker_${key}`, JSON.stringify(value));
}

// Recupera preferenze da localStorage
function getPreference(key, defaultValue = null) {
    const value = localStorage.getItem(`fitchecker_${key}`);
    if (value) {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    return defaultValue;
}

// Crea elemento con classe
function createElement(tag, className, innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
}

// Gestione errori generica
function handleError(error, context = '') {
    console.error(`Errore ${context}:`, error);
    showToast(`⚠️ Errore: ${error.message || 'Operazione fallita'}`);
}

// Scroll to top button
function initScrollToTop() {
    const button = createElement('button', 'scroll-to-top', '↑');
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #00BCD4;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Animazione confetti semplice
function showConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetto = document.createElement('div');
        confetto.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: hsl(${Math.random() * 360}, 100%, 50%);
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 2px;
            pointer-events: none;
            z-index: 10000;
            animation: confettiFall ${Math.random() * 2 + 1}s linear forwards;
        `;
        document.body.appendChild(confetto);
        setTimeout(() => confetto.remove(), 2000);
    }
}

// Aggiungi stili animazione
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    .active-break-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    .active-break-content {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        text-align: center;
        max-width: 90%;
    }
    .break-timer {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem;
        color: #2E7D32;
    }
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2E7D32;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

// Inizializza utility quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    initScrollToTop();
});