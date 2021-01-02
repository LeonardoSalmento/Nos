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

            return res.status(201).json(post);
            
        } catch (error) {
            return res.status(400).json({ error: "Something is wrong, try again!" });
        }
    }

    async show(req, res){
        try {
            const { id } = req.params;

            const post = await Post.findById(id);

            if (!post){
                return res.status(404).json({ error: "Post not found!" });
            }

            return res.status(200).json(post);

        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }

    async delete(req, res){
        try {
            const { id } = req.params;

            await Post.findByIdAndDelete(id);
            return res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }


    async update(req, res) {
        const { id } = req.params;
        const {
            text,
            picture
        } = req.body;
 
        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({error: "Post not found!"})
        }

        const updated = Date.now();
        
        const postUpdated = await Post.updateOne(
          { _id: id },
          {
            text,
            picture,
            updated
          }
        );
    
        return res.send(postUpdated);
      }


    async showMyPosts(req, res){
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user){
                return res.status(404).json({ error: "User not found!" });
            }


            const posts = await Post.find({ owner: user });

            return res.status(200).json(posts);

        } catch (error) {
            return res.status(400).json({ error: "Something is wrong, try again!" });    
        }
    }
}

export default PostController;