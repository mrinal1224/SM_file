import express from "express";
import uploadReel from "../middlewares/reelUpload.middleware.js";
import {
    createReel,
    getReels,
    toggleReelLike
} from "../controllers/reel.controllers.js";
import isAuthenticated from "../middlewares/authMiddleware.js";

const reelRoutes = express.Router();

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


reelRoutes.patch(
    "/:id/like",
    isAuthenticated,
    toggleReelLike
);
