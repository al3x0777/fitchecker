// verify-source.js - COMPLETO

async function verifySource() {
    const urlInput = document.getElementById('sourceUrl');
    if (!urlInput) return;
    
    const url = urlInput.value;
    
    if (!url) {
        showToast('Inserisci un URL da verificare');
        return;
    }
    
    if (!url.startsWith('http')) {
        showToast('Inserisci un URL valido (es. https://...)');
        return;
    }
    
    const resultDiv = document.getElementById('verificationResult');
    if (!resultDiv) return;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div class="loading">🔍 Analisi in corso...</div>';
    
    try {
        const response = await fetch('/api/verify-source', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        const result = await response.json();
        
        let scoreColor = '';
        let scoreIcon = '';
        if (result.score >= 70) {
            scoreColor = '#4caf50';
            scoreIcon = '✅';
        } else if (result.score >= 40) {
            scoreColor = '#ff9800';
            scoreIcon = '⚠️';
        } else {
            scoreColor = '#f44336';
            scoreIcon = '❌';
        }
        
        let trustReasonHtml = '';
        if (result.trustReason && result.trustReason.length > 0) {
            trustReasonHtml = `<div class="trust-reasons"><strong>✅ Punti positivi:</strong><ul>${result.trustReason.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
        }
        
        let suspicionReasonHtml = '';
        if (result.suspicionReason && result.suspicionReason.length > 0) {
            suspicionReasonHtml = `<div class="suspicion-reasons"><strong>⚠️ Punti di attenzione:</strong><ul>${result.suspicionReason.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
        }
        
        resultDiv.innerHTML = `
            <div class="result-header">
                <h3>📊 Risultato verifica</h3>
                <div class="trust-score" style="background: ${scoreColor}">
                    ${scoreIcon} ${result.score}%
                </div>
            </div>
            ${trustReasonHtml}
            ${suspicionReasonHtml}
            <div class="trust-recommendation" style="background: ${scoreColor}20; padding: 1rem; border-radius: 12px; margin-top: 1rem;">
                <strong>💡 Raccomandazione:</strong><br>
                ${result.recommendation}
            </div>
            <div class="verification-tip">
                <small>🔍 ${result.tip || 'Consulta sempre fonti ufficiali come OMS, ISS, NIH per informazioni sanitarie.'}</small>
            </div>
        `;
        
    } catch (error) {
        const analysisResult = await analyzeClientSide(url);
        resultDiv.innerHTML = analysisResult;
    }
}

async function analyzeClientSide(url) {
    const trustedKeywords = window.TRUSTED_SOURCES ? 
        Object.values(window.TRUSTED_SOURCES).map(s => s.domain) :
        ['oms', 'who.int', 'iss.it', 'pubmed', 'nih.gov', 'lancet', 'bmj'];
    
    const suspiciousKeywords = window.SUSPICIOUS_KEYWORDS || [
        'miracoloso', 'dimagrisci in 3 giorni', 'segreto', 'rimedio naturale',
        'scoperta rivoluzionaria', 'le aziende non vogliono', 'guarigione immediata'
    ];
    
    let score = 0;
    let trustReason = [];
    let suspicionReason = [];
    
    trustedKeywords.forEach(keyword => {
        if (url.toLowerCase().includes(keyword)) {
            score += 20;
            const source = window.TRUSTED_SOURCES ? 
                Object.values(window.TRUSTED_SOURCES).find(s => s.domain === keyword) : null;
            trustReason.push(`Fonte potenzialmente attendibile: ${source?.name || keyword}`);
        }
    });
    
    suspiciousKeywords.forEach(keyword => {
        if (url.toLowerCase().includes(keyword)) {
            score -= 25;
            suspicionReason.push(`Contiene linguaggio sospetto: "${keyword}"`);
        }
    });
    
    if (url.startsWith('https://')) {
        score += 10;
        trustReason.push('Connessione sicura (HTTPS)');
    }
    
    score = Math.min(100, Math.max(0, score));
    
    let recommendation = '';
    if (score >= 70) recommendation = '✅ Sito potenzialmente affidabile. Verifica comunque le fonti citate.';
    else if (score >= 40) recommendation = '⚠️ Affidabilità media. Cerca conferme su siti istituzionali.';
    else recommendation = '❌ Bassa affidabilità. Diffida di informazioni non verificate.';
    
    let trustHtml = trustReason.length > 0 ? `<div class="trust-reasons"><strong>✅ Indizi positivi:</strong><ul>${trustReason.map(r => `<li>${r}</li>`).join('')}</ul></div>` : '';
    let suspicionHtml = suspicionReason.length > 0 ? `<div class="suspicion-reasons"><strong>⚠️ Indizi sospetti:</strong><ul>${suspicionReason.map(r => `<li>${r}</li>`).join('')}</ul></div>` : '';
    
    return `
        <div class="result-header">
            <h3>📊 Risultato verifica (analisi client)</h3>
            <div class="trust-score" style="background: ${score >= 70 ? '#4caf50' : (score >= 40 ? '#ff9800' : '#f44336')}">
                ${score >= 70 ? '✅' : (score >= 40 ? '⚠️' : '❌')} ${score}%
            </div>
        </div>
        ${trustHtml}
        ${suspicionHtml}
        <div class="trust-recommendation" style="background: #f5f5f5; padding: 1rem; border-radius: 12px; margin-top: 1rem;">
            <strong>💡 Raccomandazione:</strong><br>
            ${recommendation}
        </div>
        <div class="verification-tip">
            <small>🔍 Suggerimento: Per una verifica più accurata, cerca l'articolo su siti istituzionali come OMS (who.int) o ISS (iss.it).</small>
        </div>
    `;
}

// Event listeners
const verifyBtn = document.getElementById('verifyBtn');
if (verifyBtn) {
    verifyBtn.addEventListener('click', verifySource);
}

const sourceUrl = document.getElementById('sourceUrl');
if (sourceUrl) {
    sourceUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifySource();
    });
}

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navLinks) navLinks.classList.toggle('active');
    });
}