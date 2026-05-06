const fs = require('fs').promises;
const path = require('path');

const EXERCISE_LOGS_FILE = path.join(__dirname, '../data/exercise_logs.json');
const HEALTH_LOGS_FILE = path.join(__dirname, '../data/health_logs.json');

class ExerciseLog {
    static async getAllLogs() {
        try {
            const data = await fs.readFile(EXERCISE_LOGS_FILE, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }
    
    static async getUserLogs(userId) {
        const logs = await this.getAllLogs();
        return logs.filter(log => log.userId === userId);
    }
    
    static async addLog(userId, exercise, calories, reps) {
        const logs = await this.getAllLogs();
        const newLog = {
            id: Date.now().toString(),
            userId,
            exercise,
            calories,
            reps,
            date: new Date().toISOString(),
            dateOnly: new Date().toISOString().split('T')[0]
        };
        logs.push(newLog);
        await fs.writeFile(EXERCISE_LOGS_FILE, JSON.stringify(logs, null, 2));
        return newLog;
    }
    
    static async getTodayLogs(userId) {
        const logs = await this.getUserLogs(userId);
        const today = new Date().toISOString().split('T')[0];
        return logs.filter(log => log.dateOnly === today);
    }
    
    static async getWeeklyStats(userId) {
        const logs = await this.getUserLogs(userId);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weekLogs = logs.filter(log => new Date(log.date) >= weekAgo);
        
        const dailyCount = {};
        weekLogs.forEach(log => {
            dailyCount[log.dateOnly] = (dailyCount[log.dateOnly] || 0) + 1;
        });
        
        return {
            totalExercises: weekLogs.length,
            totalCalories: weekLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
            dailyBreakdown: dailyCount,
            streak: this.calculateStreak(logs)
        };
    }
    
    static calculateStreak(logs) {
        const dates = [...new Set(logs.map(log => log.dateOnly))].sort();
        if (dates.length === 0) return 0;
        
        let streak = 1;
        let currentDate = new Date(dates[dates.length - 1]);
        const today = new Date().toISOString().split('T')[0];
        
        if (dates[dates.length - 1] !== today) return 0;
        
        for (let i = dates.length - 2; i >= 0; i--) {
            const prevDate = new Date(dates[i]);
            const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak++;
                currentDate = prevDate;
            } else {
                break;
            }
        }
        return streak;
    }
    
    static async getHealthLogs(userId) {
        try {
            const data = await fs.readFile(HEALTH_LOGS_FILE, 'utf8');
            const logs = JSON.parse(data);
            return logs.filter(log => log.userId === userId);
        } catch {
            return [];
        }
    }
    
    static async saveHealthLog(userId, weight, bmi) {
        const logs = await this.getHealthLogs(userId);
        const today = new Date().toISOString().split('T')[0];
        
        const existingIndex = logs.findIndex(log => log.dateOnly === today);
        
        if (existingIndex !== -1) {
            logs[existingIndex] = { ...logs[existingIndex], weight, bmi, date: new Date().toISOString() };
        } else {
            logs.push({
                id: Date.now().toString(),
                userId,
                weight,
                bmi,
                dateOnly: today,
                date: new Date().toISOString()
            });
        }
        
        await fs.writeFile(HEALTH_LOGS_FILE, JSON.stringify(logs, null, 2));
        return logs;
    }
}

module.exports = ExerciseLog;