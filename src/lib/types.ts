export interface PersonalInfo {
  id: string;
  user_id: string;
  username?: string; // Added username field
  name: string;
  professional_title: string;
  short_description: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

export interface AboutInfo {
  id: string;
  user_id: string;
  about_text: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMedia {
  id: string;
  user_id: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  email_url: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteProject {
  id: string;
  user_id: string;
  project_title: string;
  project_description: string;
  image_url: string;
  project_url: string;
  created_at: string;
  updated_at: string;
}

export interface VideoProject {
  id: string;
  user_id: string;
  project_title: string;
  project_description: string;
  thumbnail_url: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  user_id: string;
  blog_title: string;
  creation_date: string;
  blog_content: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo | null;
  aboutInfo: AboutInfo | null;
  socialMedia: SocialMedia | null;
  websiteProjects: WebsiteProject[];
  videoProjects: VideoProject[];
  blogPosts: BlogPost[];
}
