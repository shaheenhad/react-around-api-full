const { badReqErr, notFoundErr, intServErr } = require('./constants');

const errorMessage = (err, type) => {
  let errStatus = intServErr;
  let errMessage = err.name;

  if (errMessage === 'ValidationError') {
    errStatus = badReqErr;
    errMessage = err.message;
  } else if (errMessage === 'CastError') {
    errStatus = badReqErr;
    errMessage = `Invalid ${type} ID`;
  } else if (err.statusCode === notFoundErr) {
    errStatus = notFoundErr;
    errMessage = `${type} not found`;
  } else {
    errStatus = intServErr;
    errMessage = 'Internal server error';
  }
  return { errStatus, errMessage };
};

module.exports = { errorMessage };
