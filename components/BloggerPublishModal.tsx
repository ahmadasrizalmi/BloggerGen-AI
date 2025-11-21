import React, { useState, useEffect } from 'react';
import { Send, X, Globe, CheckCircle, AlertCircle, Loader2, LogIn, Edit3, Tag } from 'lucide-react';
import { BloggerBlog } from '../types';
import { fetchUserBlogs, publishPost } from '../services/bloggerService';

declare global {
  interface Window {
    google: any;
  }
}

interface BloggerPublishModalProps {
  title: string;
  content: string;
  onClose: () => void;
  clientId: string;
}

const BloggerPublishModal: React.FC<BloggerPublishModalProps> = ({ title, content, onClose, clientId }) => {
  const [step, setStep] = useState<'login' | 'select' | 'publishing' | 'success'>('login');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BloggerBlog[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<string>('');
  
  // Local state for Inputs
  const [postTitle, setPostTitle] = useState(title);
  const [postLabels, setPostLabels] = useState(''); // Comma separated string
  
  const [isDraft, setIsDraft] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  // Update local title if prop changes
  useEffect(() => {
    setPostTitle(title);
  }, [title]);

  // Initialize Google OAuth Client
  useEffect(() => {
    if (!accessToken && window.google) {
      // Client ready
    }
  }, [accessToken]);

  const handleGoogleLogin = () => {
    setError(null);
    
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/blogger',
      callback: async (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          setAccessToken(tokenResponse.access_token);
          loadBlogs(tokenResponse.access_token);
        } else {
          setError("Login failed or permission denied.");
        }
      },
    });

    client.requestAccessToken();
  };

  const loadBlogs = async (token: string) => {
    try {
      const userBlogs = await fetchUserBlogs(token);
      if (userBlogs.length === 0) {
        setError("No blogs found associated with this account.");
        return;
      }
      setBlogs(userBlogs);
      setSelectedBlogId(userBlogs[0].id);
      setStep('select');
    } catch (err: any) {
      setError(err.message || "Failed to load blogs.");
    }
  };

  const handlePublish = async () => {
    if (!selectedBlogId || !accessToken) return;
    if (!postTitle.trim()) {
      setError("Post title cannot be empty.");
      return;
    }

    setStep('publishing');
    setError(null);

    try {
      // Parse Labels: Split by comma, trim whitespace, remove empty strings
      const labelArray = postLabels.split(',').map(l => l.trim()).filter(l => l.length > 0);

      // Use postTitle (editable) instead of title (prop)
      const result = await publishPost(accessToken, selectedBlogId, postTitle, content, labelArray, isDraft);
      setPublishedUrl(result.url);
      setStep('success');
    } catch (err: any) {
      setStep('select');
      setError(err.message || "Publishing failed.");
    }
  };

  // Helper to render label preview
  const renderLabelPreview = () => {
    const tags = postLabels.split(',').map(l => l.trim()).filter(l => l.length > 0);
    if (tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up">
        
        {/* HEADER */}
        <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
          <h2 className="font-bold text-orange-800 flex items-center gap-2">
            <Globe size={18} /> Publish to Blogger
          </h2>
          <button onClick={onClose} className="text-orange-400 hover:text-orange-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 'login' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe size={32} />
              </div>
              <p className="text-slate-600 text-sm">
                Connect your Google account to publish this article directly to your Blogspot blog.
              </p>
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <LogIn size={18} /> Connect Blogger
              </button>
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-4">
               {/* Blog Selection */}
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Blog</label>
                 <select 
                   value={selectedBlogId} 
                   onChange={(e) => setSelectedBlogId(e.target.value)}
                   className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
                 >
                   {blogs.map(blog => (
                     <option key={blog.id} value={blog.id}>{blog.name} ({new URL(blog.url).hostname})</option>
                   ))}
                 </select>
               </div>

               {/* Title Editing Field */}
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Edit3 size={12}/> Post Title
                 </label>
                 <input 
                   type="text"
                   value={postTitle}
                   onChange={(e) => setPostTitle(e.target.value)}
                   className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-semibold text-slate-700"
                   placeholder="Enter post title..."
                 />
               </div>

               {/* Labels Field */}
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Tag size={12}/> Labels (Tags)
                 </label>
                 <input 
                   type="text"
                   value={postLabels}
                   onChange={(e) => setPostLabels(e.target.value)}
                   className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm text-slate-700"
                   placeholder="Separated by commas (e.g. Tips, SEO, Viral)"
                 />
                 {renderLabelPreview()}
               </div>

               {/* Draft Toggle */}
               <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                 <input 
                   type="checkbox" 
                   id="draftMode" 
                   checked={isDraft} 
                   onChange={(e) => setIsDraft(e.target.checked)}
                   className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                 />
                 <label htmlFor="draftMode" className="text-sm text-slate-700 font-medium cursor-pointer">
                   Save as Draft (Recommended)
                 </label>
               </div>

               <button 
                 onClick={handlePublish}
                 className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
               >
                 <Send size={18} /> Publish Now
               </button>
            </div>
          )}

          {step === 'publishing' && (
            <div className="text-center py-8 space-y-3">
              <Loader2 size={40} className="animate-spin text-orange-500 mx-auto" />
              <p className="text-slate-600 font-medium">Posting to Blogger...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce-short">
                <CheckCircle size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Published Successfully!</h3>
                <p className="text-sm text-slate-500 mt-1">Your article is live (or in drafts).</p>
              </div>
              
              {publishedUrl && (
                 <a 
                   href={publishedUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   className="block w-full py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                 >
                   View Post
                 </a>
              )}
              <button 
                onClick={onClose}
                className="block w-full py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloggerPublishModal;