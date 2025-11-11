import BaseUser from './baseUser.js';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({}, { _id: false });

const Admin = BaseUser.discriminator('admin', adminSchema);
export default Admin;
