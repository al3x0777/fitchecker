/**
 * charts.js - Gestione di tutti i grafici Chart.js
 */

let bmiTrendChart = null;
let exercisesChart = null;
let caloriesChart = null;
let weeklyProgressChart = null;

function createBMITrendChart(dates, bmiValues, canvasId = 'bmiChart') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (bmiTrendChart) {
        bmiTrendChart.destroy();
    }
    
    const bmiConstants = window.BMI_CONSTANTS || {
        UNDERWEIGHT: { max: 18.5, color: '#4caf50' },
        NORMAL: { max: 24.9, color: '#8bc34a' },
        OVERWEIGHT: { max: 29.9, color: '#ff9800' },
        OBESE: { min: 30, color: '#f44336' }
    };
    
    bmiTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'BMI',
                data: bmiValues,
                borderColor: '#00BCD4',
                backgroundColor: 'rgba(0, 188, 212, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#2E7D32',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { family: 'Inter, Poppins, sans-serif', size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `BMI: ${context.raw.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'BMI', font: { weight: 'bold' } },
                    min: Math.max(15, Math.min(...bmiValues) - 2),
                    max: Math.min(40, Math.max(...bmiValues) + 2),
                    grid: { color: '#e0e0e0' }
                },
                x: {
                    title: { display: true, text: 'Data', font: { weight: 'bold' } },
                    ticks: { maxRotation: 45, minRotation: 45 }
                }
            }
        }
    });
}

function createExercisesBarChart(days, counts, canvasId = 'exercisesChart') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (exercisesChart) {
        exercisesChart.destroy();
    }
    
    exercisesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Esercizi completati',
                data: counts,
                backgroundColor: '#2E7D32',
                borderColor: '#1B5E20',
                borderWidth: 1,
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `📋 ${context.raw} esercizi`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Numero esercizi', font: { weight: 'bold' } },
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                },
                x: { title: { display: true, text: 'Giorno', font: { weight: 'bold' } } }
            }
        }
    });
}

function createCaloriesChart(days, calories, canvasId = 'caloriesChart') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (caloriesChart) {
        caloriesChart.destroy();
    }
    
    caloriesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Calorie bruciate',
                data: calories,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#FF9800',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `🔥 ${context.raw} kcal`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Calorie (kcal)', font: { weight: 'bold' } },
                    beginAtZero: true
                },
                x: { title: { display: true, text: 'Giorno', font: { weight: 'bold' } } }
            }
        }
    });
}

function createMuscleDistributionChart(muscles, counts, canvasId = 'muscleChart') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const colors = [
        '#2E7D32', '#00BCD4', '#FF9800', '#9C27B0',
        '#F44336', '#2196F3', '#4CAF50', '#FF5722'
    ];
    
    if (weeklyProgressChart) {
        weeklyProgressChart.destroy();
    }
    
    weeklyProgressChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: muscles,
            datasets: [{
                data: counts,
                backgroundColor: colors.slice(0, muscles.length),
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: 'Inter, Poppins, sans-serif', size: 11 },
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

window.createBMITrendChart = createBMITrendChart;
window.createExercisesBarChart = createExercisesBarChart;
window.createCaloriesChart = createCaloriesChart;
window.createMuscleDistributionChart = createMuscleDistributionChart;