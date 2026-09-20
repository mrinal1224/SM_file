import express from "express";
import {
    createPost,
    getFeed
} from "../controllers/post.controllers.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.middleware.js";

const postRoutes = express.Router();

postRoutes.post(
    "/",
    isAuthenticated,
    upload.single("image"),
    createPost
);

postRoutes.get(
    "/feed",
    isAuthenticated,
    getFeed
);

export default postRoutes;
