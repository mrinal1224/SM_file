import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size must be less than 5 MB"
            });
        }

        return res.status(400).json({
            message: err.message
        });
    }

    if (err.message === "Only image files are allowed") {
        return res.status(400).json({
            message: err.message
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal Server Error"
    });
};

export default errorMiddleware;
