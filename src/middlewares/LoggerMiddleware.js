const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/request_logs.txt");

const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const loggerMiddleware = (req, res, next) => {
  const requestId = req.requestId || "N/A";
  const timeStamp = new Date().toISOString();

  const requestLog = `[${timeStamp}] [Request] ${req.method} ${req.url} (Request ID : ${requestId}) \nRequest Body :${JSON.stringify(req.body)}\n`;
  fs.appendFileSync(logFilePath, requestLog);

  const originalJson = res.json;
  res.json = function (data) {
    const responseLog = `[${new Date().toISOString()}] [Response] ${req.method} ${req.url} (Request ID: ${requestId})\nResponse Body: ${JSON.stringify(data)}\n`;
    fs.appendFileSync(logFilePath, responseLog);
    originalJson.call(this, data);
  };

  next();
};

module.exports = loggerMiddleware;
