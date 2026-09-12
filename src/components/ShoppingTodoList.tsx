import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Download,
  X,
  FileText,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { TodoItem } from '../types';

const STORAGE_KEY = 'bazaar_todo_list_v1';

export const CATEGORIES: TodoItem['category'][] = [
  'Sebze',
  'Meyve',
  'Yeşillik',
  'Şarküteri',
  'Kuru Gıda',
  'Diğer',
];

// Rich presets categorized specifically
export const CATEGORY_PRESETS: Record<TodoItem['category'], { text: string; defaultQty: string }[]> = {
  Sebze: [
    { text: 'Domates', defaultQty: '2 kg' },
    { text: 'Salkım Domates', defaultQty: '1 kg' },
    { text: 'Çeri Domates', defaultQty: '500 g' },
    { text: 'Pembe Domates', defaultQty: '1 kg' },
    { text: 'Salatalık', defaultQty: '1 kg' },
    { text: 'Çengelköy Salatalık', defaultQty: '1 kg' },
    { text: 'Sivri Biber', defaultQty: '500 g' },
    { text: 'Köy Biberi', defaultQty: '500 g' },
    { text: 'Kapya Biber', defaultQty: '1 kg' },
    { text: 'Dolmalık Biber', defaultQty: '500 g' },
    { text: 'Çarliston Biber', defaultQty: '500 g' },
    { text: 'Patlıcan', defaultQty: '1 kg' },
    { text: 'Kemer Patlıcan', defaultQty: '1 kg' },
    { text: 'Bostan Patlıcan', defaultQty: '1 kg' },
    { text: 'Sakız Kabak', defaultQty: '1 kg' },
    { text: 'Patates', defaultQty: '3 kg' },
    { text: 'Taze Patates', defaultQty: '2 kg' },
    { text: 'Kuru Soğan', defaultQty: '2 kg' },
    { text: 'Arpacık Soğan', defaultQty: '500 g' },
    { text: 'Taze Soğan', defaultQty: '2 demet' },
    { text: 'Taze Fasulye', defaultQty: '1 kg' },
    { text: 'Çalı Fasulye', defaultQty: '1 kg' },
    { text: 'Barbunya', defaultQty: '1 kg' },
    { text: 'Bezelye', defaultQty: '1 kg' },
    { text: 'Bamya', defaultQty: '500 g' },
    { text: 'Karnabahar', defaultQty: '1 adet' },
    { text: 'Brokoli', defaultQty: '1 adet' },
    { text: 'Beyaz Lahana', defaultQty: '1 adet' },
    { text: 'Kırmızı Lahana', defaultQty: '1 adet' },
    { text: 'Pırasa', defaultQty: '1 kg' },
    { text: 'Ispanak', defaultQty: '1 kg' },
    { text: 'Kereviz', defaultQty: '1 kg' },
    { text: 'Enginar', defaultQty: '4 adet' },
    { text: 'Havuç', defaultQty: '1 kg' },
    { text: 'Turp', defaultQty: '1 demet' },
    { text: 'Sarımsak', defaultQty: '250 g' },
    { text: 'Taşköprü Sarımsak', defaultQty: '500 g' },
    { text: 'Mantar', defaultQty: '500 g' },
    { text: 'Süt Mısır', defaultQty: '4 adet' },
    { text: 'Bal Kabağı', defaultQty: '1 dilim' },
  ],
  Meyve: [
    { text: 'Limon', defaultQty: '1 kg' },
    { text: 'Elma (Amasya)', defaultQty: '1.5 kg' },
    { text: 'Elma (Granny Smith)', defaultQty: '1 kg' },
    { text: 'Muz (Yerli Anamur)', defaultQty: '1 kg' },
    { text: 'Portakal (Sıkmalık)', defaultQty: '2 kg' },
    { text: 'Mandalina (Satsuma)', defaultQty: '1.5 kg' },
    { text: 'Çilek', defaultQty: '1 kg' },
    { text: 'Kiraz', defaultQty: '1 kg' },
    { text: 'Vişne', defaultQty: '1 kg' },
    { text: 'Şeftali', defaultQty: '1 kg' },
    { text: 'Nektarin', defaultQty: '1 kg' },
    { text: 'Malatya Kayısısı', defaultQty: '1 kg' },
    { text: 'Can Erik (Yeşil)', defaultQty: '500 g' },
    { text: 'Mürdüm Eriği', defaultQty: '1 kg' },
    { text: 'Karpuz', defaultQty: '1 adet' },
    { text: 'Kırkağaç Kavunu', defaultQty: '1 adet' },
    { text: 'Çekirdeksiz İzmir Üzümü', defaultQty: '1 kg' },
    { text: 'Siyah Üzüm', defaultQty: '1 kg' },
    { text: 'Bursa Siyah İncir', defaultQty: '1 kg' },
    { text: 'Nar', defaultQty: '1.5 kg' },
    { text: 'Ayva', defaultQty: '1 kg' },
    { text: 'Deveci Armut', defaultQty: '1 kg' },
    { text: 'Kivi', defaultQty: '500 g' },
    { text: 'Trabzon Hurması', defaultQty: '1 kg' },
    { text: 'Avokado', defaultQty: '2 adet' },
  ],
  Yeşillik: [
    { text: 'Maydanoz', defaultQty: '2 demet' },
    { text: 'Dereotu', defaultQty: '2 demet' },
    { text: 'Roka', defaultQty: '2 demet' },
    { text: 'Taze Nane', defaultQty: '2 demet' },
    { text: 'Taze Fesleğen', defaultQty: '1 demet' },
    { text: 'Kıvırcık Marul', defaultQty: '1 adet' },
    { text: 'Göbek Marul (Aysberg)', defaultQty: '1 adet' },
    { text: 'Yedikule Marul', defaultQty: '1 adet' },
    { text: 'Taze Tere', defaultQty: '1 demet' },
    { text: 'Kuzu Kulağı', defaultQty: '1 demet' },
    { text: 'Semizotu', defaultQty: '1 demet' },
    { text: 'Pazı', defaultQty: '1 demet' },
    { text: 'Taze Reyhan', defaultQty: '1 demet' },
    { text: 'Taze Kekik', defaultQty: '1 demet' },
    { text: 'Taze Biberiye', defaultQty: '1 paket' },
  ],
  Şarküteri: [
    { text: 'Köy Yumurtası (30’lu)', defaultQty: '1 koli' },
    { text: 'Gezen Tavuk Yumurtası', defaultQty: '15 adet' },
    { text: 'Ezine Beyaz Peynir', defaultQty: '500 g' },
    { text: 'Trakya Kaşar Peyniri', defaultQty: '500 g' },
    { text: 'Eski Kaşar', defaultQty: '350 g' },
    { text: 'İzmir Tulum Peyniri', defaultQty: '500 g' },
    { text: 'Erzincan Tulum Peyniri', defaultQty: '500 g' },
    { text: 'Lor Peyniri', defaultQty: '500 g' },
    { text: 'Köy Tereyağı', defaultQty: '500 g' },
    { text: 'Yayık Tereyağı', defaultQty: '500 g' },
    { text: 'Kaymak', defaultQty: '200 g' },
    { text: 'Gemlik Siyah Zeytin', defaultQty: '1 kg' },
    { text: 'Kırma Yeşil Zeytin', defaultQty: '1 kg' },
    { text: 'Çizik Yeşil Zeytin', defaultQty: '1 kg' },
    { text: 'Köy Sütü', defaultQty: '3 litre' },
    { text: 'Süzme Köy Yoğurdu', defaultQty: '1 kg' },
    { text: 'Petek Bal', defaultQty: '1 kavanoz' },
    { text: 'Tahin & Pekmez', defaultQty: '1 takım' },
  ],
  'Kuru Gıda': [
    { text: 'Kırmızı Mercimek', defaultQty: '1 kg' },
    { text: 'Yeşil Mercimek', defaultQty: '1 kg' },
    { text: 'İspir Kuru Fasulye', defaultQty: '1 kg' },
    { text: 'Dermason Kuru Fasulye', defaultQty: '1 kg' },
    { text: 'Koçbaşı Nohut', defaultQty: '1 kg' },
    { text: 'Baldo Pirinç', defaultQty: '2 kg' },
    { text: 'Pilavlık Bulgur', defaultQty: '1 kg' },
    { text: 'Köftelik İnce Bulgur', defaultQty: '1 kg' },
    { text: 'Siyez Bulguru', defaultQty: '1 kg' },
    { text: 'Ceviz İçi (Yeni Mahsul)', defaultQty: '500 g' },
    { text: 'Kavrulmuş Giresun Fındık', defaultQty: '500 g' },
    { text: 'Çiğ Badem', defaultQty: '300 g' },
    { text: 'Günkurusu Malatya Kayısı', defaultQty: '500 g' },
    { text: 'Kuru İncir (Aydın)', defaultQty: '500 g' },
    { text: 'Kuru Üzüm (Sultaniye)', defaultQty: '500 g' },
    { text: 'Ev Tarhanası', defaultQty: '1 kg' },
    { text: 'Köy Eriştesi', defaultQty: '1 kg' },
  ],
  Diğer: [
    { text: 'Çubuk Salatalık Turşusu', defaultQty: '1 kavanoz' },
    { text: 'Tokat Asma Yaprağı', defaultQty: '1 kg' },
    { text: 'Ev Domates Salçası', defaultQty: '1 kg' },
    { text: 'Ev Biber Salçası (Tatlı/Acı)', defaultQty: '1 kg' },
    { text: 'Soğuk Sıkım Sızma Zeytinyağı', defaultQty: '1 litre' },
    { text: 'Pul Biber (İpek)', defaultQty: '250 g' },
    { text: 'Dağ Kekiği', defaultQty: '100 g' },
    { text: 'Kimyon', defaultQty: '150 g' },
    { text: 'Çörek Otu', defaultQty: '100 g' },
    { text: 'Günlük Taze Yufka', defaultQty: '5 adet' },
  ],
};

