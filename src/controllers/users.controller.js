const usersDAO = require("../models/users.dao");
const { login } = require("./auth.controller");

const usersController = {
    getAll: (req, res) => {
        console.log({ session: req.session });
        
        const filter = req.query.filter || '';
        const currentPage = req.query.page || 1;
        const limit = 5;

        const users = usersDAO.getAll(currentPage, limit,filter);
        
        const totalCount = usersDAO.getTotalCount(filter);

        const totalPages = Math.ceil(totalCount.total / limit);


        res.render("users", { users, currentPage, totalPages, session: req.session ,filter});
    },
    create: (req, res) => {
        console.log({ body: req.body });
        const user = req.body;
        usersDAO.insert(user);
        return usersController.getById(req, res)
    },
    login: (req, res) => {
        const { cpf, password } = req.body;
        const user = usersDAO.login(cpf, password);

        console.log({ user });
        
        if (user) {
            // LOGADO
            req.session.isAuth = true;
            req.session.user = user;
            return usersController.getById(req, res);
        }

        res.send("NAO DEU!");
    },
    delete: (req, res) => {
        const userId = req.params.id;
        usersDAO.delete(userId);
        res.redirect("/users");
    },
    getById: (req, res) => {
        const id = req.params.id || req.session.user.id;
        const user = usersDAO.getById(id);
        if (user) {
            const emails = usersDAO.getEmailsByUserId(id);
            const phones = usersDAO.getPhonesByUserId(id);
            res.render('profile', { user, emails, phones, session: req.session });
        } else {
            res.status(404).send("Usuário não encontrado");
        }
    },
    editForm: (req, res) => {
        const id = parseInt(req.params.id);
        const currentUser = req.session.user;
    
        if (currentUser.role !== 'admin' && currentUser.id !== id) {
            return res.status(403).send("Acesso negado.");
        }
    
        const user = usersDAO.getById(id);
        const emails = usersDAO.getEmailsByUserId(id);
        const telefones = usersDAO.getPhonesByUserId(id);
    
        res.render('edit', { user, emails, telefones, session: req.session });
    },
    update: (req, res) => {
        const id = parseInt(req.params.id);
        const user = req.body;
        const currentUser = req.session.user;
    
        if (currentUser.role !== 'admin' && currentUser.id !== id) {
            return res.status(403).send("Acesso negado.");
        }
    
        usersDAO.update(id, user);
        res.redirect('/users');
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao destruir a sessão:", err);
                return res.status(500).send("Erro ao fazer logout.");
            }
            res.redirect("/");
        });
    }
};

module.exports = usersController;