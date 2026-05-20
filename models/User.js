const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Inizializza file JSON se non esiste
const initFile = async () => {
    try {
        await fs.access(USERS_FILE);
    } catch {
        await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    }
};
initFile();

class User {
    // Trova tutti gli utenti
    static async findAll() {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    }

    // Salva tutti gli utenti
    static async saveAll(users) {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    }

    // Trova per username
    static async findByUsername(username) {
        const users = await this.findAll();
        return users.find(u => u.username === username);
    }

    // Trova per ID
    static async findById(id) {
        const users = await this.findAll();
        return users.find(u => u.id === id);
    }

    // Crea nuovo utente
    static async create({ username, password, email }) {
        const users = await this.findAll();
        
        // Controlla se esiste già
        if (users.find(u => u.username === username)) {
            throw new Error('Username già esistente');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            email,
            streak: 0,
            last_login: null,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        await this.saveAll(users);
        return newUser;
    }

    // Verifica password e aggiorna streak
    static async verifyAndLogin(username, plainPassword) {
        const user = await this.findByUsername(username);
        if (!user) return null;
        
        const isValid = await bcrypt.compare(plainPassword, user.password);
        if (!isValid) return null;
        
        // Aggiorna streak
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = user.last_login ? user.last_login.split('T')[0] : null;
        
        let newStreak = user.streak;
        if (lastLogin === today) {
            // Già loggato oggi, streak invariato
        } else if (lastLogin === this.yesterday()) {
            newStreak++;
        } else {
            newStreak = 1;
        }
        
        // Salva aggiornamenti
        user.streak = newStreak;
        user.last_login = new Date().toISOString();
        
        const users = await this.findAll();
        const index = users.findIndex(u => u.id === user.id);
        users[index] = user;
        await this.saveAll(users);
        
        return { id: user.id, username: user.username, streak: user.streak };
    }
    
    static yesterday() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    }
}

module.exports = User;