import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(res => setUsers(res.data.Users))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔥 Top 5 Users with Most Commented Posts</h2>
      {users.map(user => (
        <div key={user.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
          <img
            src={`https://picsum.photos/seed/user${user.id}/50`}
            alt={user.name}
            style={{ borderRadius: '50%', marginRight: '10px' }}
          />
          <strong>{user.name}</strong> — {user.totalComments} comments
        </div>
      ))}
    </div>
  );
};

export default Users;
