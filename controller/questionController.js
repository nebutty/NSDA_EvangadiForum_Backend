const dbconnection = require('../db/dbConfig');
const { StatusCodes } = require('http-status-codes');
const {v4: uuidv4 } = require('uuid');

// ✅ Get All Questions
async function getAllQuestions(req, res) {
  try {
    const [rows] = await dbconnection.query(
      "SELECT * FROM questions"
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found."
      });
    }

    res.status(StatusCodes.OK).json({ questions: rows });
  } catch (error) {
    console.error("Error fetching all questions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}

// ✅ Get Single Question
async function getSingleQuestion(req, res) {
  const { questionid } = req.params;

  try {
    const [rows] = await dbconnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found."
      });
    }

    res.status(StatusCodes.OK).json({ question: rows[0] });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}

// ✅ Create Question
async function createQuestion(req, res) {
  const { title, description,tag } = req.body;
  const userid = req.user.userid;
  // Validation
  if (!title || !description || !tag) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields"
    });
  }

  try {
    const questionId = uuidv4();
    await dbconnection.query(
      "INSERT INTO questions (userId,questionid, title, description,tag) VALUES (?, ?,?,?,?)",
      [userid, questionId, title, description, tag]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Question created successfully"
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}

module.exports = {
  getAllQuestions,
  getSingleQuestion,
  createQuestion
};
