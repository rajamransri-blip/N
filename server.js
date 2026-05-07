// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory database (WordPress jaisa data structure)
let posts = [
    {
        id: 1,
        source: "PTI",
        isOffline: true,
        category: "Today In India",
        title: "CU students win 13 medals in culinary arts...",
        imageUrl: "https://via.placeholder.com/400x200",
        content: "Full news content goes here..."
    },
    {
        id: 2,
        source: "NewsBytes",
        isOffline: true,
        category: "Tech",
        title: "New AI chips announced for mobile devices",
        imageUrl: "https://via.placeholder.com/400x200",
        content: "Tech news content goes here..."
    }
];

// ----------------------------------------------------
// PUBLIC API (App me feed dikhane ke liye)
// ----------------------------------------------------
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// ----------------------------------------------------
// ADMIN API (Post add, update, delete karne ke liye)
// ----------------------------------------------------

// Add a new Post
app.post('/api/admin/posts', (req, res) => {
    const newPost = {
        id: Date.now(),
        source: req.body.source || "Admin",
        isOffline: req.body.isOffline || false,
        category: req.body.category || "General",
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        content: req.body.content
    };
    posts.push(newPost);
    res.status(201).json({ message: "Post added successfully", post: newPost });
});

// Update an existing Post
app.put('/api/admin/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        posts[postIndex] = { ...posts[postIndex], ...req.body };
        res.json({ message: "Post updated", post: posts[postIndex] });
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

// Delete a Post
app.delete('/api/admin/posts/:id', (req, res) => {
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: "Post deleted" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Admin Server & API running on http://localhost:${PORT}`);
});
