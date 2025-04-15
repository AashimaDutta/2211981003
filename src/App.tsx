import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/users';
import Posts from './pages/posts';
import Feed from './pages/feed';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Top Users</Link> |{' '}
        <Link to="/trending">Trending</Link> |{' '}
        <Link to="/feed">Feed</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/trending" element={<Posts />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
