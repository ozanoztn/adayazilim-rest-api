const express = require("express");
const app = express();

require("dotenv").config({
  path: "./config/config.env",
});

const connectDb = require("./helper/dbconnection");
const router = require("./routes/router");

app.use(express.json());

app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`Sunucu ${process.env.PORT} Portu Üzerinde Başlatıldı`);
  connectDb(process.env.URI);
});
