const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy Database with HTML Content
let posts = [
    {
        id: 1,
        source: "PTI",
        isOffline: true,
        category: "Today In India >>",
        title: "CU students win 13 medals in culinary arts competition",
        imageUrl: "https://via.placeholder.com/400x200",
        content: "<h2>Historic Win for CU</h2><p>The students of CU have made history by winning <b>13 gold medals</b> in the national culinary arts competition. The event saw participation from over 50 universities across India.</p><br><p>Their signature dish, a fusion of traditional Indian spices with modern European plating, stole the show.</p>"
    },
    {
        id: 2,
        source: "NewsBytes",
        isOffline: true,
        category: "Tech >>",
        title: "New AI developments shape the future",
        imageUrl: "https://via.placeholder.com/400x200",
        content: "<h2>AI is the Future</h2><p>Tech giants have announced a new wave of <i>Artificial Intelligence</i> integrations that will be rolling out directly to mobile devices. This means faster processing and smarter apps.</p>"
    }
];

// Get all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

// Railway provides the PORT environment variable dynamically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
