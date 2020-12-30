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

routes.post('/friendship-invites/:ids', authMiddleware, userController.sendInvite);
routes.get('/friendship-invites/', authMiddleware, userController.seeInvites);
routes.delete('/friendship-invites/:id/delete', authMiddleware, userController.deleteInvite);
routes.delete('/friendship-invites/:id/refuse', authMiddleware, userController.refuseInvite);
routes.delete('/friendship-invites/:id/confirm', authMiddleware, userController.confirmInvite);

export default routes;