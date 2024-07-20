import { NextFunction, Request, Response } from "express";

/**
 * Error handling middleware.
 *
 * This middleware function handles errors that occur during the request lifecycle.
 * It captures the error, sets the response status code, and sends a JSON response
 * with error details.
 *
 * @param {any} error - The error object.
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {any} next - The next middleware function in the stack.
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set status code to the response's status code or default to 500 (Internal Server Error)
  const status = res.statusCode || 500;
  // Set error message to the error's message or default to 'Something went wrong'
  const message = error.message || "Something went wrong";
  // Send JSON response with error details

  res.status(status).json({
    success: false, // Indicate the request was not successful
    status: status, // Include the status code
    message: message, // Include the error message
    stack: process.env.NODE_ENV === "development" ? error.stack : {}, // Include stack trace if in development mode
  });
  next();
};
