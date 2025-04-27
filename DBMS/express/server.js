const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

// Create Redis client
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// Simulate fetching from database
function getBlogPostFromDB(postId) {
    return {
        post_id: postId,
        title: `Post ${postId}`,
        content: 'This is a sample blog content fetched from the database.'
    };
}

// Route to get blog post
app.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const cachedPost = await redisClient.get(postId);

        if (cachedPost) {
            return res.json({ source: 'cache', data: JSON.parse(cachedPost) });
        }

        const post = getBlogPostFromDB(postId);
        await redisClient.setEx(postId, 60, JSON.stringify(post)); // Cache expires in 60 seconds

        return res.json({ source: 'database', data: post });
    } catch (error) {
        console.error('Redis error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to clear cache
app.delete('/clear-cache/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        console.log(`Attempting to delete cache for post ${postId}`);
        
        const deleted = await redisClient.del(postId);

        if (deleted) {
            console.log(`Cache for post ${postId} deleted.`);
            res.json({ message: `Cache for post ${postId} cleared.` });
        } else {
            console.log(`No cache found for post ${postId}`);
            res.json({ message: `No cache found for post ${postId}.` });
        }
    } catch (error) {
        console.error('Redis error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
