const db = require('../config/dbConnection');
const { login } = require('../controllers/auth.controller');

const usersDAO = {
        insert(user) {
                const result = db.prepare("SELECT COUNT(*) as count FROM users").get();
                const role = result.count === 0 ? 'admin' : 'cliente'; 
                const sql = 'INSERT INTO users (name, CPF, password, role) VALUES (?, ?, ?, ?)';
                db.prepare(sql).run(user.name, user.cpf, user.password, role);
        },
        delete(userId) {
                const sql = 'DELETE FROM users WHERE id = ?';
                db.prepare(sql).run(userId);
        },
        update(userId, user) {
                const sql = 'UPDATE users SET name = ? WHERE id = ?';
                db.prepare(sql).run(user.name, userId);
            
                if (user.emails) {
                    db.prepare('DELETE FROM emails WHERE user_id = ?').run(userId);
            
                    const insertEmail = db.prepare('INSERT INTO emails (user_id, email) VALUES (?, ?)');
                    for (const email of user.emails) {
                        const trimmed = email.trim();
                        if (trimmed) insertEmail.run(userId, trimmed);
                    }
                }
            
                if (user.phones) {
                    db.prepare('DELETE FROM phones WHERE user_id = ?').run(userId);
            
                    const insertPhone = db.prepare('INSERT INTO phones (user_id, phone) VALUES (?, ?)');
                    for (const phone of user.phones) {
                        const trimmed = phone.trim();
                        if (trimmed) insertPhone.run(userId, trimmed);
                    }
                }
        },
        getById(id) {
                const sql = "SELECT * FROM users WHERE id = ?";
                return db.prepare(sql).get(id);
        },
        getAll(page = 1, limit = 5, filter = '') {
                const offset = (page - 1) * limit;
                const sql = 'SELECT * FROM users WHERE name LIKE ? LIMIT ? OFFSET ?';
                return db.prepare(sql).all(`%${filter}%`,limit, offset);
        },
        getTotalCount(filter = '') {
                const sql = 'SELECT COUNT(*) as total FROM users WHERE name LIKE ?';
                return db.prepare(sql).get(`%${filter}%`);
        },
        login(cpf, password) {
                const sql = 'SELECT * FROM users WHERE cpf = ? AND password = ?';
                return db.prepare(sql).get(cpf, password);
        },
        getEmailsByUserId(id) {
                const sql = "SELECT email FROM emails WHERE user_id = ?";
                return db.prepare(sql).all(id);
        },
        getPhonesByUserId(id) {
                const sql = "SELECT phone FROM phones WHERE user_id = ?";
                return db.prepare(sql).all(id);
        }
            
}

module.exports = usersDAO;