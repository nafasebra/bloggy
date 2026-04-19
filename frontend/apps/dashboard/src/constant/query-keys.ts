export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters?: any) => [...queryKeys.posts.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.posts.all, id] as const,
  },

  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
  },

  comments: {
    all: ["comments"] as const,
    list: (postId: string) => [...queryKeys.comments.all, postId] as const,
  },
};
