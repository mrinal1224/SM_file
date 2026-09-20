import express from "express";
import multer from "multer";
import {
    createReel,
    getReels
} from "../controllers/reel.controllers.js";
import isAuthenticated from "../middlewares/authMiddleware.js";

const reelRoutes = express.Router();

const uploadReel = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed"), false);
        }
    }
});

reelRoutes.post(
    "/",
    isAuthenticated,
    uploadReel.single("video"),
    createReel
);

reelRoutes.get(
    "/",
    isAuthenticated,
    getReels
);

export default reelRoutes;
