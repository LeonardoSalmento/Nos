import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  phone: Number,
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
},
  password: String,
  contacts: [],
  blocked_contacts: [],
  justification: String,
  profile_picture: String,
  created: Date,
  updated: Date,
}, {
    toJSON: { 
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
          }
    },
    versionKey: false,   
}

);

export default model('User', UserSchema);