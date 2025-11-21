import { BloggerBlog, BloggerPostResult } from "../types";

const BLOGGER_API_BASE = "https://www.googleapis.com/blogger/v3";

export const fetchUserBlogs = async (accessToken: string): Promise<BloggerBlog[]> => {
  try {
    const response = await fetch(`${BLOGGER_API_BASE}/users/self/blogs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blogs. Your session might have expired.");
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Blogger API Error:", error);
    throw error;
  }
};

export const publishPost = async (
  accessToken: string,
  blogId: string,
  title: string,
  content: string,
  labels: string[] = [],
  isDraft: boolean = true
): Promise<BloggerPostResult> => {
  try {
    const body = {
      kind: "blogger#post",
      blog: { id: blogId },
      title: title,
      content: content,
      labels: labels, // Add labels to payload
    };

    const response = await fetch(
      `${BLOGGER_API_BASE}/blogs/${blogId}/posts?isDraft=${isDraft}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Failed to publish post");
    }

    const data = await response.json();
    return {
      id: data.id,
      url: data.url,
      title: data.title,
    };
  } catch (error) {
    console.error("Publish Error:", error);
    throw error;
  }
};