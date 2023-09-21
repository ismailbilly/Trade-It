function successHandle(message, data = []) {
  const response = {
    status: "OK",
    message,
    data,
  };

  return next(response);
}

module.exports =successHandle

