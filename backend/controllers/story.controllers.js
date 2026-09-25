import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const STORY_LIFETIME = 24 * 60 * 60 * 1000;

export const createStory = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Story image is required"
            });
        }

        const caption = req.body.caption?.trim() || "";

        if (caption.length > 300) {
            return res.status(400).json({
                message: "Caption cannot exceed 300 characters"
            });
        }

        const uploadedImage = await uploadToCloudinary(
            req.file.buffer,
            "social-media/stories"
        );

        const story = await Story.create({
            author: req.user._id,
            image: uploadedImage.secure_url,
            caption,
            expiresAt: new Date(Date.now() + STORY_LIFETIME)
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { stories: story._id }
        });

        const populatedStory = await Story.findById(story._id)
            .populate("author", "name username profileImage");

        return res.status(201).json({
            message: "Story created successfully",
            story: populatedStory
        });
    } catch (error) {
        next(error);
    }
};

export const getStoryFeed = async (req, res, next) => {
    try {
        const allowedUsers = [
            req.user._id,
            ...(req.user.followings || [])
        ];

        const stories = await Story.find({
            author: { $in: allowedUsers },
            expiresAt: { $gt: new Date() }
        })
            .sort({ createdAt: 1 })
            .populate("author", "name username profileImage");

        return res.status(200).json({
            message: "Stories fetched successfully",
            stories
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                message: "Story not found"
            });
        }

        if (story.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can delete only your own story"
            });
        }

        await story.deleteOne();

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { stories: story._id }
        });

        return res.status(200).json({
            message: "Story deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
