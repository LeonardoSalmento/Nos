import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next){
    const { authorization } = req.headers;
    if (!authorization){
        return res.sendStatus(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, 'top-secret');

        const {id} = data;

        req.userId = id;

        return next();

    } catch (error) {
        return res.sendStatus(401);
    }
}