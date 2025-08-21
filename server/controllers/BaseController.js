class BaseController {
  success(res, data, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  created(res, data, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }

  badRequest(res, message = 'Bad request') {
    return res.status(400).json({
      success: false,
      message
    });
  }

  unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message
    });
  }

  notFound(res, message = 'Not found') {
    return res.status(404).json({
      success: false,
      message
    });
  }

  serverError(res, message = 'Internal server error') {
    return res.status(500).json({
      success: false,
      message
    });
  }
}

module.exports = BaseController;