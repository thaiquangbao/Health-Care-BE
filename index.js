const express = require("express");
const app = express();
const db = require("./node/src/config/database/appointment");
const dotenv = require("dotenv");
const routes = require("./node/src/routes");
const notify = require("./node/src/app/Services/NotificateService");
const expiredLogBook = require("./node/src/app/Services/ExpiredLogBookService");
const moment = require("moment-timezone");
const compression = require("compression");
const http = require("http");
const cors = require("cors");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const port = 8999;
const baseURL = "http://127.0.0.1:3000";
const baseURLTWO = "http://127.0.0.1:3001";
const baseURLDEPLOY =
  "https://health-haven-seven.vercel.app";
const myURLDEPLOY = "https://health-care-fe-two.vercel.app";
const socket = require("./node/src/untill/Socket");
const corsOptions = {
  origin: "*",
  allowedHeaders: [
    "Content-Type",
    "accessToken",
    "refreshToken",
  ],
};
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();
routes(app);
db.connectAppointment();
notify.startDepointmentFetch();
expiredLogBook.startLogBookFetch();
const server = http.createServer(app);
socket(server, [baseURL, baseURLTWO, baseURLDEPLOY, myURLDEPLOY]);
server.listen(port, () => {
  console.log(`Connect service running on port ${port}`);
});
