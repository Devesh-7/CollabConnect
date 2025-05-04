const express=require('express');
const router=express.Router();
const {getUserById, getAllUsers, updateUserProfile} = require('../Controllers/userController.js');

router.get('/users/:userID',getUserById);
router.get('/fetch/all',getAllUsers);
router.patch('/update/:id', updateUserProfile);

module.exports=router;

