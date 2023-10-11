require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const bodyParser = require("body-parser");
const cors = require("cors");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const { log } = require("winston");
const db = require("./src/config/database");
const authRoutes = require("./src/routes/user");
const loginRoute = require("./src/routes/auth");
const logger = require("./src/config/logger");
const {redisClient} =require('./src/config/redis')
const { successHandler, errorHandler } = require("./src/config/morgan");
const successHandle = require("./src/utils/successResponse");
const httpErrorCode = require('./src/utils/httpErrors')

const seeder = require('./src/routes/seeder/product')
// Configurations

const app = express();
app.use(helmet()); // set security HTTP headers
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cors());
app.options("*", cors());
app.options("*", cors());
app.use(bodyParser.json()); //json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
app.use(successHandler); //This is from morgan
app.use(errorHandler); //This is from morgan

//PORT
const port = process.env.PORT || 4500;


//DATABASE
db.connect();
//connect to redis
redisClient.connect().catch(() => {
    console.log('Redis client not connected');
    process.exit(1)
    
})
//VIEW

//ROUTES
app.use("/", authRoutes);
app.use("/", loginRoute);
app.use("/", seeder);
app.use("/api/v1/product", require("./src/routes/product"));
app.use("/api/v1/category", require("./src/routes/category"));
//Server
app.listen(port, () => {
  logger.info({ message: `...app listening on port ${port}` });
 
  console.log(`Server is running on port ${port}`);
});

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found, Seems you got lost. so sorry about that");
  err.status = 404;
  next(err);
});
//   const err = new Error("Not Found, Seems you got lost. so sorry about that");
//   err.status = 404;
//   next(err);
// });
//success
// app.use(function ({ message,status, data = [] }, req, res, next) {
//   res.status(status || 200).json({
//     status: true,
//     message: message,
//     data: data,
//   });
// });
/**
 * error handlers
 *
 * */
// development error handler
// will print stacktrace
if (process.env.NODE_ENV === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: false,
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: false,
    message: err.message,
  });
});

// app.use(successHandle);