interface ShoppingTodoListProps {
  currentBazaarName?: string;
}

export const ShoppingTodoList: React.FC<ShoppingTodoListProps> = ({ currentBazaarName }) => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading todos:', e);
    }
    return [
      { id: '1', text: 'Domates', category: 'Sebze', quantity: '2 kg', completed: false, createdAt: Date.now() - 3000 },
      { id: '2', text: 'Salatalık', category: 'Sebze', quantity: '1 kg', completed: false, createdAt: Date.now() - 2000 },
      { id: '3', text: 'Maydanoz', category: 'Yeşillik', quantity: '2 demet', completed: true, createdAt: Date.now() - 1000 },
      { id: '4', text: 'Köy Yumurtası (30’lu)', category: 'Şarküteri', quantity: '1 koli', completed: false, createdAt: Date.now() },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TodoItem['category']>('Sebze');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Export Modal State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportOnlyPending, setExportOnlyPending] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos:', e);
    }
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newItem: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: trimmed,
      quantity: inputQuantity.trim() || undefined,
      category: selectedCategory,
      completed: false,
      bazaarName: currentBazaarName,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newItem, ...prev]);
    setInputText('');
    setInputQuantity('');
  };

  const handleQuickAdd = (preset: { text: string; defaultQty: string }, category: TodoItem['category']) => {
    // If already in list, don't duplicate
    if (todos.some((t) => t.text.toLowerCase() === preset.text.toLowerCase())) {
      return;
    }
    const newItem: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: preset.text,
      quantity: preset.defaultQty,
      category: category,
      completed: false,
      bazaarName: currentBazaarName,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newItem, ...prev]);
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    if (window.confirm('Tamamlanan tüm ürünleri listeden silmek istediğinize emin misiniz?')) {
      setTodos((prev) => prev.filter((t) => !t.completed));
    }
  };

  // Filtered todos for current view
  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (filterMode === 'pending') return !t.completed;
      if (filterMode === 'completed') return t.completed;
      return true;
    });
  }, [todos, filterMode]);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Quick items dynamically bound to currently selected category
  const activeCategoryPresets = CATEGORY_PRESETS[selectedCategory] || [];

  // Generate plain text export string
  const generateExportText = () => {
    const listToExport = exportOnlyPending ? todos.filter((t) => !t.completed) : todos;
    const nowStr = new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let text = `🛒 PAZAR ALIŞVERİŞ LİSTESİ\n`;
    text += `Tarih: ${nowStr}\n`;
    if (currentBazaarName) {
      text += `Pazar: ${currentBazaarName}\n`;
    }
    text += `----------------------------------------\n\n`;

    if (listToExport.length === 0) {
      text += `(Listede ${exportOnlyPending ? 'alınacak ürün' : 'ürün'} bulunmuyor)\n`;
    } else {
      // Group by category
      for (const cat of CATEGORIES) {
        const catItems = listToExport.filter((t) => t.category === cat);
        if (catItems.length > 0) {
          text += `[${cat.toUpperCase()}]\n`;
          for (const item of catItems) {
            const checkMark = item.completed ? '[✓]' : '[ ]';
            const qtyStr = item.quantity ? ` (${item.quantity})` : '';
            text += `${checkMark} ${item.text}${qtyStr}\n`;
          }
          text += `\n`;
        }
      }
    }

    text += `----------------------------------------\n`;
    text += `Toplam: ${todos.length} ürün (${totalCount - completedCount} alınacak, ${completedCount} tamamlandı)\n`;
    text += `Bazaar Finder ile oluşturuldu.`;
    return text;
  };

  const exportText = useMemo(() => {
    return generateExportText();
  }, [todos, exportOnlyPending, currentBazaarName]);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportText);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `pazar-alisveris-listesi-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(exportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats & Export Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                Pazar Alışveriş Listesi
              </h2>
              <p className="text-[11px] text-slate-400">
                Verileriniz tamamen cihazınızda yerel saklanır
              </p>
            </div>
          </div>

          {/* Simple Text Export Button */}
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-xs"
            title="Alışveriş listesini metin olarak dışa aktar veya paylaş"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Listeyi Paylaş / Dışa Aktar</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Alışveriş İlerlemesi:</span>
            <span className="font-bold text-orange-400">
              {completedCount}/{totalCount} ürün alındı ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Input Form with Category Selection */}
      <form
        onSubmit={handleAddTodo}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
      >
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Kategori Seçiniz:
          </label>
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Rich Quick-Add Presets for Chosen Category */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>{selectedCategory} İçin Hızlı Seçim ({activeCategoryPresets.length} Çeşit):</span>
            </span>
            <span className="text-[10px] text-slate-500">Tıklayıp hemen ekleyin</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {activeCategoryPresets.map((preset) => {
              const isAdded = todos.some((t) => t.text.toLowerCase() === preset.text.toLowerCase());
              return (
                <button
                  key={preset.text}
                  type="button"
                  onClick={() => handleQuickAdd(preset, selectedCategory)}
                  disabled={isAdded}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isAdded
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default opacity-80'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-orange-500/50'
                  }`}
                  title={`${preset.text} (${preset.defaultQty}) ekle`}
                >
                  {isAdded ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-orange-400" />
                  )}
                  <span>{preset.text}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({preset.defaultQty})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Item Text & Quantity Input */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`${selectedCategory} ürünü adı yazın... (Örn: Köy Yumurtası)`}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />

          <input
            type="text"
            value={inputQuantity}
            onChange={(e) => setInputQuantity(e.target.value)}
            placeholder="Miktar (Örn: 2 kg, 1 demet)"
            className="w-full sm:w-40 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Listeye Ekle</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs & Bulk Actions */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tümü ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterMode === 'pending'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alınacaklar ({totalCount - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterMode === 'completed'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tamamlananlar ({completedCount})
          </button>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={handleClearCompleted}
            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Alınanları Temizle</span>
          </button>
        )}
      </div>

      {/* Todo Items List */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {filterMode === 'pending'
                ? 'Harika! Alınacak ürün kalmadı.'
                : filterMode === 'completed'
                ? 'Henüz işaretlenmiş ürün yok.'
                : 'Alışveriş listeniz boş.'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Yukarıdaki kategorilerden hızlı seçim yapabilir veya istediğiniz ürünleri doğrudan ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => handleToggle(todo.id)}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                todo.completed
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-70'
                  : 'bg-slate-900 border-slate-800 hover:border-orange-500/40 text-white shadow-xs'
              }`}
            >
              {/* Checkbox and Text */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(todo.id);
                  }}
                  className="text-orange-400 focus:outline-hidden shrink-0"
                >
                  {todo.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 hover:text-orange-400 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold leading-tight ${
                        todo.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {todo.text}
                    </span>

                    {todo.quantity && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                          todo.completed
                            ? 'bg-slate-900 text-slate-600'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}
                      >
                        {todo.quantity}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {todo.category}
                    </span>
                    {todo.bazaarName && (
                      <span className="text-[10px] text-slate-500">
                        &bull; {todo.bazaarName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete item button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(todo.id);
                }}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                title="Listeden sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* SIMPLE TEXT-BASED EXPORT MODAL */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Listeyi Dışa Aktar (Metin)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Basit metin formatında kopyalayın veya paylaşın
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExportOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle in Export */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">
                {exportOnlyPending ? 'Sadece Alınacak Ürünler' : 'Tüm Ürünler (Alınanlar Dahil)'}
              </span>
              <button
                type="button"
                onClick={() => setExportOnlyPending(!exportOnlyPending)}
                className="text-orange-400 hover:text-orange-300 font-bold px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20"
              >
                {exportOnlyPending ? 'Tümünü Göster' : 'Sadece Kalanlar'}
              </button>
            </div>

            {/* Plain Text Display Area */}
            <div className="relative">
              <textarea
                readOnly
                value={exportText}
                rows={9}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 leading-relaxed outline-none resize-none select-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* Copy to Clipboard */}
              <button
                type="button"
                onClick={handleCopyExport}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedExport ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Panoya Kopyala</span>
                  </>
                )}
              </button>

              {/* Share via WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              {/* Download .txt file */}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>.txt İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
