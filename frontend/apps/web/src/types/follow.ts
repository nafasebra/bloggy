export interface FollowerUser {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
}

export interface FollowDocument {
  _id: string;
  followerId: FollowerUser;
  followingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowersResponse {
  followers: FollowDocument[];
}

export interface FollowingUser {
  _id: string;
  name: string;
  bio: string;
  avatar?: string;
  category?: string;
}

export interface FollowingResponse {
  following: FollowingUser[];
}

export interface FollowerCountResponse {
  count: number;
}

export interface FollowingCountResponse {
  count: number;
}
