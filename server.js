const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

require('dotenv').config();

const Admin = require("./src/controller/admin");
const Open = require("./src/controller/open");

app.listen(process.env.ServerPort, console.log("running"));
const config = require('config')
const cors = require('cors');
app.set('token', process.env.SecretKey);



const corsOptions = {
    origin: "*",  // Change this to frontend domain for security
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));


// mongo database connection here
const mongoDBUrl = `mongodb+srv://admin:SecurePass123@cluster0.viw2b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const mongoDBUrl = `mongodb://admin:SecurePass123!@194.164.149.183:27017/`;
mongoose
    .connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connection success..."))
    .catch((err) => console.log("MongoDB connection error:", err));


//bodyparsor settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/images', express.static('uploads/Content/images'));


//router here 
app.get("/", (req, res) => {
    res.json({ message: "API is working!" });
});

app.use("/admin", Admin)
app.use("/open", Open)


//for error logs and defaulr routers
app.use((req, resp, next) => {
    resp.status(404).json({
        error: "Invalid Req found"
    })
});



module.exports = app;





