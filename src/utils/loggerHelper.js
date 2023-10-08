const logger =require('../config/logger')
function loggerMessage(msg, data) {
    return logger.error({
      message: `${msg} ${JSON.stringify(
        data.body
      )}`,
      status: 500,
      method: data.method,
      url: data.originalUrl,
    });
}

module.exports = loggerMessage