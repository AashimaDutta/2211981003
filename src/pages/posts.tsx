import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from '../types';

const TrendingPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [maxComments, setMaxComments] = useState<number>(0);

  useEffect(() => {
    axios.get('http://localhost:8000/posts?type=popular')
      .then(res => {
        setPosts(res.data.popular);
        setMaxComments(res.data.maxComments);
      })
      .catch(err => console.error('Error fetching trending posts:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔥 Trending Post(s) — {maxComments} Comments</h2>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: '1rem' }}>
          <img
            src={`https://picsum.photos/seed/post${post.id}/300/150`}
            alt="post image"
            style={{ display: 'block', marginBottom: '0.5rem' }}
          />
          <p><strong>User #{post.userid}</strong>: {post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TrendingPosts;
