"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticleBackground from "@/components/ui/particle-background";
import BlogDialog from "@/components/ui/blog-dialog";
import Logo from "@/components/ui/logo";
import { usePortfolioData } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import type { BlogPost } from "@/lib/types";

export default function Portfolio() {
    const [mounted, setMounted] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
    const [blogDialogOpen, setBlogDialogOpen] = useState(false);
    const { portfolioData } = usePortfolioData();
    const { session } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Function to get the correct icon component
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case "Github":
                return <Github className="h-5 w-5" />;
            case "Linkedin":
                return <Linkedin className="h-5 w-5" />;
            case "Twitter":
                return <Twitter className="h-5 w-5" />;
            case "Mail":
                return <Mail className="h-5 w-5" />;
            default:
                return <Mail className="h-5 w-5" />;
        }
    };

    const handleBlogClick = (blog: BlogPost) => {
        setSelectedBlog(blog);
        setBlogDialogOpen(true);
    };

    const websiteProjects = portfolioData.websiteProjects;
    const videoProjects = portfolioData.videoProjects;

    return (
        <main className="relative min-h-screen w-full bg-white text-zinc-900">
            {/* Interactive Background */}
            {mounted && <ParticleBackground />}

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
                {/* Navigation */}
                <nav className="mb-16 flex items-center justify-between">
                    <Image
                        src="/layer 3.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="h-32 w-32 hover:-rotate-6 transition-transform hover:scale-105"
                    />
                    <div className="flex gap-6">
                        <Link
                            href="#about"
                            className="text-sm hover:text-zinc-500 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="#work"
                            className="text-sm hover:text-zinc-500 transition-colors"
                        >
                            Work
                        </Link>
                        <Link
                            href="#blog"
                            className="text-sm hover:text-zinc-500 transition-colors"
                        >
                            Blog
                        </Link>
                        <Link
                            href="#contact"
                            className="text-sm hover:text-zinc-500 transition-colors"
                        >
                            Contact
                        </Link>
                        {session ? (
                            <Link
                                href="/admin"
                                className="text-sm font-medium text-rose-600 hover:text-rose-500 transition-colors"
                            >
                                Admin
                            </Link>
                        ) : (
                            <Link
                                href="/admin/login"
                                className="text-sm hover:text-zinc-500 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="mb-24">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 lg:items-center">
                        {/* Left side - Text content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="mb-4 text-4xl lg:text-5xl font-bold">
                                {portfolioData.personalInfo?.username}
                            </h1>
                            <p className="mb-6 text-lg lg:text-xl text-zinc-600 max-w-lg">
                                {portfolioData.personalInfo?.professional_title}
                            </p>
                            <p className="mb-8 text-zinc-600 max-w-lg">
                                {portfolioData.personalInfo?.short_description}
                            </p>

                            {/* Social Media Links */}
                            <div className="flex gap-4 justify-center lg:justify-start">
                                {portfolioData.socialMedia?.github_url && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link
                                            href={portfolioData.socialMedia.github_url}
                                            target="_blank"
                                            aria-label="GitHub"
                                        >
                                            <Github className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {portfolioData.socialMedia?.linkedin_url && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link
                                            href={portfolioData.socialMedia.linkedin_url}
                                            target="_blank"
                                            aria-label="LinkedIn"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {portfolioData.socialMedia?.twitter_url && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link
                                            href={portfolioData.socialMedia.twitter_url}
                                            target="_blank"
                                            aria-label="Twitter"
                                        >
                                            <Twitter className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {portfolioData.socialMedia?.email_url && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link
                                            href={`mailto:${portfolioData.socialMedia.email_url}`}
                                            aria-label="Email"
                                        >
                                            <Mail className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Right side - Square photo */}
                        <div className="flex-shrink-0">
                            <div className="relative w-64 h-64 lg:w-80 lg:h-80 overflow-hidden rounded-lg border-4 border-white shadow-lg hover:rotate-6 transition-transform hover:scale-105">
                                <Image
                                    src={
                                        portfolioData.personalInfo?.profile_image_url ||
                                        "/placeholder.svg"
                                    }
                                    alt="Profile Picture"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="mb-24">
                    <h2 className="mb-6 text-2xl font-semibold">About Me</h2>
                    {portfolioData.aboutInfo?.about_text
                        .split("\n\n")
                        .map((paragraph, index) => (
                            <p key={index} className="mb-4 text-zinc-600">
                                {paragraph}
                            </p>
                        ))}
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                        asChild
                    >
                        <Link
                            href={portfolioData.aboutInfo?.resume_url || "#"}
                            target="_blank"
                        >
                            <FileText className="h-4 w-4" />
                            View Resume
                        </Link>
                    </Button>
                </section>

                {/* Work Section */}
                <section id="work" className="mb-24">
                    <h2 className="mb-6 text-2xl font-semibold">Selected Work</h2>

                    <Tabs defaultValue="websites" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="websites">Websites</TabsTrigger>
                            <TabsTrigger value="videos">Videos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="websites">
                            <div className="grid gap-8 md:grid-cols-2">
                                {websiteProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="group overflow-hidden rounded-lg  transition-all hover:shadow-md"
                                    >
                                        <div className="relative h-48 w-full bg-zinc-100">
                                            <Image
                                                src={project.image_url || "/placeholder.svg"}
                                                alt={project.project_title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="mb-2 text-lg font-medium">
                                                {project.project_title}
                                            </h3>
                                            <p className="mb-4 text-sm text-zinc-600">
                                                {project.project_description}
                                            </p>
                                            <Link
                                                href={project.project_url}
                                                className="text-sm font-medium hover:underline"
                                            >
                                                View Project →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="videos">
                            <div className="grid gap-8 md:grid-cols-2">
                                {videoProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="group overflow-hidden rounded-lg transition-all hover:shadow-md"
                                    >
                                        <div className="relative h-48 w-full bg-zinc-100">
                                            <Image
                                                src={project.thumbnail_url || "/placeholder.svg"}
                                                alt={project.project_title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="mb-2 text-lg font-medium">
                                                {project.project_title}
                                            </h3>
                                            <p className="mb-4 text-sm text-zinc-600">
                                                {project.project_description}
                                            </p>
                                            <Link
                                                href={project.video_url}
                                                className="text-sm font-medium hover:underline"
                                            >
                                                Watch Video →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* Blog Section */}
                <section id="blog" className="mb-24 border-b border-zinc-200">
                    <h2 className="mb-6 text-2xl font-semibold">Blog</h2>
                    <div className="space-y-4">
                        {portfolioData.blogPosts.map((blog) => (
                            <div
                                key={blog.id}
                                className="cursor-pointer rounded-lg p-4 transition-all hover:shadow-md hover:border-zinc-300"
                                onClick={() => handleBlogClick(blog)}
                            >
                                <h3 className="text-lg font-medium hover:text-zinc-600 transition-colors">
                                    {blog.blog_title}
                                </h3>
                                <p className="text-sm text-zinc-500 mt-1">
                                    {new Date(blog.creation_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="mb-16 text-center ">
                    <h2 className="mb-6 text-2xl font-semibold">Get In Touch</h2>
                    <p className="mb-8 text-zinc-600">
                        Have a project in mind or just want to chat? Feel free to reach out.
                    </p>
                    <Button asChild>
                        <Link
                            href={`mailto:${portfolioData.socialMedia?.email_url || "hello@example.com"}`}
                        >
                            Say Hello
                        </Link>
                    </Button>
                </section>

                {/* Footer */}
                <footer className="mt-24 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500">
                    <p>
                        © {new Date().getFullYear()} {portfolioData.personalInfo?.username}. All rights
                        reserved.
                    </p>
                </footer>
            </div>

            {/* Blog Dialog */}
            <BlogDialog
                blog={selectedBlog}
                open={blogDialogOpen}
                onOpenChange={setBlogDialogOpen}
            />
        </main>
    );
}
