const constants = require('../utils/constants');

class HealthData {
    static calculateBMI(weightKg, heightCm) {
        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        return parseFloat(bmi.toFixed(1));
    }
    
    static getBMICategory(bmi) {
        if (bmi < constants.BMI_CONSTANTS.UNDERWEIGHT.max) {
            return { 
                ...constants.BMI_CONSTANTS.UNDERWEIGHT
            };
        }
        if (bmi <= constants.BMI_CONSTANTS.NORMAL.max) {
            return { 
                ...constants.BMI_CONSTANTS.NORMAL
            };
        }
        if (bmi <= constants.BMI_CONSTANTS.OVERWEIGHT.max) {
            return { 
                ...constants.BMI_CONSTANTS.OVERWEIGHT
            };
        }
        return { 
            ...constants.BMI_CONSTANTS.OBESE
        };
    }
    
    static calculateWaterIntake(weightKg, activityLevel = 'moderate') {
        let water = weightKg * 30;
        
        switch(activityLevel) {
            case 'moderate':
                water += 500;
                break;
            case 'high':
                water += 1000;
                break;
            case 'low':
                water -= 250;
                break;
            default:
                break;
        }
        return Math.round(water);
    }
    
    static calculateBMR(weightKg, heightCm, age, gender = 'male') {
        if (gender === 'male') {
            return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
        }
        return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    }
    
    static calculateTDEE(bmr, activityLevel) {
        const multiplier = constants.ACTIVITY_FACTORS[activityLevel] || 1.2;
        return Math.round(bmr * multiplier);
    }
    
    static getDailyCalorieGoal(bmi, tdee) {
        if (bmi >= constants.BMI_CONSTANTS.OVERWEIGHT.min) {
            return Math.round(tdee - 300);
        } else if (bmi < constants.BMI_CONSTANTS.NORMAL.min) {
            return Math.round(tdee + 300);
        }
        return tdee;
    }
    
    static getRecommendedExerciseByGoal(goal, difficulty = 'beginner') {
        const goalData = constants.FITNESS_GOALS[goal] || constants.FITNESS_GOALS.general;
        const difficultyData = constants.DIFFICULTY_LEVELS[difficulty] || constants.DIFFICULTY_LEVELS.beginner;
        
        const exercisesByGoal = {
            weight_loss: ['running', 'hiit', 'walking'],
            muscle_gain: ['strength', 'pushups', 'squats'],
            endurance: ['running', 'cycling', 'swimming'],
            flexibility: ['yoga', 'stretching'],
            general: ['walking', 'strength', 'stretching']
        };
        
        const suggested = exercisesByGoal[goal] || exercisesByGoal.general;
        
        return {
            goal: goalData.name,
            difficulty: difficultyData.name,
            suggested_activities: suggested,
            icon: goalData.icon
        };
    }
    
    static getMETValue(activity) {
        return constants.MET_VALUES[activity] || 5.0;
    }
    
    static calculateCaloriesBurned(activity, minutes, weightKg) {
        const met = this.getMETValue(activity);
        return Math.round((met * 3.5 * weightKg * minutes) / 200);
    }
}

module.exports = HealthData;