import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import studentRoute from "./routes/studentRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

// CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

// Routes
app.use("/api/students", studentRoute);
app.use("/api/auth", authRoute);

// Database
mongoose.connect(process.env.MONGO_URL)
.then(() => {

    console.log("Database Connected");

    app.listen(8000, () => {
        console.log("Server running on port 8000");
    });

})
.catch((error) => console.log(error));