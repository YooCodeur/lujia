import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  birthday?: Date;
  gender?: 'femme' | 'homme' | 'unisexe';
  isOptician: boolean;
  newsletterSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  birthday: { type: Date },
  gender: { 
    type: String, 
    enum: ['femme', 'homme', 'unisexe'] 
  },
  isOptician: { type: Boolean, default: false },
  newsletterSubscribed: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
