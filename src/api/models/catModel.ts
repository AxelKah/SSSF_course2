import mongoose, {Schema} from 'mongoose';
import {Cat} from '../../types/DBTypes';
// TODO: mongoose schema for cat

const catSchema: Schema = new mongoose.Schema<Cat>({
  cat_name: {type: String},
  weight: {type: Number},
  filename: {type: String},
  birthdate: {type: Date},
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model<Cat>('Cat', catSchema);
