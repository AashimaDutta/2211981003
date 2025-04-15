const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
const port = 8000;
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const API_TOKEN = ' PwzufG';  // Use your actual API token here

const cache = new NodeCache({ stdTTL: 60 }); // Cache expires every 60s
app.use(cors());

// Fetch users and posts from the server
app.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        const userPostMap = await getUserPostCommentCounts(users);

        const rankedUsers = Object.entries(userPostMap)
            .map(([userId, totalComments]) => ({
                id: userId,
                name: users[userId],
                totalComments
            }))
            .sort((a, b) => b.totalComments - a.totalComments)
            .slice(0, 5);

        res.json({ topUsers: rankedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch top users' });
    }
});

app.get('/posts', async (req, res) => {
    const type = req.query.type;

    if (!type || !['popular', 'latest'].includes(type)) {
        return res.status(400).json({ error: 'Invalid or missing type param' });
    }

    try {
        const { allPosts, postCommentCounts } = await getAllPostsWithComments();

        if (type === 'popular') {
            let maxCount = Math.max(...Object.values(postCommentCounts));
            let popularPosts = allPosts.filter(p => postCommentCounts[p.id] === maxCount);
            return res.json({ popular: popularPosts, maxComments: maxCount });
        }

        if (type === 'latest') {
            let latest = allPosts
                .sort((a, b) => b.id - a.id) // Assuming higher ID = newer
                .slice(0, 5);
            return res.json({ latest });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Utility function to fetch users from the API
async function getUsers() {
    const { data } = await axios.get(`${BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}` // Add Authorization header here
        }
    });
    return data.users;
}

// Utility function to fetch posts and comments count
async function getUserPostCommentCounts(users) {
    const result = {};
    for (let userId of Object.keys(users)) {
        const postsRes = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });

        let totalComments = 0;
        for (let post of postsRes.data.posts) {
            const commentsRes = await axios.get(`${BASE_URL}/posts/${post.id}/comments`, {
                headers: { 'Authorization': `Bearer ${API_TOKEN}` }
            });
            totalComments += commentsRes.data.comments.length;
        }

        result[userId] = totalComments;
    }
    return result;
}

// Utility function to fetch all posts with comment counts
async function getAllPostsWithComments() {
    const users = await getUsers();
    let allPosts = [];
    let postCommentCounts = {};

    for (let userId of Object.keys(users)) {
        const postsRes = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        const posts = postsRes.data.posts;

        allPosts.push(...posts);

        for (let post of posts) {
            const commentsRes = await axios.get(`${BASE_URL}/posts/${post.id}/comments`, {
                headers: { 'Authorization': `Bearer ${API_TOKEN}` }
            });
            postCommentCounts[post.id] = commentsRes.data.comments.length;
        }
    }

    return { allPosts, postCommentCounts };
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
