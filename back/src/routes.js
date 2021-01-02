import { Router } from 'express';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import PostController from './controllers/PostController';
import authMiddleware from './middlewares/authMiddleware';

const routes = Router();

const userController = new UserController();
const authController = new AuthController();
const postController = new PostController();

routes.post('/auth', authController.authenticate);

routes.get('/users', userController.index);
routes.get('/users/:id', userController.show);
routes.post('/users', userController.create);
routes.put('/users/:id', authMiddleware, userController.update);

routes.post('/friendship-invites/:ids', authMiddleware, userController.sendInvite);
routes.get('/friendship-invites/', authMiddleware, userController.seeInvites);
routes.delete('/friendship-invites/:id/cancel', authMiddleware, userController.cancelInvite);
routes.delete('/friendship-invites/:id/refuse', authMiddleware, userController.refuseInvite);
routes.delete('/friendship-invites/:id/confirm', authMiddleware, userController.confirmInvite);
routes.post('/broken-friendship/:ids', authMiddleware, userController.brokenFriendship);

routes.get('/show-friends/:id', authMiddleware, userController.showAllFriends);

routes.post('/block/:ids', authMiddleware, userController.block);
routes.post('/unblock/:ids', authMiddleware, userController.unblock);
routes.get('/block/:id', authMiddleware, userController.showAllBlocks);

routes.post('/posts', authMiddleware, postController.create);
routes.delete('/posts/:id', authMiddleware, postController.delete);
routes.put('/posts/:id', authMiddleware, postController.update);
routes.get('/my-posts/:id', authMiddleware, postController.showMyPosts);

export default routes;