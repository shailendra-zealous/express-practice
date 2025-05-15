const successResponse = (res, data, message, extra) => {
    return res.status(200).json({
        status: true,
        message: message || "Success",
        data: data || null,
        extra: extra || null
    });
}

const errorResponse = (res, message, statusCode) => {
    return res.status(statusCode || 500).json({
        status: false,
        message: message || "Internal Server Error",
        data: null
    });
}

module.exports = {
    successResponse,
    errorResponse
}