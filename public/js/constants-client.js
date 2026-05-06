/**
 * constants-client.js - Versione client delle costanti
 * Importa le costanti dal modulo globale
 * 
 * Questo file è un wrapper per rendere le costanti disponibili
 * in tutti i file JS del frontend senza doverle riscaricare.
 */

// Le costanti sono già esposte globalmente da constants.js
// Questo file serve solo come punto di riferimento

console.log('📦 Costanti FitChecker caricate');

// Inizializza helper per le costanti
document.addEventListener('DOMContentLoaded', () => {
    // Aggiorna eventuali elementi che necessitano di costanti
    console.log('Costanti disponibili:', {
        exerciseTypes: Object.keys(window.EXERCISE_TYPES || {}),
        difficultyLevels: Object.keys(window.DIFFICULTY_LEVELS || {}),
        muscleTargets: Object.keys(window.MUSCLE_TARGETS || {})
    });
});