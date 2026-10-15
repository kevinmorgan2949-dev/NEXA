import { useRef, useState } from 'react';
import {
  Bookmark, Camera, Compass, Ellipsis, Heart, Home, ImagePlus, MessageCircle,
  Plus, Search, Send, Settings2, Smile, Sparkles, UserRound, Users, X,
} from 'lucide-react';

const photo = (id, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const people = [
  { name: 'maya.j', handle: 'maya.j', avatar: photo('photo-1534528741775-53994a69daeb', 120), color: 'coral' },
  { name: 'alexrivera', handle: 'alexrivera', avatar: photo('photo-1500648767791-00dcc994a43e', 120), color: 'violet' },
  { name: 'sophia.k', handle: 'sophia.k', avatar: photo('photo-1524504388940-b1c1722653e1', 120), color: 'blue' },
  { name: 'noahwoods', handle: 'noahwoods', avatar: photo('photo-1506794778202-cad84cf45f1d', 120), color: 'green' },
  { name: 'jules.jpg', handle: 'jules.jpg', avatar: photo('photo-1531123897727-8f129e1688ce', 120), color: 'orange' },
  { name: 'liam.chen', handle: 'liam.chen', avatar: photo('photo-1507003211169-0a1dd7228f2d', 120), color: 'pink' },
];

const initialPosts = [
  {
    id: 1, user: 'maya.j', location: 'Big Sur, California', avatar: people[0].avatar,
    image: photo('photo-1470770841072-f978cf4d019e', 1200),
    caption: 'Somewhere between the mountains and the sea, I found a little bit of quiet. 🌿',
    likes: 2486, time: '2 hours ago', comments: ['This view is unreal ✨', 'Adding this to my list!'], liked: false, saved: false,
  },
  {
    id: 2, user: 'alexrivera', location: 'Brooklyn, New York', avatar: people[1].avatar,
    image: photo('photo-1445116572660-236099ec97a0', 1200),
    caption: 'Slow mornings, good coffee, and nowhere else to be. ☕',
    likes: 834, time: '5 hours ago', comments: ['Need this kind of morning'], liked: false, saved: false,
  },
  {
    id: 3, user: 'sophia.k', location: 'Kyoto, Japan', avatar: people[2].avatar,
    image: photo('photo-1493976040374-85c8e12f0c0e', 1200),
    caption: 'Getting wonderfully lost in the little streets of Kyoto. 🌸',
    likes: 1952, time: '1 day ago', comments: ['Japan looks so magical'], liked: false, saved: false,
  },
];

function Avatar({ src, name, size = 'medium', ring = false }) {
  return <span className={`avatar avatar-${size}${ring ? ' avatar-ring' : ''}`}><img src={src} alt={`${name}'s profile`} /></span>;
}

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [following, setFollowing] = useState([]);
  const [activeNav, setActiveNav] = useState('Home');
  const [modalOpen, setModalOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [query, setQuery] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [notice, setNotice] = useState('');
  const fileInput = useRef(null);

  const toggleLike = (id) => setPosts((items) => items.map((post) => post.id === id
    ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
    : post));
  const toggleSave = (id) => setPosts((items) => items.map((post) => post.id === id ? { ...post, saved: !post.saved } : post));
  const toggleFollow = (handle) => setFollowing((list) => list.includes(handle) ? list.filter((item) => item !== handle) : [...list, handle]);
  const announce = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2400); };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const publishPost = (event) => {
    event.preventDefault();
    if (!caption.trim() && !imagePreview) return;
    setPosts((items) => [{
      id: Date.now(), user: 'you', location: 'Just now', avatar: photo('photo-1534528741775-53994a69daeb', 120),
      image: imagePreview || photo('photo-1490730141103-6cac27aaab94', 1200), caption: caption.trim(),
      likes: 0, time: 'just now', comments: [], liked: false, saved: false,
    }, ...items]);
    setCaption(''); setImagePreview(''); setModalOpen(false); announce('Your post is live ✨');
  };

  const addComment = (event, postId) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    setPosts((items) => items.map((post) => post.id === postId ? { ...post, comments: [...post.comments, commentText.trim()] } : post));
    setCommentText('');
  };

  const navItems = [
    { label: 'Home', icon: Home }, { label: 'Explore', icon: Compass },
    { label: 'Messages', icon: Send }, { label: 'Notifications', icon: Heart },
    { label: 'Create', icon: Plus }, { label: 'Profile', icon: UserRound },
  ];
  const peopleToFollow = people.slice(2, 6);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="NEXA home"><span className="brand-mark">n</span><span>NEXA<span className="brand-period">.</span></span></a>
        <div className="sidebar-label">MENU</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item${activeNav === label ? ' active' : ''}`} onClick={() => {
              setActiveNav(label);
              if (label === 'Create') setModalOpen(true);
              if (label === 'Messages' || label === 'Notifications') announce(`${label} are all caught up`);
            }}>
              <span className="nav-icon"><Icon size={20} strokeWidth={activeNav === label ? 2.4 : 1.8} /></span><span>{label}</span>
              {label === 'Notifications' && <i className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <button className="nav-item muted-nav" onClick={() => announce('Settings are coming soon')}><Settings2 size={20} strokeWidth={1.8} /><span>Settings</span></button>
          <div className="sidebar-profile"><Avatar src={photo('photo-1534528741775-53994a69daeb', 120)} name="Your profile" /><span><strong>your.name</strong><small>View your profile</small></span><Ellipsis size={18} /></div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">n</span><span>NEXA<span className="brand-period">.</span></span></div>
          <div className="search-wrap"><Search size={17} /><input aria-label="Search" placeholder="Search people, places..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}</div>
          <button className="top-create" onClick={() => setModalOpen(true)}><Plus size={17} /> <span>Create post</span></button>
          <button className="top-avatar" onClick={() => announce('Welcome back, your.name!')} aria-label="Your profile"><Avatar src={photo('photo-1534528741775-53994a69daeb', 120)} name="Your profile" size="small" /></button>
        </header>

        <div className="content-grid">
          <section className="feed-column" aria-label="Your feed">
            <div className="welcome-row"><div><p className="eyebrow">MONDAY, MAY 20, 2024</p><h1>Your little corner<br className="mobile-break" /> of the internet<span>.</span></h1></div><div className="welcome-sparkle"><Sparkles size={19} /></div></div>
            <section className="stories-panel" aria-label="Stories">
              <div className="section-heading"><div><h2>Stories</h2><span className="live-label"><i /> LIVE NOW</span></div><button className="text-button" onClick={() => announce('You’re all caught up on stories')}>See all <span>→</span></button></div>
              <div className="stories-list">
                <button className="story-item add-story" onClick={() => setModalOpen(true)}><span className="story-avatar own-story"><Avatar src={photo('photo-1534528741775-53994a69daeb', 120)} name="Your story" /><i><Plus size={14} /></i></span><span>Your story</span></button>
                {people.map((person) => <button className="story-item" key={person.handle} onClick={() => announce(`Opening ${person.name}'s story`)}><span className={`story-avatar ${person.color}`}><Avatar src={person.avatar} name={person.name} ring /></span><span>{person.name}</span></button>)}
              </div>
            </section>

            <div className="feed-heading"><div><h2>For you</h2><span>A little inspiration, picked for you</span></div><button className="filter-button" onClick={() => announce('Showing the latest posts')}><Sparkles size={15} /> For you</button></div>

            <div className="posts-list">
              {posts.filter((post) => !query || `${post.user} ${post.location} ${post.caption}`.toLowerCase().includes(query.toLowerCase())).map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-header"><Avatar src={post.avatar} name={post.user} /><div className="post-user"><strong>{post.user}</strong><span>{post.location}</span></div><button className="icon-button more-button" aria-label="More post options" onClick={() => announce('Post options')}><Ellipsis size={21} /></button></div>
                  <div className="post-image-wrap"><img className="post-image" src={post.image} alt={`Post by ${post.user}`} loading="lazy" /><button className="image-heart" aria-label="Like post" onClick={() => toggleLike(post.id)}><Heart fill="white" size={72} /></button></div>
                  <div className="post-actions"><div><button className={`icon-button like-button${post.liked ? ' liked' : ''}`} aria-label={post.liked ? 'Unlike post' : 'Like post'} onClick={() => toggleLike(post.id)}><Heart size={22} fill={post.liked ? 'currentColor' : 'none'} /></button><button className="icon-button" aria-label="View comments" onClick={() => setCommentOpen(commentOpen === post.id ? null : post.id)}><MessageCircle size={22} /></button><button className="icon-button" aria-label="Share post" onClick={() => announce('Post link copied to clipboard')}><Send size={21} /></button></div><button className={`icon-button save-button${post.saved ? ' saved' : ''}`} aria-label={post.saved ? 'Unsave post' : 'Save post'} onClick={() => toggleSave(post.id)}><Bookmark size={22} fill={post.saved ? 'currentColor' : 'none'} /></button></div>
                  <div className="post-copy"><strong className="like-count">{post.likes.toLocaleString()} <span>likes</span></strong><p><strong>{post.user}</strong> {post.caption}</p>{post.comments.length > 0 && <button className="comments-link" onClick={() => setCommentOpen(commentOpen === post.id ? null : post.id)}>View all {post.comments.length} comments</button>}<span className="post-time">{post.time.toUpperCase()}</span></div>
                  {commentOpen === post.id && <div className="comments-box">{post.comments.map((comment, index) => <p key={`${post.id}-${index}`}><strong>{index === 0 ? 'friend' : 'you'}</strong> {comment}</p>)}<form onSubmit={(event) => addComment(event, post.id)}><Smile size={18} /><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." aria-label="Add a comment" /><button disabled={!commentText.trim()}>Post</button></form></div>}
                </article>
              ))}
              {posts.filter((post) => !query || `${post.user} ${post.location} ${post.caption}`.toLowerCase().includes(query.toLowerCase())).length === 0 && <div className="empty-state"><Search size={24} /><strong>No posts found</strong><span>Try searching for another person or place.</span></div>}
            </div>
            <div className="end-note"><span>✳</span> You’re all caught up <span>✳</span></div>
          </section>

          <aside className="right-column">
            <section className="profile-card"><div className="profile-card-top"><div><span className="eyebrow">YOUR SPACE</span><h2>Make it yours.</h2></div><span className="profile-sparkle"><Sparkles size={17} /></span></div><div className="profile-progress"><div className="progress-line"><span /></div><span>Profile strength <strong>72%</strong></span></div><div className="profile-card-footer"><Avatar src={photo('photo-1534528741775-53994a69daeb', 120)} name="Your profile" /><div><strong>your.name</strong><span>3 of 5 steps complete</span></div><button aria-label="View profile" onClick={() => announce('Your profile is looking good!')}>→</button></div></section>
            <section className="suggestions"><div className="suggestions-heading"><div><h2>People to know</h2><span>Good people, good energy</span></div><button className="text-button" onClick={() => announce('Showing everyone you may know')}>See all <span>→</span></button></div><div className="suggestion-list">{peopleToFollow.map((person) => <div className="suggestion" key={person.handle}><Avatar src={person.avatar} name={person.name} /><div className="suggestion-details"><strong>{person.name}</strong><span>{person.name === 'sophia.k' ? 'Into slow living' : person.name === 'noahwoods' ? 'Suggested for you' : 'New to NEXA'}</span></div><button className={`follow-button${following.includes(person.handle) ? ' following' : ''}`} onClick={() => toggleFollow(person.handle)}>{following.includes(person.handle) ? 'Following' : 'Follow'}</button></div>)}</div></section>
            <section className="community-card"><div className="community-icon"><Users size={18} /></div><div><strong>Better together.</strong><p>Real connections start with a hello.</p><button onClick={() => announce('Explore communities coming soon')}>Find your people <span>→</span></button></div><div className="community-orbit orbit-one" /><div className="community-orbit orbit-two" /></section>
            <footer className="site-footer"><a href="#about">About</a><a href="#guidelines">Guidelines</a><a href="#privacy">Privacy</a><a href="#help">Help</a><span>© 2024 NEXA</span></footer>
          </aside>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.filter((item) => ['Home', 'Explore', 'Create', 'Notifications', 'Profile'].includes(item.label)).map(({ label, icon: Icon }) => <button key={label} aria-label={label} className={activeNav === label ? 'active' : ''} onClick={() => { setActiveNav(label); if (label === 'Create') setModalOpen(true); else if (label === 'Notifications') announce('You’re all caught up'); }}><Icon size={22} /></button>)}</nav>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={20} /></button><h2 id="modal-title">Create a post</h2><button className="share-button" disabled={!caption.trim() && !imagePreview} onClick={publishPost}>Share</button></div><form onSubmit={publishPost}><div className="modal-user"><Avatar src={photo('photo-1534528741775-53994a69daeb', 120)} name="Your profile" /><div><strong>your.name</strong><span>Sharing with everyone</span></div></div><textarea autoFocus value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What’s on your mind?" maxLength={500} /><div className="modal-tools"><span>{caption.length}/500</span><button type="button" onClick={() => fileInput.current?.click()}><ImagePlus size={18} /> Add photo</button><input ref={fileInput} type="file" accept="image/*" hidden onChange={selectImage} /></div>{imagePreview && <div className="preview-wrap"><img src={imagePreview} alt="Post preview" /><button type="button" aria-label="Remove image" onClick={() => setImagePreview('')}><X size={16} /></button></div>}<button className="modal-submit" type="submit" disabled={!caption.trim() && !imagePreview}>Share post</button></form></section></div>}
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default App;
