const express = require("express");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const AllRoutes = require("./Routes/index.js");
const cors = require("cors");
const app = express();

// all middleware
app.use(
  cors({
    origin: ["http://localhost:5173"], // Your frontend's origin
    credentials: true, // Allow credentials
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(AllRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    chalk.bgCyanBright(
      `Server Connected on Port http://localhost:${process.env.PORT}`
    )
  );
});
