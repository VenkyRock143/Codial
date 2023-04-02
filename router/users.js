const express = require('express')
const router = express.Router();
const userController = require('../controller/user_controller')

router.get('/profile',userController.profile);
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);


router.post('/create',userController.create); 
router.post('/create-session',userController.create_session) 
router.get('/create-session',userController.profile);


module.exports = router;