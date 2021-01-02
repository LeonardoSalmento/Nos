import User from '../models/User';
import Post from '../models/Post';

class PostController{
    async create(req, res){
        try {
            const { userId, text, picture } = req.body;
            const likes = []
            const created = new Date();
            const updated = new Date();

            let user = await User.findById({ _id: userId });

            if (!user){
                return res.status(404).json({ error: "User not found!" });
            }

            let post = await Post.create({
                owner: user,
                text,
                picture,
                likes,
                created,
                updated
            });

            return res.json(post);
            
        } catch (error) {
            return res.status(400).json({ error: "Something is wrong, try again!" });
        }
    }


    async showMyPosts(req, res){
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user){
                return res.status(404).json({ error: "User not found!" });
            }


            const posts = await Post.find({ owner: user });

            return res.json(posts);

        } catch (error) {
            return res.status(400).json({ error: "Something is wrong, try again!" });    
        }
    }
}

export default PostController;