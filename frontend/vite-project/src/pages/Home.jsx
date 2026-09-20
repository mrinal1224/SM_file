import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const stories = [
  { name: "Your Story", initials: "You", tone: "from-indigo-500 to-violet-500" },
  { name: "Ananya", initials: "AN", tone: "from-pink-500 to-rose-500" },
  { name: "Rohan", initials: "RO", tone: "from-cyan-500 to-blue-500" },
  { name: "Priya", initials: "PR", tone: "from-amber-400 to-orange-500" },
  { name: "Arjun", initials: "AR", tone: "from-emerald-400 to-teal-500" },
  { name: "Meera", initials: "ME", tone: "from-fuchsia-500 to-purple-500" },
];

const posts = [
  {
    id: 1,
    name: "Ananya Sharma",
    username: "ananyash",
    time: "18 min ago",
    initials: "AS",
    avatarTone: "from-pink-500 to-rose-500",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    caption:
      "Late afternoon at the studio. Building something, learning something, repeating. ✨",
    likes: 248,
    comments: 18,
  },
  {
    id: 2,
    name: "Rohan Mehta",
    username: "rohanm",
    time: "1 hr ago",
    initials: "RM",
    avatarTone: "from-cyan-500 to-blue-500",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    caption:
      "A clean desk, a good playlist and a stubborn bug. Today feels productive.",
    likes: 172,
    comments: 9,
  },
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

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-3"
          >
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
            <button className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100" aria-label="Notifications">
              ♡
            </button>
            <button
              onClick={() => navigate(`/profile/${user?.username}`)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-slate-300 hover:shadow-sm"
            >
              <Avatar initials={user?.name?.slice(0, 2).toUpperCase() || "ME"} tone="from-indigo-500 to-violet-500" size="h-8 w-8" />
              <span className="hidden sm:block text-sm font-semibold">{user?.name || "You"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:block rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Logout
            </button>
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
              <button
                onClick={() => navigate(`/profile/${user?.username}`)}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50"
              >
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
              <p className="mt-2 text-xs leading-5 text-white/60">
                Create a post, upload a photo and let your people know what is happening.
              </p>
              <button className="mt-4 w-full rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100">
                Create Post
              </button>
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
              <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">
                Latest ↓
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-5 py-4 scrollbar-hide">
              {stories.map((story, index) => (
                <button key={story.name} className="group flex w-[76px] shrink-0 flex-col items-center gap-2">
                  <div className={`rounded-full bg-gradient-to-br ${story.tone} p-[3px] transition group-hover:scale-105`}>
                    <div className="rounded-full bg-white p-[2px]">
                      <Avatar initials={index === 0 ? user?.name?.slice(0, 2).toUpperCase() || "ME" : story.initials} tone={story.tone} size="h-12 w-12" />
                    </div>
                  </div>
                  <span className="w-full truncate text-center text-[11px] font-semibold text-slate-600">
                    {index === 0 ? "Your Story" : story.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar initials={user?.name?.slice(0, 2).toUpperCase() || "ME"} tone="from-indigo-500 to-violet-500" />
              <button className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-100">
                What’s on your mind, {user?.name?.split(" ")[0] || "there"}?
              </button>
              <button className="hidden rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 sm:block">
                + Post
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <button className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">▧ Photo</button>
              <button className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">☻ Feeling</button>
              <button className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">⌖ Check in</button>
            </div>
          </div>

          <div className="space-y-5">
            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={post.initials} tone={post.avatarTone} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{post.name}</p>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-400">{post.time}</span>
                      </div>
                      <p className="text-xs text-slate-400">@{post.username}</p>
                    </div>
                  </div>
                  <button className="rounded-full px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-50">•••</button>
                </div>

                <img src={post.image} alt="" className="aspect-[4/3] w-full object-cover" />

                <div className="px-5 pb-5 pt-4">
                  <p className="text-sm leading-6 text-slate-700">{post.caption}</p>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>

                  <div className="mt-4 flex border-t border-slate-100 pt-3">
                    <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">♡ Like</button>
                    <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">◌ Comment</button>
                    <button className="flex-1 rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">↗ Share</button>
                  </div>
                </div>
              </article>
            ))}
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
                    <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Quick stats</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-lg font-black">12</p>
                  <p className="text-[10px] text-slate-400">Posts</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-lg font-black">248</p>
                  <p className="text-[10px] text-slate-400">Followers</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-lg font-black">184</p>
                  <p className="text-[10px] text-slate-400">Following</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Home;
