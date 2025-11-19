
export interface SkillEndorsement {
  skill: string;
  endorsedBy: { id: string; fullName: string }[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  skills: SkillEndorsement[];
  connections: string[];
}

export interface Session {
  user: {
    id: string;
    email: string;
  };
}

export enum Page {
  Auth,
  Home,
  Profile,
  MyProfile,
}
