import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  model: string;
  price: number;
  category: 'solaire' | 'optique';
  gender: 'femme' | 'homme' | 'mixte';
  shape: 'ronde' | 'carrée' | 'pilote' | 'géométrique' | 'cat-eye';
  color: string;
  size: string;
  fit: string;
  polarized: boolean;
  availableInOptical: boolean;
  images: string[];
  description?: string;
  stock: number;
  collection?: string;
  isNew?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  model: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['solaire', 'optique'] 
  },
  gender: { 
    type: String, 
    required: true, 
    enum: ['femme', 'homme', 'mixte'] 
  },
  shape: { 
    type: String, 
    required: true, 
    enum: ['ronde', 'carrée', 'pilote', 'géométrique', 'cat-eye'] 
  },
  color: { type: String, required: true },
  size: { type: String, required: true },
  fit: { type: String, required: true },
  polarized: { type: Boolean, default: false },
  availableInOptical: { type: Boolean, default: false },
  images: [{ type: String, required: true }],
  description: { type: String },
  stock: { type: Number, required: true, default: 0 },
  collection: { type: String },
  isNew: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
