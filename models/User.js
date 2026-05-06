const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class User {
    static async findAll() {
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
    
    static async findById(id) {
        const users = await this.findAll();
        return users.find(u => u.id === id);
    }
    
    static async findByUsername(username) {
        const users = await this.findAll();
        return users.find(u => u.username === username);
    }
    
    static async create({ username, password, email, age, weight, height }) {
        const users = await this.findAll();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            throw new Error('Username già esistente');
        }
        
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            email,
            age: parseInt(age) || 16,
            weight: parseFloat(weight) || 65,
            height: parseFloat(height) || 170,
            level: 'beginner',
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        
        // Non restituire la password
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    
    static async update(id, updates) {
        const users = await this.findAll();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...updates };
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        
        const { password: _, ...userWithoutPassword } = users[index];
        return userWithoutPassword;
    }
    
    static async verifyPassword(username, plainPassword) {
        const user = await this.findByUsername(username);
        if (!user) return false;
        return await bcrypt.compare(plainPassword, user.password);
    }
}

module.exports = User;