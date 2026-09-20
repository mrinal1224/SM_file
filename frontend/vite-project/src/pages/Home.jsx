import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosCalls/axios";

const stories = [
  { name: "Your Story", initials: "You", tone: "from-indigo-500 to-violet-500" },
  { name: "Ananya", initials: "AN", tone: "from-pink-500 to-rose-500" },
  { name: "Rohan", initials: "RO", tone: "from-cyan-500 to-blue-500" },
  { name: "Priya", initials: "PR", tone: "from-amber-400 to-orange-500" },
  { name: "Arjun", initials: "AR", tone: "from-emerald-400 to-teal-500" },
  { name: "Meera", initials: "ME", tone: "from-fuchsia-500 to-purple-500" },
];

function Avatar({ initials, tone = "from-slate-700 to-slate-900", size = "h-11 w-11" }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-xs font-bold text-white ring-2 ring-white`}
    >
      {initials}
    </div>
  );
}

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState("post");
  const [reelCaption, setReelCaption] = useState("");
  const [selectedReel, setSelectedReel] = useState(null);
  const [reelPreview, setReelPreview] = useState("");
  const [reelLoading, setReelLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [postError, setPostError] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const fileInputRef = useRef(null);
  const reelInputRef = useRef(null);

  const loadFeed = async () => {
    try {
      const response = await axiosInstance.get("/posts/feed");
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const resetReelState = () => {
    if (reelPreview) URL.revokeObjectURL(reelPreview);
    setReelCaption("");
    setSelectedReel(null);
    setReelPreview("");
  };

  const openCreatePost = () => {
    resetReelState();
    setCaption("");
    setSelectedImage(null);
    setPreviewImage("");
    setPostError("");
    setCreateType("post");
    setIsCreateOpen(true);
  };

  const openCreateReel = () => {
    setCaption("");
    setSelectedImage(null);
    setPreviewImage("");
    setPostError("");
    resetReelState();
    setCreateType("reel");
    setIsCreateOpen(true);
  };

  const closeCreatePost = () => {
    if (postLoading) return;
    setIsCreateOpen(false);
    setCreateType("post");
    setCaption("");
    setSelectedImage(null);
    setPostError("");
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (reelInputRef.current) reelInputRef.current.value = "";
    resetReelState();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPostError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPostError("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setPostError("");
    setSelectedImage(file);

    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleReelChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setPostError("Please select a valid video file.");
      event.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setPostError("Reel must be 50MB or smaller.");
      event.target.value = "";
      return;
    }

    setPostError("");
    setSelectedReel(file);

    if (reelPreview) URL.revokeObjectURL(reelPreview);
    setReelPreview(URL.createObjectURL(file));
  };

  const handleCreateReel = async (event) => {
    event.preventDefault();
    setPostError("");

    if (!selectedReel) {
      setPostError("Select a video to upload.");
      return;
    }

    try {
      setReelLoading(true);

      const formData = new FormData();
      formData.append("caption", reelCaption.trim());
      formData.append("video", selectedReel);

      await axiosInstance.post("/reels", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      closeCreatePost();
    } catch (error) {
      console.error("Create reel failed:", error);
      setPostError(
        error.response?.data?.message || "Unable to upload reel. Please try again."
      );
    } finally {
      setReelLoading(false);
    }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setPostError("");

    if (!caption.trim() && !selectedImage) {
      setPostError("Add a caption or upload an image.");
      return;
    }

    try {
      setPostLoading(true);

      const formData = new FormData();
      formData.append("caption", caption.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axiosInstance.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setPosts((prev) => [response.data.post, ...prev]);
      closeCreatePost();
    } catch (error) {
      console.error("Create post failed:", error);
      setPostError(
        error.response?.data?.message ||
          "Unable to create post. Please try again."
      );
    } finally {
      setPostLoading(false);
    }
  };

  const getInitials = (name) =>
    name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate("/home")} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-black text-white shadow-sm">
              S
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-base font-black tracking-tight">SST Social</p>
              <p className="text-[11px] text-slate-500">Your circle, your feed.</p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 w-72">
            <span className="text-base">⌕</span>
            <span>Search people or posts</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100" aria-label="Notifications">♡</button>
            <button
              onClick={() => navigate(`/profile/${user?.username}`)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-slate-300 hover:shadow-sm"
            >
              <Avatar initials={getInitials(user?.name)} tone="from-indigo-500 to-violet-500" size="h-8 w-8" />
              <span className="hidden sm:block text-sm font-semibold">{user?.name || "You"}</span>
            </button>
            <button onClick={handleLogout} className="hidden sm:block rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <button className="flex w-full items-center gap-3 rounded-2xl bg-indigo-50 px-4 py-3 text-left">
                <span className="text-lg">⌂</span>
                <span className="text-sm font-bold text-indigo-700">Home Feed</span>
              </button>
              <button onClick={() => navigate(`/profile/${user?.username}`)} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50">
                <span className="text-lg">◉</span>
                <span className="text-sm font-semibold">My Profile</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50">
                <span className="text-lg">♡</span>
                <span className="text-sm font-semibold">Notifications</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50">
                <span className="text-lg">⌁</span>
                <span className="text-sm font-semibold">Explore</span>
              </button>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Your Space</p>
              <p className="mt-2 text-lg font-bold">Share something worth seeing.</p>
              <p className="mt-2 text-xs leading-5 text-white/60">Create a post, upload a photo and let your people know what is happening.</p>
              <button onClick={openCreatePost} className="mt-4 w-full rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100">Create Post</button>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h1 className="text-xl font-black tracking-tight">Your Feed</h1>
                <p className="mt-1 text-xs text-slate-500">See what your circle is up to.</p>
              </div>
              <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Latest ↓</button>
            </div>
            <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-5 py-4 scrollbar-hide">
              {stories.map((story, index) => (
                <button key={story.name} className="group flex w-[76px] shrink-0 flex-col items-center gap-2">
                  <div className={`rounded-full bg-gradient-to-br ${story.tone} p-[3px] transition group-hover:scale-105`}>
                    <div className="rounded-full bg-white p-[2px]">
                      <Avatar initials={index === 0 ? getInitials(user?.name) : story.initials} tone={story.tone} size="h-12 w-12" />
                    </div>
                  </div>
                  <span className="w-full truncate text-center text-[11px] font-semibold text-slate-600">{index === 0 ? "Your Story" : story.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar initials={getInitials(user?.name)} tone="from-indigo-500 to-violet-500" />
              <button onClick={openCreatePost} className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-100">
                What’s on your mind, {user?.name?.split(" ")[0] || "there"}?
              </button>
              <button onClick={openCreatePost} className="hidden rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 sm:block">+ Post</button>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <button onClick={openCreatePost} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">▧ Photo</button>
              <button onClick={openCreateReel} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">▶ Reel</button>
              <button onClick={openCreatePost} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">☻ Feeling</button>
              <button onClick={openCreatePost} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">⌖ Check in</button>
            </div>
          </div>

          <div className="space-y-5">
            {posts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-lg font-black">Your feed is empty</p>
                <p className="mt-2 text-sm text-slate-500">Create the first post and start the conversation.</p>
                <button onClick={openCreatePost} className="mt-5 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Create Post</button>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={getInitials(post.author?.name)} tone="from-pink-500 to-violet-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">{post.author?.name || "User"}</p>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-400">@{post.author?.username || "user"}</p>
                      </div>
                    </div>
                    <button className="rounded-full px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-50">•••</button>
                  </div>

                  {post.image && <img src={post.image} alt="" className="aspect-[4/3] w-full object-cover" />}

                  <div className="px-5 pb-5 pt-4">
                    <p className="text-sm leading-6 text-slate-700">{post.caption}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>0 likes</span>
                      <span>0 comments</span>
                    </div>
                    <div className="mt-4 flex border-t border-slate-100 pt-3">
                      <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">♡ Like</button>
                      <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">◌ Comment</button>
                      <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">↗ Share</button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black">People to follow</h2>
                <button className="text-xs font-bold text-indigo-600">See all</button>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ["Priya Nair", "priyanair", "PN", "from-amber-400 to-orange-500"],
                  ["Arjun Kapoor", "arjunk", "AK", "from-emerald-400 to-teal-500"],
                  ["Meera Das", "meerad", "MD", "from-fuchsia-500 to-purple-500"],
                ].map(([name, handle, initials, tone]) => (
                  <div key={handle} className="flex items-center gap-3">
                    <Avatar initials={initials} tone={tone} size="h-10 w-10" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{name}</p>
                      <p className="truncate text-xs text-slate-400">@{handle}</p>
                    </div>
                    <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Follow</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Quick stats</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-lg font-black">{posts.length}</p><p className="text-[10px] text-slate-400">Posts</p></div>
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-lg font-black">{user?.followers?.length || 0}</p><p className="text-[10px] text-slate-400">Followers</p></div>
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-lg font-black">{user?.followings?.length || 0}</p><p className="text-[10px] text-slate-400">Following</p></div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-black">{createType === "reel" ? "Create Reel" : "Create Post"}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {createType === "reel" ? "Share a short video with your circle." : "Share something with your circle."}
                </p>
              </div>
              <button onClick={closeCreatePost} disabled={postLoading || reelLoading} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50">✕</button>
            </div>

            <form onSubmit={createType === "reel" ? handleCreateReel : handleCreatePost} className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <Avatar initials={getInitials(user?.name)} tone="from-indigo-500 to-violet-500" />
                <div>
                  <p className="text-sm font-bold">{user?.name || "You"}</p>
                  <p className="text-xs text-slate-400">@{user?.username || "you"}</p>
                </div>
              </div>

              {postError && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{postError}</div>
              )}

              {createType === "reel" ? (
                <>
                  <textarea
                    value={reelCaption}
                    onChange={(event) => setReelCaption(event.target.value)}
                    maxLength={300}
                    rows={3}
                    placeholder="Write a caption for your reel..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  {reelPreview && (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black">
                      <video src={reelPreview} controls className="max-h-80 w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          if (reelPreview) URL.revokeObjectURL(reelPreview);
                          setReelPreview("");
                          setSelectedReel(null);
                          if (reelInputRef.current) reelInputRef.current.value = "";
                        }}
                        className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <label className="inline-flex cursor-pointer rounded-2xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                    ▶ Add Reel
                    <input ref={reelInputRef} type="file" accept="video/*" onChange={handleReelChange} className="hidden" />
                  </label>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Video up to 50MB</span>
                    <span>{reelCaption.length}/300</span>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    maxLength={500}
                    rows={5}
                    placeholder="What's happening?"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  {previewImage && (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                      <img src={previewImage} alt="Post preview" className="max-h-80 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          if (previewImage) URL.revokeObjectURL(previewImage);
                          setPreviewImage("");
                          setSelectedImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <label className="cursor-pointer rounded-2xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                      ▧ Add Photo
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <span className="text-xs text-slate-400">{caption.length}/500</span>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeCreatePost} disabled={postLoading || reelLoading} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={postLoading || reelLoading} className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {postLoading || reelLoading ? "Publishing..." : createType === "reel" ? "Publish Reel" : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}}
    </div>
  );
}

export default Home;
