import jwt from "jsonwebtoken";
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "user not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "user not authenticated",
        success: false,
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error ", error);

    // Handle specific JWT errors
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token.",
        success: false,
      });
    }

    // Handle other potential errors
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export default isAuthenticated;