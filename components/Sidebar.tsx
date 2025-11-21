
import React from 'react';
import { PenTool, RefreshCw, Globe, Settings, Sparkles, Palette, PaintBucket, ShoppingBag, Plus, X, Menu, ArrowRight } from 'lucide-react';
import { ArticleParams, GenerationStatus } from '../types';

interface SidebarProps {
  params: ArticleParams;
  setParams: React.Dispatch<React.SetStateAction<ArticleParams>>;
  onGenerate: () => void;
  status: GenerationStatus;
  onOpenWidgetEditor: () => void;
}

interface SidebarFormProps {
  params: ArticleParams;
  handleChange: (field: keyof ArticleParams, value: any) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onCloseMobile?: () => void;
  onOpenWidgetEditor: () => void;
}

const SidebarForm: React.FC<SidebarFormProps> = ({ 
  params, handleChange, isGenerating, onGenerate, onCloseMobile, onOpenWidgetEditor 
}) => {
  const itemCount = params.productWidgetItems?.length || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto custom-scrollbar">
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
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={24} /></button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Article Topic</label>
          <input 
            type="text" 
            value={params.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="e.g., Ternak Lele Pemula"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Sparkles size={12} className="text-yellow-500"/> Target Keyword (SEO)</label>
          <input 
            type="text" 
            value={params.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            placeholder="e.g., tips ternak lele"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* AFFILIATE WIDGET LAUNCHER */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1">
            <ShoppingBag size={14}/> Affiliate Widget (Shopee)
          </label>
          
          {itemCount > 0 ? (
             <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200 shadow-sm mb-2">
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-slate-700">{itemCount} Products Ready</span>
                   <span className="text-[10px] text-slate-400">Widget HTML Generated</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             </div>
          ) : (
             <p className="text-xs text-slate-500 mb-3">No products configured. Add products to monetize this article.</p>
          )}

          <button 
            onClick={onOpenWidgetEditor}
            className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 transition-colors shadow-lg shadow-blue-500/20"
          >
            {itemCount > 0 ? <Settings size={14}/> : <Plus size={14}/>}
            {itemCount > 0 ? 'Edit Widget Config' : 'Setup Product Widget'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Globe size={12}/> Location</label>
            <select value={params.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none">
              <option value="Indonesia">Indonesia</option>
              <option value="United States">United States</option>
              <option value="Global">Global</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Settings size={12}/> Style</label>
            <select value={params.style} onChange={(e) => handleChange('style', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none">
              <option value="Storytelling">Storytelling</option>
              <option value="Listicle">Listicle</option>
              <option value="Review">Review</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Palette size={12}/> Visual Style</label>
          <select value={params.visualStyle} onChange={(e) => handleChange('visualStyle', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none font-medium">
            <option value="AsriStyle">✨ Asri Style (Recommended)</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Corporate">Corporate</option>
            <option value="Warm">Warm</option>
            <option value="Vibrant">Vibrant</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><PaintBucket size={12}/> Text</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <input type="color" value={params.textColor} onChange={(e) => handleChange('textColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none"/>
                <span className="text-[10px] text-slate-600 font-mono">{params.textColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><PaintBucket size={12}/> Bg</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <input type="color" value={params.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none"/>
                <span className="text-[10px] text-slate-600 font-mono">{params.backgroundColor}</span>
              </div>
            </div>
        </div>

        <button 
          onClick={() => { if (onCloseMobile) onCloseMobile(); onGenerate(); }}
          disabled={isGenerating || !params.topic}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4
            ${isGenerating || !params.topic ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 hover:bg-black hover:scale-[1.02] active:scale-95 shadow-orange-500/20'}
          `}
        >
          {isGenerating ? <><RefreshCw className="animate-spin" size={18} /> Synthesizing...</> : <><PenTool size={18} /> Generate Article</>}
        </button>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ params, setParams, onGenerate, status, onOpenWidgetEditor }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const handleChange = (field: keyof ArticleParams, value: any) => setParams(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <button onClick={() => setIsMobileOpen(true)} className="lg:hidden fixed bottom-6 right-6 z-40 bg-orange-600 text-white p-4 rounded-full shadow-xl"><Menu size={24}/></button>
      <div className={`lg:hidden fixed inset-0 z-50 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)}></div>
        <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%]">
          <SidebarForm params={params} handleChange={handleChange} isGenerating={status === GenerationStatus.GENERATING} onGenerate={onGenerate} onCloseMobile={() => setIsMobileOpen(false)} onOpenWidgetEditor={onOpenWidgetEditor}/>
        </div>
      </div>
      <div className="hidden lg:block h-full">
        <SidebarForm params={params} handleChange={handleChange} isGenerating={status === GenerationStatus.GENERATING} onGenerate={onGenerate} onOpenWidgetEditor={onOpenWidgetEditor}/>
      </div>
    </>
  );
};
