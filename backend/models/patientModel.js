import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = mongoose.Schema(
  {
    ptname: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    mobile: {
        type: String,
        required: true,
      },
    address: {
        type: String,
        required: true,
      },
    email:{
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);


const Patient = mongoose.model('Patient', patientSchema);

export default Patient;