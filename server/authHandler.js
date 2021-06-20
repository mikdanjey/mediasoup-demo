const jwt = require('jsonwebtoken');

// const { ACCESS_TOKEN_SECRET } = process.env;

const ACCESS_TOKEN_SECRET = "";

const algorithm = "HS256";

//middleware function to check if the incoming request in authenticated:
exports.isAuthorized = () => {
    return [
        (req, res, next) => {
            const cookieAccessToken = req.headers.xaccesstoken;
            console.log(cookieAccessToken);
            if (!cookieAccessToken) {
                return res.status(401).json({ error: "Access denied, token missing!", status: "Token not provided" });
            } else {
                jwt.verify(cookieAccessToken, ACCESS_TOKEN_SECRET, { algorithm }, (error, currentUser) => {
                    if (error) {
                        // shut them out!
                        if (error.name === "TokenExpiredError") {
                            return res.status(401).json({ error: "Session timed out, please login again", status: error.name });
                        } else if (error.name === "JsonWebTokenError") {
                            return res.status(401).json({ error: "Invalid token, please login again!", status: error.name });
                        } else {
                            return res.status(400).json({ error });
                        }
                    }
                    // the intended endpoint
                    req.currentUser = currentUser;
                    return next();
                });
            }
        }
    ]
};
