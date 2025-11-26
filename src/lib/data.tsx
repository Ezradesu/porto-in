"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  PortfolioData,
  WebsiteProject,
  VideoProject,
  BlogPost,
  PersonalInfo,
  AboutInfo,
  SocialMedia,
} from "@/lib/types";

import { useAuth } from "@/context/AuthContext";

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextType {
  portfolioData: PortfolioData;
  updatePortfolioData: (data: Partial<PortfolioData>) => void;
  updateWebsiteProject: (project: WebsiteProject) => Promise<void>;
  addWebsiteProject: (project: Omit<WebsiteProject, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  removeWebsiteProject: (id: string) => Promise<void>;
  updateVideoProject: (project: VideoProject) => Promise<void>;
  addVideoProject: (project: Omit<VideoProject, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  removeVideoProject: (id: string) => Promise<void>;
  updateBlog: (blog: BlogPost) => Promise<void>;
  addBlog: (blog: Omit<BlogPost, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  removeBlog: (id: string) => Promise<void>;
  updatePersonalInfo: (info: PersonalInfo) => Promise<void>;
  updateAboutInfo: (info: AboutInfo) => Promise<void>;
  updateSocialMedia: (info: SocialMedia) => Promise<void>;
}

const API_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;
const HEADERS = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
  apikey: `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
  "Content-Type": "application/json",
};
const PUBLIC_HEADERS = {
  apikey: `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

import { useParams } from "next/navigation";
import { supabase } from "@/supabaseClient";

export function DataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const params = useParams();
  const username = params?.username as string | undefined;

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: null,
    aboutInfo: null,
    socialMedia: null,
    websiteProjects: [],
    videoProjects: [],
    blogPosts: [],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      let targetUserId: string | null = null;

      if (username) {
        // Fetch user_id by username
        const { data, error } = await supabase
          .from("personal_info")
          .select("user_id")
          .eq("username", username)
          .single();

        if (data) {
          targetUserId = data.user_id;
        } else {
          console.error("User not found for username:", username);
          return;
        }
      } else if (session?.user?.id) {
        targetUserId = session.user.id;
        // Store in sessionStorage for persistence/fallback if needed
        sessionStorage.setItem("user_id", targetUserId);
      } else {
        // Fallback to sessionStorage
        targetUserId = sessionStorage.getItem("user_id");
      }

      if (!targetUserId) return;

      try {
        const [infoRes, aboutRes, socialRes, websiteRes, videoRes, blogRes] =
          await Promise.all([
            fetch(`${API_URL}/personal_info?select=*&user_id=eq.${targetUserId}`, {
              headers: HEADERS,
            }),
            fetch(`${API_URL}/about_info?select=*&user_id=eq.${targetUserId}`, {
              headers: HEADERS,
            }),
            fetch(`${API_URL}/social_media?select=*&user_id=eq.${targetUserId}`, {
              headers: HEADERS,
            }),
            fetch(
              `${API_URL}/website_projects?select=*&user_id=eq.${targetUserId}&order=created_at.desc`,
              { headers: HEADERS }
            ),
            fetch(
              `${API_URL}/video_projects?select=*&user_id=eq.${targetUserId}&order=created_at.desc`,
              { headers: HEADERS }
            ),
            fetch(
              `${API_URL}/blog_posts?select=*&user_id=eq.${targetUserId}&order=creation_date.desc`,
              { headers: HEADERS }
            ),
          ]);

        const [info, about, social, websites, videos, blogs] =
          await Promise.all([
            infoRes.json(),
            aboutRes.json(),
            socialRes.json(),
            websiteRes.json(),
            videoRes.json(),
            blogRes.json(),
          ]);

        setPortfolioData({
          personalInfo: info[0] || null,
          aboutInfo: about[0] || null,
          socialMedia: social[0] || null,
          websiteProjects: websites || [],
          videoProjects: videos || [],
          blogPosts: blogs || [],
        });
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      }
    };

    fetchAllData();
  }, [username, session]);

  const updatePortfolioData = (data: Partial<PortfolioData>) => {
    setPortfolioData((prev) => ({ ...prev, ...data }));
  };

  const updateWebsiteProject = async (project: WebsiteProject) => {
    try {
      const { error } = await supabase
        .from("website_projects")
        .update({
          project_title: project.project_title,
          project_description: project.project_description,
          image_url: project.image_url,
          project_url: project.project_url,
        })
        .eq("id", project.id);

      if (error) throw error;

      updatePortfolioData({
        websiteProjects: portfolioData.websiteProjects.map((p) =>
          p.id === project.id ? project : p
        ),
      });
    } catch (error) {
      console.error("Failed to update website project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const addWebsiteProject = async (project: Omit<WebsiteProject, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      if (!session?.user?.id) {
        alert("You must be logged in to add projects");
        return;
      }

      const { data, error } = await supabase
        .from("website_projects")
        .insert({
          user_id: session.user.id,
          project_title: project.project_title,
          project_description: project.project_description,
          image_url: project.image_url,
          project_url: project.project_url,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        updatePortfolioData({
          websiteProjects: [...portfolioData.websiteProjects, data],
        });
      }
    } catch (error) {
      console.error("Failed to add website project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  const removeWebsiteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("website_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      updatePortfolioData({
        websiteProjects: portfolioData.websiteProjects.filter((p) => p.id !== id),
      });
    } catch (error) {
      console.error("Failed to remove website project:", error);
      alert("Failed to remove project. Please try again.");
    }
  };

  const updateVideoProject = async (project: VideoProject) => {
    try {
      const { error } = await supabase
        .from("video_projects")
        .update({
          project_title: project.project_title,
          project_description: project.project_description,
          thumbnail_url: project.thumbnail_url,
          video_url: project.video_url,
        })
        .eq("id", project.id);

      if (error) throw error;

      updatePortfolioData({
        videoProjects: portfolioData.videoProjects.map((p) =>
          p.id === project.id ? project : p
        ),
      });
    } catch (error) {
      console.error("Failed to update video project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const addVideoProject = async (project: Omit<VideoProject, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      if (!session?.user?.id) {
        alert("You must be logged in to add projects");
        return;
      }

      const { data, error } = await supabase
        .from("video_projects")
        .insert({
          user_id: session.user.id,
          project_title: project.project_title,
          project_description: project.project_description,
          thumbnail_url: project.thumbnail_url,
          video_url: project.video_url,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        updatePortfolioData({
          videoProjects: [...portfolioData.videoProjects, data],
        });
      }
    } catch (error) {
      console.error("Failed to add video project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  const removeVideoProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("video_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      updatePortfolioData({
        videoProjects: portfolioData.videoProjects.filter((p) => p.id !== id),
      });
    } catch (error) {
      console.error("Failed to remove video project:", error);
      alert("Failed to remove project. Please try again.");
    }
  };

  const updateBlog = async (blog: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          blog_title: blog.blog_title,
          creation_date: blog.creation_date,
          blog_content: blog.blog_content,
        })
        .eq("id", blog.id);

      if (error) throw error;

      updatePortfolioData({
        blogPosts: portfolioData.blogPosts.map((b) =>
          b.id === blog.id ? blog : b
        ),
      });
    } catch (error) {
      console.error("Failed to update blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

  const addBlog = async (blog: Omit<BlogPost, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      if (!session?.user?.id) {
        alert("You must be logged in to add blogs");
        return;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          user_id: session.user.id,
          blog_title: blog.blog_title,
          creation_date: blog.creation_date,
          blog_content: blog.blog_content,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        updatePortfolioData({
          blogPosts: [...portfolioData.blogPosts, data]
        });
      }
    } catch (error) {
      console.error("Failed to add blog:", error);
      alert("Failed to add blog. Please try again.");
    }
  };

  const removeBlog = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      updatePortfolioData({
        blogPosts: portfolioData.blogPosts.filter((b) => b.id !== id),
      });
    } catch (error) {
      console.error("Failed to remove blog:", error);
      alert("Failed to remove blog. Please try again.");
    }
  };

  const updatePersonalInfo = async (info: PersonalInfo) => {
    try {
      const { error } = await supabase
        .from("personal_info")
        .update({
          username: info.username,
          professional_title: info.professional_title,
          short_description: info.short_description,
          profile_image_url: info.profile_image_url,
        })
        .eq("id", info.id);

      if (error) throw error;

      updatePortfolioData({ personalInfo: info });
    } catch (error) {
      console.error("Failed to update personal info:", error);
      alert("Failed to update personal information. Please try again.");
    }
  };

  const updateAboutInfo = async (info: AboutInfo) => {
    try {
      const { error } = await supabase
        .from("about_info")
        .update({
          about_text: info.about_text,
          resume_url: info.resume_url,
        })
        .eq("id", info.id);

      if (error) throw error;

      updatePortfolioData({ aboutInfo: info });
    } catch (error) {
      console.error("Failed to update about info:", error);
      alert("Failed to update about information. Please try again.");
    }
  };

  const updateSocialMedia = async (info: SocialMedia) => {
    try {
      const { error } = await supabase
        .from("social_media")
        .update({
          github_url: info.github_url,
          linkedin_url: info.linkedin_url,
          twitter_url: info.twitter_url,
          instagram_url: info.instagram_url,
          email_url: info.email_url,
        })
        .eq("id", info.id);

      if (error) throw error;

      updatePortfolioData({ socialMedia: info });
    } catch (error) {
      console.error("Failed to update social media:", error);
      alert("Failed to update social media. Please try again.");
    }
  };

  return (
    <DataContext.Provider
      value={{
        portfolioData,
        updatePortfolioData,
        updateWebsiteProject,
        addWebsiteProject,
        removeWebsiteProject,
        updateVideoProject,
        addVideoProject,
        removeVideoProject,
        updateBlog,
        addBlog,
        removeBlog,
        updatePersonalInfo,
        updateAboutInfo,
        updateSocialMedia,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("usePortfolioData must be used within a DataProvider");
  }
  return context;
}
