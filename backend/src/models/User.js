import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        displayName: {
            type: String,
            required: true,
            trim: true
        },
        avatarUrl: {
            type: String //CDN link to display user avatar
        },
        avatarId: {
            type: String //Cloudinary public_id to delete avatar
        },
        bio: {
            type: String,
            maxlength: 500
        },
        phone: {
            type: String,
            sparse: true //possible to be null, but can not be duplicated
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;

