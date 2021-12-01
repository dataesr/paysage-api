import mongoose from 'mongoose';

const identifiersSchema = new mongoose.Schema({
  id: String,
  name: String,
});

const structureSchema = new mongoose.Schema(
  {
    identifiers: { type: [identifiersSchema], required: false },
    descriptionFr: { type: String, required: true },
    nameFr: { type: String, required: false },
  },
  { timestamps: true },
);

const Structure = mongoose.model('structure', structureSchema);

export default Structure;
