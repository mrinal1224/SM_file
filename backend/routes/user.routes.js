import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    getUserProfile,
    followUser,
    unfollowUser,
    testFileUpload
} from "../controllers/user.controllers.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", isAuthenticated, logoutUser);
userRoutes.get("/me", isAuthenticated, getMe);
userRoutes.get("/profile/:username", isAuthenticated, getUserProfile);

// Temporary Multer test route
userRoutes.post(
    "/test-upload",
    isAuthenticated,
    upload.single("profileImage"),
    testFileUpload
);

// Following and followers
userRoutes.post("/:id/follow", isAuthenticated, followUser);
userRoutes.delete("/:id/follow", isAuthenticated, unfollowUser);

export default userRoutes;
