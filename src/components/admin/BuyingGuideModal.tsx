import React from 'react';
import { BuyingGuide, Category } from '../../types';

interface BuyingGuideModalProps {
  guide: BuyingGuide;
  categories: Category[];
  onClose: () => void;
  onSave: (guide: BuyingGuide) => void;
}

export const BuyingGuideModal: React.FC<BuyingGuideModalProps> = ({ guide: initialGuide, categories, onClose, onSave }) => {
  const [guide, setGuide] = React.useState<BuyingGuide>(initialGuide);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate slug if empty
    if (!guide.slug) {
      guide.slug = guide.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    if (!guide.id) {
      guide.id = guide.slug;
    }
    
    guide.updatedAt = new Date().toISOString();
    
    onSave(guide);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 relative">
        <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">{guide.id ? 'Edit Buying Guide' : 'Create Buying Guide'}</h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
              <input
                required
                type="text"
                value={guide.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setGuide({
                    ...guide,
                    title,
                    slug: guide.id ? guide.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
              <input
                required
                type="text"
                value={guide.slug}
                onChange={(e) => setGuide({ ...guide, slug: e.target.value, id: guide.id || e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
            <select
              required
              value={guide.categoryId}
              onChange={(e) => setGuide({ ...guide, categoryId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Short Introduction *</label>
            <textarea
              required
              rows={2}
              value={guide.introduction}
              onChange={(e) => setGuide({ ...guide, introduction: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Content / Article</label>
            <textarea
              rows={8}
              value={guide.content || ''}
              onChange={(e) => setGuide({ ...guide, content: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-mono"
              placeholder="Use Markdown or HTML here..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Featured Image URL</label>
            <input
              type="url"
              value={guide.imageUrl || ''}
              onChange={(e) => setGuide({ ...guide, imageUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-semibold text-sm text-slate-700">SEO Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={guide.seoTitle || ''}
                  onChange={(e) => setGuide({ ...guide, seoTitle: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">SEO Description</label>
                <input
                  type="text"
                  value={guide.metaDescription || ''}
                  onChange={(e) => setGuide({ ...guide, metaDescription: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
              <input
                type="checkbox"
                checked={guide.published}
                onChange={(e) => setGuide({ ...guide, published: e.target.checked })}
                className="w-4 h-4 text-orange-600"
              />
              <span>Published</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
              <input
                type="checkbox"
                checked={guide.featured || false}
                onChange={(e) => setGuide({ ...guide, featured: e.target.checked })}
                className="w-4 h-4 text-orange-600"
              />
              <span>Featured Guide</span>
            </label>
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 shadow"
            >
              Save Buying Guide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

