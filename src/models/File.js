import mongoose from 'mongoose';

const { Schema } = mongoose;

const fileSchema = new Schema(
    {
        filename: { type: String, required: true },
        extension: { type: String, required: true },
        fileData: { type: Buffer, required: true },
    },
    { timestamps: true }
);

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File;