export interface User {
    id: string;
    name: string;
    totalComments: number;
  }
  
  export interface Post {
    id: number;
    userid: number;
    content: string;
    imageUrl?: string;
  }
  