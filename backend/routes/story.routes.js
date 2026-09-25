import express from "express";
import {
    createStory,
    getStoryFeed,
    deleteStory
} from "../controllers/story.controllers.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.middleware.js";

const storyRoutes = express.Router();

storyRoutes.post(
    "/",
    isAuthenticated,
    upload.single("image"),
    createStory
);

storyRoutes.get(
    "/feed",
    isAuthenticated,
    getStoryFeed
);

storyRoutes.delete(
    "/:id",
    isAuthenticated,
    deleteStory
);

export default storyRoutes;
