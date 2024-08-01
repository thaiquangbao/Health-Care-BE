const express = require("express");
const app = express();
const db = require("./node/src/config/database/appointment");
const dotenv = require("dotenv");
const routes = require("./node/src/routes");
const notify = require("./node/src/app/Services/NotificateService");
const moment = require("moment-timezone");
const compression = require("compression");
const cors = require("cors");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const port = 8999;
const baseURL = "http://127.0.0.1:3000";

const corsOptions = {
  origin: [baseURL],
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
// notify.startDepointmentFetch();
app.listen(port, () => {
  console.log(`Content service running on port ${port}`);
});
