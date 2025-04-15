import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from '../types';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchLatest = () => {
    axios.get('http://localhost:8000/posts?type=latest')
      .then(res => setPosts(res.data.latest))
      .catch(err => console.error('Error fetching latest posts:', err));
  };

  useEffect(() => {
    fetchLatest(); // initial
    const interval = setInterval(fetchLatest, 5000); // update every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Live Feed</h2>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: '1rem' }}>
          <img
            src={`https://picsum.photos/seed/feed${post.id}/300/150`}
            alt="post"
            style={{ display: 'block', marginBottom: '0.5rem' }}
          />
          <p><strong>User #{post.userid}</strong>: {post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
