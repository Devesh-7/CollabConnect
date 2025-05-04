const express=require('express');
const router=express.Router();
const { getCollabs, getCollabById, postMessage } = require('../Controllers/collabsController.js');

router.get('/collabs/:userID',getCollabs);
router.get('/collabs/:userID/chats',getCollabs);
router.get('/chat/:projectID',getCollabById);
router.post('/chat/:projectID',postMessage);



module.exports=router;