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
  updateWebsiteProject: (project: WebsiteProject) => void;
  addWebsiteProject: (project: Omit<WebsiteProject, "id">) => void;
  removeWebsiteProject: (id: string) => void;
  updateVideoProject: (project: VideoProject) => void;
  addVideoProject: (project: Omit<VideoProject, "id">) => void;
  removeVideoProject: (id: string) => void;
  updateBlog: (blog: BlogPost) => void;
  addBlog: (blog: Omit<BlogPost, "id">) => void;
  removeBlog: (id: string) => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateAboutInfo: (info: AboutInfo) => void;
  updateSocialMedia: (info: SocialMedia) => void;
}

const API_URL = "https://iqdjwjqyvqcudouhsknu.supabase.co/rest/v1";
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

  const updateWebsiteProject = (project: WebsiteProject) => {
    updatePortfolioData({
      websiteProjects: portfolioData.websiteProjects.map((p) =>
        p.id === project.id ? project : p
      ),
    });
  };

  const addWebsiteProject = (project: Omit<WebsiteProject, "id">) => {
    const newProject = { ...project, id: Date.now().toString() };
    updatePortfolioData({
      websiteProjects: [...portfolioData.websiteProjects, newProject],
    });
  };

  const removeWebsiteProject = (id: string) => {
    updatePortfolioData({
      websiteProjects: portfolioData.websiteProjects.filter((p) => p.id !== id),
    });
  };

  const updateVideoProject = (project: VideoProject) => {
    updatePortfolioData({
      videoProjects: portfolioData.videoProjects.map((p) =>
        p.id === project.id ? project : p
      ),
    });
  };

  const addVideoProject = (project: Omit<VideoProject, "id">) => {
    const newProject = { ...project, id: Date.now().toString() };
    updatePortfolioData({
      videoProjects: [...portfolioData.videoProjects, newProject],
    });
  };

  const removeVideoProject = (id: string) => {
    updatePortfolioData({
      videoProjects: portfolioData.videoProjects.filter((p) => p.id !== id),
    });
  };

  const updateBlog = (blog: BlogPost) => {
    updatePortfolioData({
      blogPosts: portfolioData.blogPosts.map((b) =>
        b.id === blog.id ? blog : b
      ),
    });
  };

  const addBlog = (blog: Omit<BlogPost, "id">) => {
    const newBlog = { ...blog, id: Date.now().toString() };
    updatePortfolioData({ blogPosts: [...portfolioData.blogPosts, newBlog] });
  };

  const removeBlog = (id: string) => {
    updatePortfolioData({
      blogPosts: portfolioData.blogPosts.filter((b) => b.id !== id),
    });
  };

  const updatePersonalInfo = (info: PersonalInfo) => {
    updatePortfolioData({ personalInfo: info });
  };

  const updateAboutInfo = (info: AboutInfo) => {
    updatePortfolioData({ aboutInfo: info });
  };

  const updateSocialMedia = (info: SocialMedia) => {
    updatePortfolioData({ socialMedia: info });
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
