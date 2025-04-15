const axios = require('axios');
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const API_TOKEN = 'PwzufG';  
async function getUsers() {
    if (usersCache) return usersCache;

    try {
        const { data } = await axios.get(`${BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`  // Add the token here
            }
        });
        usersCache = data.users;
        return usersCache;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}
