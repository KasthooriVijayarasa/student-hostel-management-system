import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
} from "../controllers/studentController.js";

const route = express.Router();

route.post("/create", authMiddleware, createStudent);

route.get("/getAll", authMiddleware, getStudents);

route.put("/update/:id", authMiddleware, updateStudent);

route.delete("/delete/:id", authMiddleware, deleteStudent);

export default route;