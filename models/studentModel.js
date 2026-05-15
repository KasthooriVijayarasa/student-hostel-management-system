import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomNumber: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "active"
    }
});

export default mongoose.model("students", studentSchema);