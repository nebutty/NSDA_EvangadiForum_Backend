const dbconnection = require('../db/dbConfig');
const { StatusCodes } = require('http-status-codes');

async function getAnswer(req, res) {
  const question_id = req.params.question_id;

  try {
    const [result] = await dbconnection.query(
      'SELECT answerid, answer, user_name, created_at FROM answers WHERE questionid = ?',
      [question_id]
    );

    if (!result.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found."
      });
    }

    return res.status(StatusCodes.OK).json({
      answers: result
    });

  } catch (error) {
    console.error('DB Error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
}

async function postAnswer(req, res) {
  const { question_id, answer } = req.body;
  const user_id =req.user.userid;
  const user_name = req.user.username;
  
  console.log(user_id)
  if (!question_id || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "enter question_id and the answer"
    });
  }

  try {
    const [result] = await dbconnection.query(
      'INSERT INTO answers(userid, questionid, answer, user_name) VALUES (?, ?, ?, ?)',
      [user_id, question_id, answer, user_name]
    );
    
    return res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
      answer_id: result.insertId
    });

  } catch (error) {
    console.error('DB Error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
}

module.exports = { getAnswer, postAnswer };
