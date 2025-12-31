/** @format */

const express = require("express");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const dotenv = require("dotenv");
const connectToDB = require("./config/db");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();
// Connection to database
connectToDB();
// Init app
const app = express();


// apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

// Helmet
app.use(helmet());

// cors Policy
app.use(cors());

// Set View Engine
app.set("view engine", "ejs");

// Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));
app.use("/api/todos", require("./routes/todos"))
// ERROR HANDLER MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

// running the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${port}`);
});
