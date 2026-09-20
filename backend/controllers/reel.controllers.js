import Reel from "../models/reel.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

const uploadVideoToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "social-media/reels",
                resource_type: "video"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

export const createReel = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "A video file is required"
            });
        }

        const { caption } = req.body;

        if (caption && caption.trim().length > 300) {
            return res.status(400).json({
                message: "Caption cannot exceed 300 characters"
            });
        }

        const uploadedVideo = await uploadVideoToCloudinary(req.file.buffer);

        const reel = await Reel.create({
            author: req.user._id,
            caption: caption?.trim() || "",
            video: uploadedVideo.secure_url
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { reels: reel._id }
        });

        const populatedReel = await Reel.findById(reel._id)
            .populate("author", "name username profileImage");

        return res.status(201).json({
            message: "Reel created successfully",
            reel: populatedReel
        });
    } catch (error) {
        next(error);
    }
};

export const getReels = async (req, res, next) => {
    try {
        const reels = await Reel.find()
            .sort({ createdAt: -1 })
            .populate("author", "name username profileImage");

        return res.status(200).json({
            message: "Reels fetched successfully",
            reels
        });
    } catch (error) {
        next(error);
    }
};
