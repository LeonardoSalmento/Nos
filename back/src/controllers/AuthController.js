import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';

class AuthController {
    async authenticate(req, res){
        try {
            const { email, password } = req.body;

            const user = await User.findOne({email});
            
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword){
                return res.status(401).json({error: "Your password is wrong, try again!"})
            }

            const token = jwt.sign({id: user._id}, 'top-secret', {expiresIn: '1d'});
            console.log(user)                
            delete user.password;
            console.log(user)
            
            return res.json({
                user,
                token
            });
                        
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"})
        }
    }

    
}

export default AuthController;