"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BlogPost } from "@/lib/types";

interface BlogDialogProps {
  blog: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BlogDialog({
  blog,
  open,
  onOpenChange,
}: BlogDialogProps) {
  if (!blog) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-[95vw] md:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">
            {blog.blog_title}
          </DialogTitle>
          <p className="text-sm text-zinc-500 mb-4">
            {formatDate(blog.creation_date)}
          </p>
        </DialogHeader>
        <div className="prose prose-zinc max-w-none">
          {blog.blog_content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-zinc-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
