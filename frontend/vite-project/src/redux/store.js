import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";

// REDUX STEP 1: CREATE THE GLOBAL STORE
// configureStore creates one central state container for the application.
//
// WHY:
// Home and Profile both need the same Post entities.
// Earlier, each page kept its own independent copy in useState.
// Now both screens will read from the same Redux store.
//
// We are ONLY moving shared post state to Redux.
// Reels, stories, form inputs, modals, loading flags for local UI etc.
// should remain local unless they genuinely need to be shared.
export const store = configureStore({
    reducer: {
        // "posts" becomes the key inside the global state:
        // state.posts
        posts: postsReducer,
    },
});
