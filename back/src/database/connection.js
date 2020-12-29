import mongoose from 'mongoose';

try{
  mongoose.connect(
    'mongodb://localhost:27017/my-db',

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to database.')

} catch{

  throw new Error('Could not connect to MongoDB.')
}

export default mongoose;