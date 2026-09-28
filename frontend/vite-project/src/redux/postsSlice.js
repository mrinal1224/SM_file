import { createSlice } from "@reduxjs/toolkit";

// REDUX STEP 2: DEFINE THE SHARED POSTS STATE
//
// The store needs one place that describes:
// 1. what post state looks like
// 2. how that state can change
//
// createSlice gives us both the reducer and the action creators.

const initialState = {
    // One shared collection of posts for the whole frontend.
    items: [],

    // These belong to the shared posts resource because multiple screens
    // may need to know whether the shared posts are loading or failed.
    loading: false,
    error: "",
};

const postsSlice = createSlice({
    name: "posts",
    initialState,

    reducers: {
        // REDUX ACTION: setPosts
        // Used after fetching posts from the backend.
        //
        // WHY:
        // Instead of Home doing setPosts(...) on its own local state,
        // Home dispatches setPosts(...), updating the application-level copy.
        setPosts: (state, action) => {
            state.items = action.payload;
        },

        // REDUX ACTION: addPost
        // Used when a new post is created.
        //
        // WHY:
        // The new post enters the shared store immediately,
        // so every component reading from Redux can see the same post.
        addPost: (state, action) => {
            state.items.unshift(action.payload);
        },

        // REDUX ACTION: replaceUserPosts
        // Profile fetches only one user's posts.
        //
        // WHY:
        // We do NOT want Profile to create a second independent array.
        // We merge those server results into the one shared post collection.
        //
        // If a post already exists, replace it with the latest server copy.
        // If it does not exist yet, add it.
        replaceUserPosts: (state, action) => {
            const userPosts = action.payload;

            userPosts.forEach((incomingPost) => {
                const existingIndex = state.items.findIndex(
                    (post) => post._id === incomingPost._id
                );

                if (existingIndex === -1) {
                    state.items.push(incomingPost);
                } else {
                    state.items[existingIndex] = incomingPost;
                }
            });
        },

        // REDUX ACTION: updatePostLike
        // This updates one Post entity inside the shared store.
        //
        // WHY:
        // Earlier Home and Profile each changed their own copy.
        // Now both pages read this same object from Redux, so one dispatch
        // updates the state observed by both screens.
        updatePostLike: (state, action) => {
            const { postId, userId, liked } = action.payload;

            const post = state.items.find((item) => item._id === postId);
            if (!post) return;

            const currentLikes = post.likes || [];

            const likesWithoutCurrentUser = currentLikes.filter(
                (like) => (like?._id || like)?.toString() !== userId?.toString()
            );

            post.likes =
                liked && userId
                    ? [...likesWithoutCurrentUser, userId]
                    : likesWithoutCurrentUser;
        },

        // Loading/error actions are explicit on purpose for teaching.
        // Later, createAsyncThunk can automate the pending/fulfilled/rejected flow.
        setPostsLoading: (state, action) => {
            state.loading = action.payload;
        },

        setPostsError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setPosts,
    addPost,
    replaceUserPosts,
    updatePostLike,
    setPostsLoading,
    setPostsError,
} = postsSlice.actions;

// REDUX STEP 3: EXPORT THE REDUCER
// configureStore imports this reducer and mounts it at state.posts.
export default postsSlice.reducer;
