const express = require('express');
require('dotenv').config();
const app = express();
const port = 5500;

const userRoutes = require("./routes/userRoute");
const questionRoutes = require('./routes/questionRoute')
const dbconnection = require("./db/dbConfig");

// ✅ Parse JSON before routes
app.use(express.json());

// ✅ Add leading slash here


app.use("/api/users", userRoutes);
app.use("/api/questions",questionRoutes)
async function start() {
  try {
    const [result] = await dbconnection.execute("SELECT 'test'");
    console.log(result[0])
    app.listen(port, () => console.log(`listening on ${port}`));
  } catch (error) {
    console.log(error.message);
  }
}

start();
