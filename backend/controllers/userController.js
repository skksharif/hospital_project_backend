import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Patient from '../models/patientModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const admitPatient = asyncHandler(async(req,res)=>{
  const { ptname, age, sex,mobile,address,email } = req.body;
  const patient = await Patient.create({
    ptname,
    age,
    sex,
    mobile,
    address,
    email
  });
  if (patient) {
    res.status(201).json({
      ptname,
      age,
      sex,
      mobile,
      address,
      email
    });
  } else {
    res.status(400);
    throw new Error('Invalid Patient data');
  }

});
const getPatientData = asyncHandler(async(req,res)=>{
     const patient = await Patient.find({email:req.body.email});
     if (patient) {
      res.json(patient);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
});
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find();
  if (patients && patients.length > 0) {
    res.json(patients);
  } else {
    res.status(404);
    throw new Error('No patients found');
  }
});

const deletePatient = asyncHandler(async (req, res) => {
  const patientId = req.body.id;

  try {
    const patient = await Patient.findById(patientId);
    console.log(patient)
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    await Patient.deleteOne({ _id: patientId }); // Use deleteOne() to remove the patient by ID
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const updatePatient = asyncHandler(async (req, res) => {
  const { id,ptname, age, sex, mobile, address, email } = req.body;

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }
    patient.ptname = ptname || patient.ptname;
    patient.age = age || patient.age;
    patient.sex = sex || patient.sex;
    patient.mobile = mobile || patient.mobile;
    patient.address = address || patient.address;
    patient.email = email || patient.email;
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  admitPatient,
  getPatientData,
  getAllPatients,
  deletePatient,
  updatePatient
};