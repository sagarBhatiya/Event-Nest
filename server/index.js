const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
const morgan = require("morgan");
const connectDb = require("./lib/connection");

const app = express();

dotenv.config();
connectDb();

const port = process.env.PORT || 8000;
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json);

readdirSync("./routes").map((route) => {
  app.use("/api", require(`./routes/${route}`));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
