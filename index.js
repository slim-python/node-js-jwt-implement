import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const app = express();

dotenv.config();

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT} `);
});

///////////////////////////////////////////////////

const checkToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

app.get("/", checkToken, (req, res) => {
  jwt.verify(req.token, "my_secret_key1", (err, data) => {
    if (err) {
      console.log("not working at /protected");
      res.sendStatus(403);
    } else {
      res.json({
        text: "this is home",
      });
    }
  });
});

app.post("/login", (req, res) => {
  const user = { id: 69 };
  const token = jwt.sign({ user }, "my_secret_key1");
  res.json({
    token: token,
  });
});

app.get("/protected", checkToken, (req, res) => {
  jwt.verify(req.token, "my_secret_key1", (err, data) => {
    if (err) {
      // console.log("not working at /protected");
      res.sendStatus(403);
    } else {
      res.json({
        text: "This is proteted",
      });
    }
  });
});

let TokenValue;

import axios from "axios";
const url = "http://localhost:5000/login";
const response = await axios.post(url).then((res) => {
  // console.log(res.data);
  TokenValue = res.data.token;
});

const config = {
  headers: {
    authorization: `Bearer ${TokenValue}`,
  },
};

axios.get("http://localhost:5000/", config).then((res) => {
  console.log(res.data);
});

axios.get("http://localhost:5000/protected", config).then((res) => {
  console.log(res.data);
});
