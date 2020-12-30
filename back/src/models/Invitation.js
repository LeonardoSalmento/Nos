import { Schema, model, SchemaTypes } from 'mongoose';

const InvitationSchema = new Schema({

  inviter : {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
  invitee : {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
  created: Date,
  updated: Date,
}

);

export default model('Invitation', InvitationSchema);