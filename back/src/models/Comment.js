import { Schema, model, SchemaTypes } from 'mongoose';

const CommentSchema = new Schema({
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
    },
    post: {
        type: SchemaTypes.ObjectId,
        ref: 'Post',
    },
    text: String,
    picture: String,
    created: Date,
    updated: Date,
});

export default model('Comment', CommentSchema);