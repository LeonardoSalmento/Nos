import User from '../models/User';
import Comment from '../models/Comment';
import Post from '../models/Post';

class CommentController{
    async create(req, res){
        try {
            const { userId, postId, text, picture } = req.body;
            const created = new Date();
            const updated = new Date();

            let user = await User.findById({ _id: userId });

            if (!user){
                return res.status(404).json({ error: "User not found!" });
            }
            let post = await Post.findById(postId);
            if (!post){
                return res.status(404).json({ error: "Post not found!" });
            }
            let comment = await Comment.create({
                owner: user,
                post,
                text,
                picture,
                created,
                updated
            });
            
            return res.status(201).json(comment);

        } catch (error) {
            return res.status(400).json({ error: "Something is wrong, try again!" });
        }
    }

    async showCommentsPost(req, res){
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId);

            if (!post){
                return res.status(404).json({ error: "Post not found!" });    
            }
            
            const comments = await Comment.find({post})

            return res.status(200).json(comments);
        } catch (error) {
            return res.status(400).json({ error: "Something is wrong, try again!" });
        }
    }
}

export default CommentController;