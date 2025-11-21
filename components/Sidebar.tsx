import React, { useState } from 'react';
import { PenTool, RefreshCw, Globe, Settings, Sparkles, Palette, PaintBucket, ShoppingBag, Plus, Trash2, X, Menu } from 'lucide-react';
import { ArticleParams, GenerationStatus } from '../types';

interface SidebarProps {
  params: ArticleParams;
  setParams: React.Dispatch<React.SetStateAction<ArticleParams>>;
  onGenerate: () => void;
  status: GenerationStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({ params, setParams, onGenerate, status }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleChange = (field: keyof ArticleParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const isGenerating = status === GenerationStatus.GENERATING;

  // Affiliate Product Handlers
  const addProduct = () => {
    setParams(prev => ({
      ...prev,
      products: [...prev.products, { name: '', url: '' }]
    }));
  };

  const removeProduct = (index: number) => {
    setParams(prev => {
      const newProducts = [...prev.products];
      newProducts.splice(index, 1);
      return { ...prev, products: newProducts };
    });
  };

  const updateProduct = (index: number, field: 'name' | 'url', value: string) => {
    setParams(prev => {
      const newProducts = [...prev.products];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return { ...prev, products: newProducts };
    });
  };

  const SidebarContent = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-2.5 rounded-xl shadow-md">
            <PenTool size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">BloggerGen</h1>
            <p className="text-xs text-slate-500 font-medium">AI Content Engine</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Article Topic
          </label>
          <input 
            type="text" 
            value={params.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="e.g., Ternak Lele Pemula"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles size={12} className="text-yellow-500"/> Target Keyword (SEO)
          </label>
          <input 
            type="text" 
            value={params.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            placeholder="e.g., tips ternak lele"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
          />
        </div>

        {/* Affiliate Products Section */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-3 flex items-center gap-1">
            <ShoppingBag size={14}/> Affiliate Injection (Shopee)
          </label>
          
          <div className="space-y-3">
            {params.products.map((product, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-orange-200 relative group">
                <button 
                  onClick={() => removeProduct(idx)}
                  className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <input 
                  type="text" 
                  placeholder="Nama Produk"
                  value={product.name}
                  onChange={(e) => updateProduct(idx, 'name', e.target.value)}
                  className="w-full text-sm p-2 border-b border-slate-100 focus:border-orange-500 focus:outline-none mb-2"
                />
                <input 
                  type="text" 
                  placeholder="Link Affiliate (https://...)"
                  value={product.url}
                  onChange={(e) => updateProduct(idx, 'url', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 rounded text-slate-600 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={addProduct}
            className="w-full mt-3 py-2 bg-white border border-dashed border-orange-300 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 flex items-center justify-center gap-1 transition-colors"
          >
            <Plus size={14}/> Add Product Link
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Globe size={12}/> Location
            </label>
            <select 
              value={params.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="Indonesia">Indonesia</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Global">Global / General</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Settings size={12}/> Writing Style
            </label>
            <select 
              value={params.style}
              onChange={(e) => handleChange('style', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="Storytelling">Viral Story</option>
              <option value="Academic">Academic/Deep</option>
              <option value="Listicle">Listicle (Top 10)</option>
              <option value="Review">Product Review</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Palette size={12}/> CSS Visual Style
          </label>
          <select 
            value={params.visualStyle}
            onChange={(e) => handleChange('visualStyle', e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-orange-500 focus:outline-none font-medium"
          >
            <option value="AsriStyle">✨ Asri Style (New)</option>
            <option value="Minimalist">Minimalist Modern</option>
            <option value="Corporate">Corporate Professional</option>
            <option value="Warm">Warm Editorial</option>
            <option value="Vibrant">Vibrant & Bold</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <PaintBucket size={12}/> Text Color
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <input 
                  type="color" 
                  value={params.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-none"
                />
                <span className="text-xs text-slate-600 font-mono">{params.textColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <PaintBucket size={12}/> Bg Color
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <input 
                  type="color" 
                  value={params.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-none"
                />
                <span className="text-xs text-slate-600 font-mono">{params.backgroundColor}</span>
              </div>
            </div>
        </div>

          <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Tone of Voice
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Persuasive', 'Informative', 'Witty', 'Empathetic'].map((t) => (
              <button
                key={t}
                onClick={() => handleChange('tone', t)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-all border ${
                  params.tone === t 
                  ? 'bg-orange-50 border-orange-200 text-orange-700' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            setIsMobileOpen(false);
            onGenerate();
          }}
          disabled={isGenerating || !params.topic}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-4
            ${isGenerating || !params.topic
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 hover:scale-[1.02] active:scale-95'}
          `}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              Synthesizing...
            </>
          ) : (
            <>
              <PenTool size={18} />
              Generate Article
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-4 rounded-full shadow-xl hover:bg-orange-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay / Drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
        <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%]">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <SidebarContent />
      </div>
    </>
  );
};