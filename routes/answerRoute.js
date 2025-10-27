const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/authMiddleware');
const { getAnswer, postAnswer } = require('../controller/answerController');

router.get('/:question_id', authMiddleware, getAnswer);
router.post('/', authMiddleware, postAnswer);

module.exports = router;