import mongoose from 'mongoose';

const { Schema } = mongoose;

const fileSchema = new Schema(
    {
        filename: { type: String, required: true },
        data: { type: String, required: true },
    },
    { timestamps: true }
);

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File;