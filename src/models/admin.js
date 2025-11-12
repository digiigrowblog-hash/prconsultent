import BaseUser from './baseUser.js';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({});

// Use existing baseUser `_id` for admin discriminator
const Admin = mongoose.models.Admin || BaseUser.discriminator('admin', adminSchema);

export default Admin;
