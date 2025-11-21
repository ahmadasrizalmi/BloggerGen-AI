
import React, { useState } from 'react';
import { Layout, Code, Copy, Check, AlertTriangle, Type } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import ProductWidgetEditor from './components/ProductWidgetEditor';
import { ArticleParams, GenerationStatus, ToastMessage, ProductItem } from './types';
import { generateBlogContent } from './services/geminiService';

const App = () => {
  // --- STATE ---
  const [params, setParams] = useState<ArticleParams>({
    topic: '',
    location: 'Indonesia',
    tone: 'Persuasive',
    style: 'Storytelling',
    keyword: '',
    visualStyle: 'AsriStyle', 
    textColor: '#333333',
    backgroundColor: '#ffffff',
    productWidgetHtml: '',
    productWidgetItems: [] 
  });

  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);

  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // --- HANDLERS ---
  const handleGenerate = async () => {
    if (!params.topic.trim()) {
      showToast('error', 'Please enter a topic to proceed.');
      return;
    }
    setStatus(GenerationStatus.GENERATING);
    setGeneratedTitle('');
    setGeneratedHtml(''); 

    try {
      const result = await generateBlogContent(params);
      setGeneratedTitle(result.title);
      setGeneratedHtml(result.htmlBody);
      setStatus(GenerationStatus.SUCCESS);
      showToast('success', 'Content generated successfully!');
    } catch (error: any) {
      setStatus(GenerationStatus.ERROR);
      showToast('error', error.message || 'Failed to generate content.');
    }
  };

  const handleSaveWidget = (items: ProductItem[], html: string) => {
    setParams(prev => ({
      ...prev,
      productWidgetItems: items,
      productWidgetHtml: html
    }));
    showToast('success', 'Affiliate widget updated!');
  };

  const showToast = (type: ToastMessage['type'], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const copyTitle = () => {
    if (!generatedTitle) return;
    navigator.clipboard.writeText(generatedTitle);
    showToast('success', 'Title copied!');
  }

  const copyFormatted = async () => {
    if (!generatedHtml) return;
    try {
      const blob = new Blob([generatedHtml], { type: 'text/html' });
      const textBlob = new Blob([generatedHtml], { type: 'text/plain' });
      const item = new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob });
      await navigator.clipboard.write([item]);
      showToast('success', 'Visual body copied!');
    } catch (err) {
      navigator.clipboard.writeText(generatedHtml);
      showToast('info', 'HTML copied (Fallback)');
    }
  };

  const copyHTMLCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    showToast('success', 'Raw HTML code copied!');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium animate-fade-in-up ${
          toast.type === 'error' ? 'bg-red-600 text-white' :
          toast.type === 'success' ? 'bg-emerald-600 text-white' :
          'bg-slate-800 text-white'
        }`}>
          {toast.type === 'success' && <Check size={16}/>}
          {toast.type === 'error' && <AlertTriangle size={16}/>}
          {toast.text}
        </div>
      )}

      {/* WIDGET EDITOR MODAL */}
      {isWidgetEditorOpen && (
        <ProductWidgetEditor 
          initialItems={params.productWidgetItems}
          onSave={handleSaveWidget}
          onClose={() => setIsWidgetEditorOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CONTROLS */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Sidebar 
              params={params}
              setParams={setParams}
              onGenerate={handleGenerate}
              status={status}
              onOpenWidgetEditor={() => setIsWidgetEditorOpen(true)}
            />
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Title Section */}
            {status === GenerationStatus.SUCCESS && generatedTitle && (
               <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4">
                 <div className="flex-1">
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Type size={12}/> SEO Title</div>
                   <div className="text-lg font-bold text-slate-800">{generatedTitle}</div>
                 </div>
                 <button onClick={copyTitle} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Copy Title Only"><Copy size={18}/></button>
               </div>
            )}

            {/* Content Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-grow min-h-[600px]">
               {/* Toolbar */}
              <div className="border-b border-slate-200 flex flex-wrap items-center justify-between px-4 py-3 bg-slate-50/50">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'preview' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><Layout size={16}/> Visual</button>
                  <button onClick={() => setActiveTab('html')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'html' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><Code size={16}/> Source</button>
                </div>
                <div className="flex gap-3 mt-3 sm:mt-0">
                   {generatedHtml && (
                     <>
                       <button onClick={copyFormatted} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95"><Copy size={14}/> Copy Visual</button>
                       <button onClick={copyHTMLCode} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10 active:scale-95"><Code size={14}/> Copy HTML</button>
                     </>
                   )}
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-grow relative p-0">
                {status === GenerationStatus.IDLE && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100"><Layout size={40} className="text-slate-300"/></div>
                    <h3 className="font-semibold text-slate-600">Ready to Write</h3>
                    <p className="text-sm mt-2 text-slate-500">Setup your Affiliate Widget first to auto-monetize.</p>
                  </div>
                )}
                {status === GenerationStatus.GENERATING && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-white/80 z-10 backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="font-medium text-slate-600 animate-pulse">Generating Content & Images...</p>
                   </div>
                )}
                {status === GenerationStatus.ERROR && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-8 text-center">
                    <AlertTriangle size={40} className="mb-4" />
                    <p>Oops! Generation failed.</p>
                  </div>
                )}
                {status === GenerationStatus.SUCCESS && generatedHtml && (
                  <div className="h-full overflow-y-auto custom-scrollbar p-8 bg-white">
                    {activeTab === 'preview' ? (
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                    ) : (
                      <pre className="text-xs font-mono bg-slate-900 text-green-400 p-6 rounded-xl overflow-x-auto whitespace-pre-wrap break-all">{generatedHtml}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-slate-400 text-xs font-medium border-t border-slate-200 mt-auto bg-white">
        <p>Powered by BloggerGen AI Engine</p>
        <p className="mt-1 text-slate-500 font-bold">ahmadasri.web.id</p>
      </footer>
    </div>
  );
};

export default App;
