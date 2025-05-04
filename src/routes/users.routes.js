
const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const isAuth = require('../middlewares/isAuth');
const authController = require('../controllers/auth.controller');

const usersRouter = Router();

usersRouter.get('/users', isAuth, usersController.getAll);
usersRouter.get('/users/:id', usersController.getById);
usersRouter.get('/edit/:id', usersController.editForm);
usersRouter.post('/users', usersController.create);
usersRouter.post('/auth',  authController.login);
usersRouter.post('/login', usersController.login);
usersRouter.post('/deleteUser/:id', usersController.delete);
usersRouter.post('/update/:id', usersController.update);
usersRouter.post('/logout', usersController.logout);



module.exports = usersRouter;