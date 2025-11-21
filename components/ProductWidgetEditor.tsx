
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Image as ImageIcon, Loader2, Check, Edit2, Sparkles, Plus, Trash2, 
  LayoutGrid, List, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, X, Save
} from 'lucide-react';
import { ProductItem } from '../types';
import { generateProductMetadata } from '../services/geminiService';

interface ProductWidgetEditorProps {
  initialItems: ProductItem[];
  onSave: (items: ProductItem[], html: string) => void;
  onClose: () => void;
}

const ProductWidgetEditor: React.FC<ProductWidgetEditorProps> = ({ initialItems, onSave, onClose }) => {
  const [items, setItems] = useState<ProductItem[]>(
    initialItems.length > 0 ? initialItems : [{
      id: Date.now(),
      title: '',
      description: '',
      image: '',
      url: '',
      cta_text: '', 
      site_name: '',
      type: 'website'
    }]
  );

  const [cardStyle, setCardStyle] = useState<'vertical' | 'horizontal'>('vertical');
  const [gridCols, setGridCols] = useState(1);
  const [aiLoading, setAiLoading] = useState<number | null>(null); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length > 1 && gridCols === 1 && cardStyle === 'vertical') {
        setGridCols(2);
    }
  }, [items.length]);

  const getBrandInfo = (url: string) => {
      const safeUrl = url || 'https://example.com';
      let host = '';
      try { host = new URL(safeUrl).hostname.toLowerCase(); } catch(e) {}
      
      if (host.includes('shopee')) return { color: '#ee4d2d', text: 'SHOPEE', btnText: 'Buka Shopee' };
      if (host.includes('tokopedia')) return { color: '#42b549', text: 'TOKOPEDIA', btnText: 'Buka Tokopedia' };
      if (host.includes('tiktok')) return { color: '#000000', text: 'TIKTOK', btnText: 'Buka TikTok' };
      if (host.includes('youtube')) return { color: '#ff0000', text: 'VIDEO', btnText: 'Tonton Sekarang' };
      if (host.includes('instagram')) return { color: '#d62976', text: 'INSTAGRAM', btnText: 'Buka Instagram' };
      if (host.includes('whatsapp')) return { color: '#25D366', text: 'WHATSAPP', btnText: 'Chat Sekarang' };
      
      return { color: '#64748b', text: 'REKOMENDASI', btnText: 'Cek Detail' };
  }

  const addItem = () => {
    setItems([...items, {
        id: Date.now(),
        title: '', description: '', image: '', url: '', cta_text: '', site_name: '', type: 'website'
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
        setItems([{ ...items[0], title: '', description: '', image: '', url: '', cta_text: '' }]);
        return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof ProductItem, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleAutoAI = async (index: number) => {
    const currentItem = items[index];
    if (!currentItem.title) {
        setError(`Isi judul produk ke-${index + 1} dulu.`);
        return;
    }
    setAiLoading(index);
    setError(null);
    try {
        const data = await generateProductMetadata(currentItem.title);
        const newItems = [...items];
        newItems[index].description = data.description;
        newItems[index].cta_text = data.cta_label;
        setItems(newItems);
    } catch (err) {
        setError("Gagal generate AI.");
    } finally {
        setAiLoading(null);
    }
  };

  const generateMasterCode = () => {
    const uid = `smart-embed-${Math.floor(Math.random() * 10000)}`;
    const mobileCss = cardStyle === 'horizontal' ? `
    .${uid}-card { flex-direction: row !important; align-items: stretch; min-height: 100px; }
    .${uid}-image-box { width: 110px !important; min-width: 110px !important; aspect-ratio: 1/1 !important; height: auto !important; }
    .${uid}-content { padding: 10px 12px !important; }
    .${uid}-title { font-size: 14px !important; margin-bottom: 4px !important; line-height: 1.3 !important; }
    .${uid}-desc { font-size: 11px !important; -webkit-line-clamp: 2 !important; line-height: 1.4 !important; margin-bottom: 6px !important; }
    .${uid}-btn { font-size: 11px !important; }
    ` : `
    .${uid}-card { flex-direction: column !important; }
    .${uid}-image-box { width: 100% !important; aspect-ratio: 1.91/1 !important; }
    `;
    
    const css = `<style>.${uid}-container{display:grid;grid-template-columns:${gridCols === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'};gap:20px;margin:30px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.${uid}-card{display:flex;flex-direction:${cardStyle === 'vertical' ? 'column' : 'row'};background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);transition:transform 0.2s ease,box-shadow 0.2s ease}.${uid}-card:hover{transform:translateY(-3px);box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)}.${uid}-image-box{position:relative;width:${cardStyle === 'vertical' ? '100%' : '160px'};min-width:${cardStyle === 'vertical' ? '100%' : '160px'};aspect-ratio:${cardStyle === 'vertical' ? '1.91/1' : '1/1'};background:#f1f5f9}.${uid}-img{width:100%;height:100%;object-fit:cover;display:block}.${uid}-content{padding:16px;display:flex;flex-direction:column;justify-content:space-between;flex:1}.${uid}-text-wrap{width:100%;margin-bottom:8px}.${uid}-tag{position:absolute;bottom:0;left:0;width:100%;color:white;font-size:10px;font-weight:700;padding:4px 0;text-align:center;text-transform:uppercase;letter-spacing:0.5px;z-index:2}.${uid}-title{margin:0 0 6px 0;font-size:16px;font-weight:700;color:#1e293b;line-height:1.4}.${uid}-desc{margin:0;font-size:13px;color:#64748b;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.${uid}-btn{display:inline-block;margin-left:auto;font-size:12px;font-weight:700;text-transform:uppercase;text-decoration:none;transition:opacity 0.2s;margin-top:auto}.${uid}-btn:hover{opacity:0.7;text-decoration:underline}@media(max-width:480px){${mobileCss}}</style>`;

    let htmlItems = '';
    items.forEach(item => {
        const brand = getBrandInfo(item.url);
        const label = item.cta_text || brand.text;
        htmlItems += `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="${uid}-card">
          <div class="${uid}-image-box">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="${uid}-img"/>` : ''}
            <div class="${uid}-tag" style="background-color:${brand.color}">${label}</div>
          </div>
          <div class="${uid}-content">
            <div class="${uid}-text-wrap">
              <h3 class="${uid}-title">${item.title || 'Judul Produk'}</h3>
              <p class="${uid}-desc">${item.description || 'Deskripsi produk...'}</p>
            </div>
            <div class="${uid}-btn" style="color:${brand.color}">${brand.btnText} &rarr;</div>
          </div>
        </a>`;
    });

    return `<!-- SMART EMBED -->${css}<div class="${uid}-container">${htmlItems}</div><!-- END EMBED -->`;
  };

  const handleSave = () => {
    const html = generateMasterCode();
    onSave(items, html);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-50 w-full max-w-[95vw] xl:max-w-[1400px] h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-orange-500"/> Smart Product Widget
            </h2>
            <p className="text-xs text-slate-500">Desain widget produk afiliasi yang responsif dan cantik.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg flex items-center gap-2">
              <Save size={18}/> Save & Use Widget
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* LEFT: EDITOR */}
          <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 overflow-y-auto p-6 custom-scrollbar">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Edit2 size={16}/> Daftar Produk ({items.length})
                </h3>
                <button onClick={addItem} className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
                  <Plus size={14}/> Tambah
                </button>
             </div>

             <div className="space-y-4">
               {items.map((item, idx) => (
                 <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group hover:border-blue-300 transition-colors">
                    <button onClick={() => removeItem(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                    
                    <div className="space-y-3">
                      <input 
                        className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Nama Produk (Wajib)"
                        value={item.title}
                        onChange={(e) => handleInputChange(idx, 'title', e.target.value)}
                      />
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Deskripsi</span>
                          <button 
                            onClick={() => handleAutoAI(idx)}
                            disabled={aiLoading === idx || !item.title}
                            className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-purple-200 disabled:opacity-50"
                          >
                            {aiLoading === idx ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Auto AI
                          </button>
                        </div>
                        <textarea 
                          className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none min-h-[60px]"
                          placeholder="Deskripsi singkat..."
                          value={item.description}
                          onChange={(e) => handleInputChange(idx, 'description', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input className="p-2 text-xs border rounded" placeholder="Image URL..." value={item.image} onChange={(e) => handleInputChange(idx, 'image', e.target.value)}/>
                        <input className="p-2 text-xs border rounded" placeholder="Affiliate Link..." value={item.url} onChange={(e) => handleInputChange(idx, 'url', e.target.value)}/>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="flex-1 bg-slate-100 p-8 overflow-y-auto custom-scrollbar flex flex-col">
             {/* Toolbar */}
             <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center mb-6 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                   <span className="text-xs font-bold text-slate-400 uppercase">Style:</span>
                   <div className="flex bg-slate-100 rounded-lg p-1">
                      <button onClick={() => setCardStyle('vertical')} className={`p-1.5 rounded ${cardStyle === 'vertical' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><AlignVerticalJustifyCenter size={16}/></button>
                      <button onClick={() => setCardStyle('horizontal')} className={`p-1.5 rounded ${cardStyle === 'horizontal' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><AlignHorizontalJustifyCenter size={16}/></button>
                   </div>
                </div>
                {items.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Grid:</span>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setGridCols(1)} className={`p-1.5 rounded ${gridCols === 1 ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><List size={16}/></button>
                        <button onClick={() => setGridCols(2)} className={`p-1.5 rounded ${gridCols === 2 ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={16}/></button>
                    </div>
                  </div>
                )}
                {error && <div className="text-xs text-red-500 font-bold flex items-center gap-1 ml-auto"><AlertCircle size={14}/> {error}</div>}
             </div>

             {/* PREVIEW CANVAS */}
             <div style={{
                 display: 'grid',
                 gridTemplateColumns: gridCols === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                 gap: '20px',
                 maxWidth: '1000px',
                 margin: '0 auto',
                 width: '100%'
             }}>
                {items.map(item => {
                   const brand = getBrandInfo(item.url);
                   const label = item.cta_text || brand.text;
                   return (
                     <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                          style={{ display: 'flex', flexDirection: cardStyle === 'vertical' ? 'column' : 'row' }}>
                        <div style={{
                            position: 'relative',
                            width: cardStyle === 'vertical' ? '100%' : '160px',
                            minWidth: cardStyle === 'vertical' ? '100%' : '160px',
                            aspectRatio: cardStyle === 'vertical' ? '1.91/1' : '1/1',
                            backgroundColor: '#f1f5f9'
                        }}>
                           {item.image ? (
                             <img src={item.image} className="w-full h-full object-cover"/>
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32}/></div>
                           )}
                           <div className="absolute bottom-0 left-0 w-full text-white text-[10px] px-2 py-1 font-bold text-center uppercase" style={{backgroundColor: brand.color}}>
                             {label}
                           </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between items-start flex-1">
                           <div className="mb-3 w-full">
                             <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-2 line-clamp-2">{item.title || 'Judul Produk'}</h4>
                             <p className="text-slate-500 text-[13px] line-clamp-2 leading-relaxed">{item.description || 'Deskripsi akan muncul di sini...'}</p>
                           </div>
                           <div className="mt-auto text-xs font-bold uppercase tracking-wide ml-auto" style={{color: brand.color}}>
                             {brand.btnText} &rarr;
                           </div>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductWidgetEditor;
