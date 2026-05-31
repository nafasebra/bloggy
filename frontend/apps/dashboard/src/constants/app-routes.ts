export const APP_ROUTES = {
  dashboard: '/',

  posts: '/posts',
  createPost: '/posts/create',
  editPost: (id: string) => `/posts/edit/${id}`,

  users: '/users',
  createUser: '/users/create',
  editUser: (id: string) => `/users/edit/${id}`,

  comments: '/comments',
};
