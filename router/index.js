const express = require('express')
const router = express.Router();
const homeController = require('../controller/home_controller')

console.log("router connected")

router.get('/',homeController.home);
router.use('/user',require('./users'));
// router.use('/post',require('./post'))


module.exports  = router;