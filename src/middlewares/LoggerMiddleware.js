const fs = require("fs");
const path = require("path");

// Helper function to get the log file path for the current date
const getLogFilePath = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return path.join(
    __dirname,
    `../logs/request_logs_${year}-${month}-${day}.txt`,
  );
};

// Ensure the log directory exists
const ensureLogDirectoryExists = (filePath) => {
  const logDir = path.dirname(filePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

const loggerMiddleware = (req, res, next) => {
  const logFilePath = getLogFilePath();
  ensureLogDirectoryExists(logFilePath);

  const requestId = req.requestId || "N/A";
  const timeStamp = new Date().toISOString();

  const requestLog = `[${timeStamp}] [Request] ${req.method} ${req.url} (Request ID: ${requestId})\nRequest Body: ${JSON.stringify(req.body)}\n`;
  fs.appendFile(logFilePath, requestLog, (err) => {
    if (err) {
      console.error("Error writing request log:", err);
    }
  });

  const originalJson = res.json;
  res.json = function (data) {
    const responseLog = `[${new Date().toISOString()}] [Response] ${req.method} ${req.url} (Request ID: ${requestId})\nResponse Body: ${JSON.stringify(data)}\n`;
    fs.appendFile(logFilePath, responseLog, (err) => {
      if (err) {
        console.error("Error writing response log:", err);
      }
    });
    return originalJson.call(this, data);
  };

  next();
};

module.exports = loggerMiddleware;
