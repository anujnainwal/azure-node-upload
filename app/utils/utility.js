const sendSuccessResponse = (res, message, data = null) => {
  return res.status(200).json({ success: true, message: message, data: data });
};

const sendSuccessResponseWithData = (res, message, data = null) => {
  return res.status(201).json({ success: true, message: message, data: data });
};

const sendErrorResponse = (res, message, errorDetails = null) => {
  return res.status(400).json({
    success: false,
    message: message,
    data: null,
    errorDetails: errorDetails,
  });
};
const ErrorResponse = (res, message, data = null, errorDetails = null) => {
  return res.status(200).json({
    success: false,
    message: message,
    data: data,
    errorDetails: errorDetails,
  });
};
const unauthorizedResponse = (res, message, errorDetails = null) => {
  return res.status(401).json({
    success: false,
    message: message,
    data: null,
    errorDetails: errorDetails,
  });
};

const forribdenResponse = (res, message, errorDetails = null) => {
  return res.status(403).json({
    success: false,
    message: message,
    data: null,
    errorDetails: errorDetails,
  });
};

const notFoundResponse = (res, message, errorDetails = null) => {
  return res.status(404).json({
    success: false,
    message: message,
    data: null,
    errorDetails: errorDetails,
  });
};

const alreadyExistsResponse = (
  res,
  message,

  errorDetails = null
) => {
  return res.status(409).json({
    success: false,
    message: message,
    data: data,
    errorDetails: errorDetails,
  });
};

const internalErrorResponse = (res, message, errorDetails = null) => {
  return res.status(500).json({
    success: false,
    message: message,
    data: null,
    errorDetails: errorDetails,
  });
};

module.exports = {
  sendSuccessResponse,
  sendSuccessResponseWithData,
  unauthorizedResponse,
  forribdenResponse,
  notFoundResponse,
  internalErrorResponse,
  sendErrorResponse,
  alreadyExistsResponse,
  ErrorResponse,
};
