import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: []
})

const courseModel = mongoose.models.course || mongoose.model("course", courseSchema)

export default courseModel

