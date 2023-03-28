const express = require('express')
const router = express.Router();
const postController = require('../controller/post')

router.post('/post',postController.postCon)

module.exports = router;