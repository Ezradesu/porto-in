"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/ui/admin-layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePortfolioData } from "@/lib/data";
import type { WebsiteProject, VideoProject, BlogPost, SocialMedia } from "@/lib/types";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
export default function AdminDashboard() {
    const {
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
    } = usePortfolioData();

    const [newProject, setNewProject] = useState<Omit<WebsiteProject, "id" | "user_id" | "created_at" | "updated_at">>({
        project_title: "",
        project_description: "",
        image_url: "/placeholder.svg?height=192&width=384",
        project_url: "#",
    });

    const [newVideoProject, setNewVideoProject] = useState<Omit<VideoProject, "id" | "user_id" | "created_at" | "updated_at">>({
        project_title: "",
        project_description: "",
        thumbnail_url: "/placeholder.svg?height=192&width=384",
        video_url: "#",
    });

    const [newBlog, setNewBlog] = useState<Omit<BlogPost, "id" | "user_id" | "created_at" | "updated_at">>({
        blog_title: "",
        blog_content: "",
        creation_date: new Date().toISOString().split("T")[0],
    });

    const handlePersonalInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (!portfolioData.personalInfo) return;

        updatePersonalInfo({
            ...portfolioData.personalInfo,
            username: formData.get("name") as string,
            professional_title: formData.get("title") as string,
            short_description: formData.get("description") as string,
            profile_image_url: formData.get("profileImage") as string,
        });
        toast.success("Personal information updated successfully!");
    };

    const handleAboutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (!portfolioData.aboutInfo) return;

        updateAboutInfo({
            ...portfolioData.aboutInfo,
            about_text: formData.get("about") as string,
            resume_url: formData.get("resume") as string,
        });

        toast.success("About section updated successfully!");
    };

    const handleSocialLinksSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        if (!portfolioData.socialMedia) return;

        const updatedSocial: SocialMedia = {
            ...portfolioData.socialMedia,
            github_url: formData.get("github_url") as string,
            linkedin_url: formData.get("linkedin_url") as string,
            twitter_url: formData.get("twitter_url") as string,
            instagram_url: formData.get("instagram_url") as string,
            email_url: formData.get("email_url") as string,
        };

        updateSocialMedia(updatedSocial);

        toast.success("Social links updated successfully!");
    };

    const handleWebsiteProjectSubmit = (project: WebsiteProject) => {
        updateWebsiteProject(project);
        toast.success("Website project updated successfully!");
    };

    const handleVideoProjectSubmit = (project: VideoProject) => {
        updateVideoProject(project);
        toast.success("Video project updated successfully!");
    };

    const handleAddWebsiteProject = (e: React.FormEvent) => {
        e.preventDefault();
        addWebsiteProject(newProject as any);
        setNewProject({
            project_title: "",
            project_description: "",
            image_url: "/placeholder.svg?height=192&width=384",
            project_url: "#",
        });
        toast.success("New website project added!");
    };

    const handleAddVideoProject = (e: React.FormEvent) => {
        e.preventDefault();
        addVideoProject(newVideoProject as any);
        setNewVideoProject({
            project_title: "",
            project_description: "",
            thumbnail_url: "/placeholder.svg?height=192&width=384",
            video_url: "#",
        });
        toast.success("New video project added!");
    };
    const handleBlogSubmit = (blog: BlogPost) => {
        updateBlog(blog);
        toast.success("Blog updated!");
    };

    const handleAddBlog = (e: React.FormEvent) => {
        e.preventDefault();
        addBlog(newBlog as any);
        setNewBlog({
            blog_title: "",
            blog_content: "",
            creation_date: new Date().toISOString().split("T")[0],
        });
        toast.success("New blog added!");
    };

    const websiteProjects = portfolioData.websiteProjects;
    const videoProjects = portfolioData.videoProjects;

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-zinc-600">Manage your portfolio content</p>
            </div>

            <Tabs defaultValue="personal">
                <TabsList className="mb-6">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="social">Social Links</TabsTrigger>
                    <TabsTrigger value="websites">Websites</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="blogs">Blogs</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your name, title, and profile image
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        defaultValue={portfolioData.personalInfo?.username}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Professional Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        defaultValue={portfolioData.personalInfo?.professional_title}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Short Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        defaultValue={portfolioData.personalInfo?.short_description}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profileImage">Profile Image URL</Label>
                                    <Input
                                        id="profileImage"
                                        name="profileImage"
                                        defaultValue={portfolioData.personalInfo?.profile_image_url}
                                        required
                                    />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Information</CardTitle>
                            <CardDescription>
                                Update your about section and resume link
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAboutSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="about">About Text</Label>
                                    <Textarea
                                        id="about"
                                        name="about"
                                        rows={8}
                                        defaultValue={portfolioData.aboutInfo?.about_text}
                                        placeholder="Write about yourself..."
                                        required
                                    />
                                    <p className="text-xs text-zinc-500">
                                        Use double line breaks for paragraphs
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="resume">Resume URL</Label>
                                    <Input
                                        id="resume"
                                        name="resume"
                                        defaultValue={portfolioData.aboutInfo?.resume_url}
                                        required
                                    />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Links Tab */}
                <TabsContent value="social">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Links</CardTitle>
                            <CardDescription>
                                Update your social media profile URLs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSocialLinksSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="github_url">GitHub URL</Label>
                                    <Input
                                        id="github_url"
                                        name="github_url"
                                        defaultValue={portfolioData.socialMedia?.github_url}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                    <Input
                                        id="linkedin_url"
                                        name="linkedin_url"
                                        defaultValue={portfolioData.socialMedia?.linkedin_url}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_url">Twitter URL</Label>
                                    <Input
                                        id="twitter_url"
                                        name="twitter_url"
                                        defaultValue={portfolioData.socialMedia?.twitter_url}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram_url">Instagram URL</Label>
                                    <Input
                                        id="instagram_url"
                                        name="instagram_url"
                                        defaultValue={portfolioData.socialMedia?.instagram_url}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email_url">Email Address</Label>
                                    <Input
                                        id="email_url"
                                        name="email_url"
                                        defaultValue={portfolioData.socialMedia?.email_url}
                                    />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Websites Tab */}
                <TabsContent value="websites">
                    <div className="space-y-6">
                        {/* Add New Website Project */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Website Project</CardTitle>
                                <CardDescription>
                                    Create a new website project for your portfolio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddWebsiteProject} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-title">Project Title</Label>
                                        <Input
                                            id="new-title"
                                            value={newProject.project_title}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, project_title: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-description">Project Description</Label>
                                        <Textarea
                                            id="new-description"
                                            value={newProject.project_description}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    project_description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-image">Image URL</Label>
                                        <Input
                                            id="new-image"
                                            value={newProject.image_url}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    image_url: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-url">Project URL</Label>
                                        <Input
                                            id="new-url"
                                            value={newProject.project_url}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    project_url: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Website Project
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Existing Website Projects */}
                        <h3 className="text-xl font-semibold mt-8 mb-4">
                            Website Projects
                        </h3>
                        {websiteProjects.map((project) => (
                            <Card key={project.id} className="mb-4">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{project.project_title}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this project?")) {
                                                    removeWebsiteProject(project.id);
                                                    toast.success("Project deleted successfully");
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`title-${project.id}`}>
                                                Project Title
                                            </Label>
                                            <Input
                                                id={`title-${project.id}`}
                                                defaultValue={project.project_title}
                                                onChange={(e) =>
                                                    updateWebsiteProject({ ...project, project_title: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`description-${project.id}`}>
                                                Project Description
                                            </Label>
                                            <Textarea
                                                id={`description-${project.id}`}
                                                defaultValue={project.project_description}
                                                onChange={(e) =>
                                                    updateWebsiteProject({
                                                        ...project,
                                                        project_description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`image-${project.id}`}>Image URL</Label>
                                            <Input
                                                id={`image-${project.id}`}
                                                defaultValue={project.image_url}
                                                onChange={(e) =>
                                                    updateWebsiteProject({
                                                        ...project,
                                                        image_url: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`url-${project.id}`}>Project URL</Label>
                                            <Input
                                                id={`url-${project.id}`}
                                                defaultValue={project.project_url}
                                                onChange={(e) =>
                                                    updateWebsiteProject({
                                                        ...project,
                                                        project_url: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleWebsiteProjectSubmit(project)}
                                        >
                                            Save Changes
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos">
                    <div className="space-y-6">
                        {/* Add New Video Project */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Video Project</CardTitle>
                                <CardDescription>
                                    Create a new video project for your portfolio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddVideoProject} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-video-title">Project Title</Label>
                                        <Input
                                            id="new-video-title"
                                            value={newVideoProject.project_title}
                                            onChange={(e) =>
                                                setNewVideoProject({ ...newVideoProject, project_title: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-video-description">
                                            Project Description
                                        </Label>
                                        <Textarea
                                            id="new-video-description"
                                            value={newVideoProject.project_description}
                                            onChange={(e) =>
                                                setNewVideoProject({
                                                    ...newVideoProject,
                                                    project_description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-video-image">Thumbnail URL</Label>
                                        <Input
                                            id="new-video-image"
                                            value={newVideoProject.thumbnail_url}
                                            onChange={(e) =>
                                                setNewVideoProject({
                                                    ...newVideoProject,
                                                    thumbnail_url: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-video-url">Video URL</Label>
                                        <Input
                                            id="new-video-url"
                                            value={newVideoProject.video_url}
                                            onChange={(e) =>
                                                setNewVideoProject({
                                                    ...newVideoProject,
                                                    video_url: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Video Project
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Existing Video Projects */}
                        <h3 className="text-xl font-semibold mt-8 mb-4">Video Projects</h3>
                        {videoProjects.map((project) => (
                            <Card key={project.id} className="mb-4">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{project.project_title}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "Are you sure you want to delete this project?"
                                                    )
                                                ) {
                                                    removeVideoProject(project.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`video-title-${project.id}`}>
                                                Project Title
                                            </Label>
                                            <Input
                                                id={`video-title-${project.id}`}
                                                defaultValue={project.project_title}
                                                onChange={(e) =>
                                                    updateVideoProject({ ...project, project_title: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`video-description-${project.id}`}>
                                                Project Description
                                            </Label>
                                            <Textarea
                                                id={`video-description-${project.id}`}
                                                defaultValue={project.project_description}
                                                onChange={(e) =>
                                                    updateVideoProject({
                                                        ...project,
                                                        project_description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`video-image-${project.id}`}>
                                                Thumbnail URL
                                            </Label>
                                            <Input
                                                id={`video-image-${project.id}`}
                                                defaultValue={project.thumbnail_url}
                                                onChange={(e) =>
                                                    updateVideoProject({
                                                        ...project,
                                                        thumbnail_url: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`video-url-${project.id}`}>
                                                Video URL
                                            </Label>
                                            <Input
                                                id={`video-url-${project.id}`}
                                                defaultValue={project.video_url}
                                                onChange={(e) =>
                                                    updateVideoProject({
                                                        ...project,
                                                        video_url: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleVideoProjectSubmit(project)}
                                        >
                                            Save Changes
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Blogs Tab */}
                <TabsContent value="blogs">
                    <div className="space-y-6">
                        {/* Add New Blog */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Blog Post</CardTitle>
                                <CardDescription>Create a new blog post</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddBlog} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-blog-title">Blog Title</Label>
                                        <Input
                                            id="new-blog-title"
                                            value={newBlog.blog_title}
                                            onChange={(e) =>
                                                setNewBlog({ ...newBlog, blog_title: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-blog-date">Creation Date</Label>
                                        <Input
                                            id="new-blog-date"
                                            type="date"
                                            value={newBlog.creation_date}
                                            onChange={(e) =>
                                                setNewBlog({ ...newBlog, creation_date: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-blog-content">Blog Content</Label>
                                        <Textarea
                                            id="new-blog-content"
                                            rows={10}
                                            value={newBlog.blog_content}
                                            onChange={(e) =>
                                                setNewBlog({ ...newBlog, blog_content: e.target.value })
                                            }
                                            placeholder="Write your blog content here..."
                                            required
                                        />
                                        <p className="text-xs text-zinc-500">
                                            Use double line breaks for paragraphs
                                        </p>
                                    </div>
                                    <Button type="submit" className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Blog Post
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Existing Blogs */}
                        <h3 className="text-xl font-semibold mt-8 mb-4">Blog Posts</h3>
                        {portfolioData.blogPosts.map((blog) => (
                            <Card key={blog.id} className="mb-4">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{blog.blog_title}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "Are you sure you want to delete this blog post?"
                                                    )
                                                ) {
                                                    removeBlog(blog.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`blog-title-${blog.id}`}>
                                                Blog Title
                                            </Label>
                                            <Input
                                                id={`blog-title-${blog.id}`}
                                                defaultValue={blog.blog_title}
                                                onChange={(e) =>
                                                    updateBlog({ ...blog, blog_title: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`blog-date-${blog.id}`}>
                                                Creation Date
                                            </Label>
                                            <Input
                                                id={`blog-date-${blog.id}`}
                                                type="date"
                                                defaultValue={blog.creation_date}
                                                onChange={(e) =>
                                                    updateBlog({ ...blog, creation_date: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`blog-content-${blog.id}`}>
                                                Blog Content
                                            </Label>
                                            <Textarea
                                                id={`blog-content-${blog.id}`}
                                                rows={10}
                                                defaultValue={blog.blog_content}
                                                onChange={(e) =>
                                                    updateBlog({ ...blog, blog_content: e.target.value })
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleBlogSubmit(blog)}
                                        >
                                            Save Changes
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
