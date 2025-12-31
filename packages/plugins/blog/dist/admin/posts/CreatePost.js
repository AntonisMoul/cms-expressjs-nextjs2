'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePost = CreatePost;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const ui_1 = require("@cms/ui");
function CreatePost({}) {
    const router = (0, navigation_1.useRouter)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [tags, setTags] = (0, react_1.useState)([]);
    const [tagSearch, setTagSearch] = (0, react_1.useState)('');
    const [selectedTags, setSelectedTags] = (0, react_1.useState)([]);
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        description: '',
        content: '',
        status: 'draft',
        isFeatured: false,
        categoryIds: [],
        tagIds: [],
    });
    const [seoData, setSeoData] = (0, react_1.useState)({
        seoTitle: '',
        seoDescription: '',
        seoImage: '',
        index: 'index',
    });
    (0, react_1.useEffect)(() => {
        fetchCategories();
    }, []);
    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/v1/blog/categories?perPage=100', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data.data.categories);
            }
        }
        catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };
    const searchTags = async (query) => {
        if (query.length < 2)
            return;
        try {
            const response = await fetch(`/api/v1/blog/tags/search?q=${encodeURIComponent(query)}`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setTags(data.data.tags);
            }
        }
        catch (error) {
            console.error('Failed to search tags:', error);
        }
    };
    const handleTagSelect = (tag) => {
        if (!selectedTags.find(t => t.id === tag.id)) {
            setSelectedTags(prev => [...prev, tag]);
            setFormData(prev => ({
                ...prev,
                tagIds: [...(prev.tagIds || []), tag.id],
            }));
        }
        setTagSearch('');
        setTags([]);
    };
    const handleTagRemove = (tagId) => {
        setSelectedTags(prev => prev.filter(tag => tag.id !== tagId));
        setFormData(prev => ({
            ...prev,
            tagIds: (prev.tagIds || []).filter(id => id !== tagId),
        }));
    };
    const handleCategoryChange = (categoryId, checked) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: checked
                ? [...(prev.categoryIds || []), categoryId]
                : (prev.categoryIds || []).filter(id => id !== categoryId),
        }));
    };
    const handleSubmit = async (e, action) => {
        e.preventDefault();
        try {
            setLoading(true);
            const submitData = {
                ...formData,
                status: action === 'publish' ? 'published' : formData.status,
                meta: {
                    seo_title: seoData.seoTitle,
                    seo_description: seoData.seoDescription,
                    seo_image: seoData.seoImage,
                    index: seoData.index,
                },
            };
            const response = await fetch('/api/v1/blog/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submitData),
            });
            if (response.ok) {
                const data = await response.json();
                router.push(`/admin/blog/posts/${data.data.post.id}/edit`);
            }
            else {
                console.error('Failed to create post');
            }
        }
        catch (error) {
            console.error('Error creating post:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
        <div className="flex gap-2">
          <ui_1.Button variant="secondary" onClick={(e) => handleSubmit(e, 'save')} disabled={loading}>
            Save Draft
          </ui_1.Button>
          <ui_1.Button onClick={(e) => handleSubmit(e, 'publish')} disabled={loading}>
            {loading ? 'Publishing...' : 'Publish'}
          </ui_1.Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <input type="text" placeholder="Post Title" className="w-full text-2xl font-bold border-none outline-none focus:ring-0 p-0" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}/>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <textarea placeholder="Post content..." className="w-full min-h-[400px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}/>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea placeholder="Brief description of the post..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}/>
          </div>
        </div>

        {/* Meta Boxes Column */}
        <div className="space-y-6">
          {/* Publish Box */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Publish</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="isFeatured" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}/>
                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                  Mark as featured post
                </label>
              </div>
            </div>
          </div>

          {/* Categories Box */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
            </div>
            <div className="p-6 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {categories.map((category) => (<div key={category.id} className="flex items-center">
                    <input type="checkbox" id={`category-${category.id}`} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={(formData.categoryIds || []).includes(category.id)} onChange={(e) => handleCategoryChange(category.id, e.target.checked)}/>
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>))}
              </div>
            </div>
          </div>

          {/* Tags Box */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Selected Tags */}
              {selectedTags.length > 0 && (<div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (<span key={tag.id} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {tag.name}
                      <button onClick={() => handleTagRemove(tag.id)} className="ml-1 text-blue-600 hover:text-blue-800">
                        ×
                      </button>
                    </span>))}
                </div>)}

              {/* Tag Input */}
              <div className="relative">
                <input type="text" placeholder="Add tags..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={tagSearch} onChange={(e) => {
            setTagSearch(e.target.value);
            searchTags(e.target.value);
        }}/>

                {/* Tag Suggestions */}
                {tags.length > 0 && (<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {tags.map((tag) => (<button key={tag.id} onClick={() => handleTagSelect(tag)} className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                        {tag.name}
                      </button>))}
                  </div>)}
              </div>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Featured Image</h3>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="mt-4">
                  <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                    Upload featured image
                  </button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Box */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">SEO</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={seoData.seoTitle} onChange={(e) => setSeoData(prev => ({ ...prev, seoTitle: e.target.value }))} placeholder="Custom SEO title"/>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use post title. Recommended: 50-60 characters.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} value={seoData.seoDescription} onChange={(e) => setSeoData(prev => ({ ...prev, seoDescription: e.target.value }))} placeholder="Custom SEO description"/>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use post excerpt. Recommended: 150-160 characters.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Index
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={seoData.index} onChange={(e) => setSeoData(prev => ({ ...prev, index: e.target.value }))}>
                  <option value="index">Index (allow search engines)</option>
                  <option value="noindex">No Index (block search engines)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
