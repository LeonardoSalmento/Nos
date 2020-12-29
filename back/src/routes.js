import { Router } from 'express';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import authMiddleware from './middlewares/authMiddleware';

const routes = Router();

const userController = new UserController();
const authController = new AuthController();

routes.post('/auth', authController.authenticate);

routes.get('/users', userController.index);
routes.get('/users/:id', userController.show);
routes.post('/users', userController.create);


export default routes;