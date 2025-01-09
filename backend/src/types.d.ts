import "express";

// Declare module augmenting the express module
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Make sure userId is available and correctly typed
    }
  }
} 
