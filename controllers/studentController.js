import Student from "../models/studentModel.js";

// Create Student
export const createStudent = async (req, res) => {
    try {

        const student = new Student(req.body);

        const savedData = await student.save();

        res.status(200).json(savedData);

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });

    }
};

// Get All Students
export const getStudents = async (req, res) => {
    try {

        const students = await Student.find();

        if(students.length === 0){
            return res.status(404).json({ message: "No Students Found" });
        }

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });

    }
};

// Update Student
export const updateStudent = async (req, res) => {
    try {

        const id = req.params.id;

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedStudent);

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });

    }
};

// Delete Student
export const deleteStudent = async (req, res) => {
    try {

        const id = req.params.id;

        await Student.findByIdAndDelete(id);

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });

    }
};