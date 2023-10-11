const logger =require('../config/logger')
function loggerErrorMessage(msg, data, statusCode=500) {
  return logger.error({
    message: `${msg}, details supplied is ${JSON.stringify(data.body)}`,
    status: statusCode,
    method: data.method,
    url: data.originalUrl,
  });
}

module.exports = loggerErrorMessage;