const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { getAllQuestions , getSingleQuestion , createQuestion } = require('../controller/questionController');

router.get('/', authMiddleware, getAllQuestions);
router.get('/:questionid', authMiddleware, getSingleQuestion);
router.post('/createquestions',authMiddleware, createQuestion);

module.exports = router;
