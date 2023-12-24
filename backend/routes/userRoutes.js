import express from 'express';
import {
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
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post('/admit',protect,admitPatient);
router.post('/getpatientdata',protect,getPatientData);
router.get('/allpatients',protect,getAllPatients);
router.post('/delete',protect,deletePatient);
router.put('/updatepatient',protect,updatePatient)
export default router;