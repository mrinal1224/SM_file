let io = null;

// Controllers should not import index.js directly because that would create a
// circular dependency. index.js stores the Socket.IO server here once at boot.
export const setIO = (socketServer) => {
    io = socketServer;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};
