import { Schema, model, SchemaTypes } from 'mongoose';

const PostSchema = new Schema({
  owner: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
  },
  text: String,
  picture: String,
  likes: [],
  created: Date,
  updated: Date,
});

export default model('Post', PostSchema);