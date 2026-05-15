import express from "express";

import {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
} from "../controllers/studentController.js";

const route = express.Router();

route.post("/create", createStudent);

route.get("/getAll", getStudents);

route.put("/update/:id", updateStudent);

route.delete("/delete/:id", deleteStudent);

export default route;