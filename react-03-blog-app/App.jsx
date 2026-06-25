const { useState, useMemo } = React;

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    excerpt: "An introduction to useState, useEffect, and useCallback in modern React applications.",
    content: `React Hooks were introduced in React 16.8 and changed how we write components. Instead of class components with lifecycle methods, we can now use functional components with hooks.\n\nuseState lets us add state to functional components. useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount. useCallback memoizes functions so they don't get recreated on every render.\n\nHooks must always be called at the top level — never inside loops, conditions, or nested functions. This rule ensures hooks are called in the same order on every render, which is how React tracks which hook state belongs to which hook call.`,
    author: "Alice Johnson",
    date: "2024-01-15",
    tags: ["React", "JavaScript", "Hooks"],
    likes: 42,
    emoji: "⚛️",
  },
  {
    id: 2,
    title: "CSS Grid vs Flexbox",
    excerpt: "When to use CSS Grid and when to stick with Flexbox for your layouts.",
    content: `CSS Grid and Flexbox are both powerful layout tools, but they excel in different scenarios.\n\nFlexbox is one-dimensional — it works along a single axis (row or column). It's perfect for navigation bars, button groups, and centering elements.\n\nCSS Grid is two-dimensional — it works with rows AND columns simultaneously. It's perfect for full page layouts, card grids, and complex arrangements.\n\nA common pattern is to use Grid for the overall page layout and Flexbox for components within each grid area.`,
    author: "Bob Smith",
    date: "2024-01-22",
    tags: ["CSS", "Layout", "Frontend"],
    likes: 35,
    emoji: "🎨",
  },
  {
    id: 3,
    title: "Understanding Async/Await",
    excerpt: "Mastering asynchronous JavaScript with async/await and proper error handling patterns.",
    content: `Async/await is syntactic sugar over Promises that makes asynchronous code look and behave like synchronous code.\n\nThe async keyword turns a function into a function that returns a Promise. The await keyword pauses execution until the Promise resolves.\n\nAlways wrap await calls in try/catch blocks to handle errors. Forgetting error handling is the most common mistake with async/await.\n\nYou can run multiple async operations in parallel using Promise.all() instead of awaiting them sequentially, which can significantly improve performance.`,
    author: "Carol White",
    date: "2024-02-05",
    tags: ["JavaScript", "Async", "Promises"],
    likes: 58,
    emoji: "⏳",
  },
  {
    id: 4,
    title: "Node.js REST API Best Practices",
    excerpt: "Building scalable and maintainable REST APIs with Node.js and Express.",
    content: `Building a REST API with Node.js and Express is straightforward, but following best practices ensures your API is maintainable and scalable.\n\nUse proper HTTP methods: GET for reading, POST for creating, PUT/PATCH for updating, DELETE for removing resources.\n\nAlways validate input data before processing. Use a library like Joi or Zod for schema validation.\n\nStructure your project with separate layers: routes, controllers, services, and models. This separation of concerns makes testing and maintenance much easier.\n\nReturn appropriate HTTP status codes: 200 for success, 201 for created, 400 for bad request, 401 for unauthorized, 404 for not found, 500 for server errors.`,
    author: "David Brown",
    date: "2024-02-18",
    tags: ["Node.js", "REST", "API"],
    likes: 71,
    emoji: "🚀",
  },
];

function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'create'
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(p =>
    p.title.includes(search) || p.excerpt.includes(search)
  );

  function openPost(post) {
    setSelectedPost(post);
    setView('detail');
  }

  function handleLike(postId) {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked: true, likes: p.likes + 1 };
      }
      return p;
    }));
    setSelectedPost(prev => ({ ...prev, liked: true, likes: prev.likes + 1 }));
  }

  function addComment(postId, comment) {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        return { ...p, comments: [...comments, comment] };
      }
      return p;
    }));
    setSelectedPost(prev => ({
      ...prev,
      comments: [...(prev.comments || []), comment],
    }));
  }

  function addPost(newPost) {
    setPosts(prev => [newPost, ...prev]);
    setView('list');
  }

  return (
    <div>
      <header>
        <h1>DevBlog</h1>
        <nav>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Posts</button>
          <button className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>Write</button>
        </nav>
      </header>
      <div className="container">
        {view === 'list' && (
          <>
            <div className="search-bar">
              <input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="post-grid">
              {filteredPosts.length === 0 && <p style={{color:'#888'}}>No posts found.</p>}
              {filteredPosts.map(post => (
                <div key={post.id} className="post-card" onClick={() => openPost(post)}>
                  <div className="post-card-img">{post.emoji}</div>
                  <div className="post-card-body">
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <div>{post.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                    <div className="post-meta" style={{marginTop:'10px'}}>
                      <span>{post.author}</span>
                      <span>❤️ {(post.comments || []).length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {view === 'detail' && selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={() => {
              setView('list');
            }}
            onLike={handleLike}
            onAddComment={addComment}
          />
        )}
        {view === 'create' && (
          <CreatePost onSubmit={addPost} />
        )}
      </div>
    </div>
  );
}

function PostDetail({ post, onBack, onLike, onAddComment }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  function submitComment(e) {
    e.preventDefault();
    const comment = {
      id: Date.now(),
      author: name,
      text: text,
      date: new Date(),
    };
    onAddComment(post.id, comment);
    setName('');
    setText('');
  }

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onBack}>← Back to Posts</button>
      <h1>{post.title}</h1>
      <div className="meta">By {post.author} · {post.date}</div>
      <div className="likes">
        <button
          className={post.liked ? 'liked' : ''}
          onClick={() => onLike(post.id)}
        >
          ❤️ Like
        </button>
        <span>{post.likes} likes</span>
      </div>
      <div className="content">
        {post.content.split('\n').map((para, i) => (
          <p key={i} style={{marginBottom:'14px'}}>{para}</p>
        ))}
      </div>
      <div className="comments">
        <h3>Comments ({(post.comments || []).length})</h3>
        {(post.comments || []).map((c, i) => (
          <div key={c.id || i} className="comment">
            <div className="author">{c.author || 'Anonymous'}</div>
            <div className="text">{c.text}</div>
            <div className="date">{String(c.date)}</div>
          </div>
        ))}
        <div className="comment-form">
          <h4 style={{marginBottom:'12px'}}>Leave a Comment</h4>
          <form onSubmit={submitComment}>
            <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <textarea placeholder="Your comment..." value={text} onChange={e => setText(e.target.value)} />
            <button type="submit">Post Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CreatePost({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!content.trim()) errs.content = 'Content is required.';
    if (!author.trim()) errs.author = 'Author name is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const tags = tagInput.split(',').filter(t => t.length > 0);

    const newPost = {
      id: Math.random(),
      title,
      content: title,
      excerpt: content.substring(0, 100) + '...',
      author,
      date: new Date().toLocaleDateString(),
      tags,
      likes: 0,
      emoji: '📝',
    };

    onSubmit(newPost);
  }

  return (
    <div className="form-page">
      <h2>Write a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <label>Author</label>
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name..." />
        {errors.author && <p className="error-text">{errors.author}</p>}

        <label>Content</label>
        <textarea value={title} onChange={e => setContent(e.target.value)} placeholder="Write your post..." />
        {errors.content && <p className="error-text">{errors.content}</p>}

        <label>Tags (comma-separated)</label>
        <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="React, JavaScript, CSS" />

        <button type="submit">Publish Post</button>
      </form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
