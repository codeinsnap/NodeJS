const jwt = require("jsonwebtoken");

module.exports = (credentials = []) => {
  return (req, res, next) => {
    console.log("Authorization middleware");

    // Allow for a string OR array
    if (typeof credentials === "string") {
      credentials = [credentials];
    }

    // Find JWT in Headers
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send("access denied");
    } else {
      // Validate JWT
      // Bearer yndujsoIn...
      const tokenBody = token.slice(7);
      jwt.verify(tokenBody, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(`Error: ${err}`);
          return res.status(401).send("Error: Access Denied ");
        }
        // No Error, JWT is good!
        // Check for credentials being passed in
        if (credentials.length > 0) {
          if (
            decoded &&
            credentials.some(cred => decoded.indexOf(cred) >= 0)
          ) {
            next();
          } else {
            return res.status(401).send("Error: Access Denied");
          }
        } else {
          // No credentials required, user is authorized
          next();
        }
      });
    }
  };
};