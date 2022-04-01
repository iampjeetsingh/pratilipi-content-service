require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

// Creating database connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log("DB GOT OOPS ");
    });

const PORT = process.env.PORT || 8080; // port at which server listening

app.listen(
    PORT,
    console.log(`server started in ${process.env.NODE_ENV} mode at port ${PORT}`)
);

// fetch routes
let userRouter = require('./routes/user');
let seriesRouter = require('./routes/series')

//define root routes.
app.use('/user', userRouter);
app.use('/series', seriesRouter)
