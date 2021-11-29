import mongoose from 'mongoose';

const structureSchema = new mongoose.Schema(
  {
    descriptionFr: { type: String, required: true },
    nameFr: { type: String, required: false },
  },
  { timestamps: true },
);

const Structure = mongoose.model('structure', structureSchema);

export default Structure;
