'use client';

import { useState, useEffect } from 'react';
import { pagesApi, Page } from '@/lib/api/pages';
import { useRouter } from 'next/navigation';
import TranslationButton from './TranslationButton';

interface PageFormProps {
  pageId?: number;
}

export default function PageForm({ pageId }: PageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugSuggestion, setSlugSuggestion] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    content: '',
    description: '',
    status: 'draft' as 'published' | 'draft',
    template: '',
    image: '',
    slug: '',
    locale: 'en',
    // Meta boxes
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoImage: '',
    banner: '',
    gallery: [] as string[],
  });

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      const response = await pagesApi.get(pageId!);
      const page = response.data.page;
      
      setFormData({
        name: page.name,
        content: page.content || '',
        description: page.description || '',
        status: page.status,
        template: page.template || '',
        image: page.image || '',
        slug: page.slug?.key || '',
        locale: page.slug?.locale || 'en',
        seoTitle: page.meta?.seo_title || '',
        seoDescription: page.meta?.seo_description || '',
        seoKeywords: page.meta?.seo_keywords || '',
        seoImage: page.meta?.seo_image || '',
        banner: page.meta?.banner || '',
        gallery: page.meta?.gallery ? JSON.parse(page.meta.gallery) : [],
      });
    } catch (error: any) {
      alert(error.message || 'Failed to load page');
    }
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    
    // Auto-generate slug from name if slug is empty
    if (!formData.slug && value) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData({ ...formData, name: value, slug: autoSlug });
      checkSlugAvailability(autoSlug);
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    try {
      const response = await pagesApi.checkSlug({
        slug,
        prefix: '',
        locale: formData.locale,
        excludeId: pageId,
      });

      setSlugAvailable(response.data.available);
      setSlugSuggestion(response.data.suggested || null);
    } catch (error: any) {
      console.error('Failed to check slug:', error);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleSlugChange = (value: string) => {
    setFormData({ ...formData, slug: value });
    checkSlugAvailability(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Block submit if slug is not available
    if (slugAvailable === false) {
      alert('Please fix the slug before saving');
      setLoading(false);
      return;
    }

    try {
      const data = {
        name: formData.name,
        content: formData.content,
        description: formData.description,
        status: formData.status,
        template: formData.template || undefined,
        image: formData.image || undefined,
        slug: formData.slug || undefined,
        locale: formData.locale,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        seoImage: formData.seoImage || undefined,
        banner: formData.banner || undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
      };

      if (pageId) {
        await pagesApi.update(pageId, data);
      } else {
        await pagesApi.create(data);
      }

      router.push('/admin/pages');
    } catch (error: any) {
      alert(error.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="page-form">
      <div className="page-form-layout">
        {/* Left Column - Main Content */}
        <div className="page-form-main">
          <div className="form-group">
            <label htmlFor="name">Page Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
            />
          </div>
        </div>

        {/* Right Column - Meta Boxes */}
        <div className="page-form-sidebar">
          {/* Publish Meta Box */}
          <div className="meta-box">
            <h3>Publish</h3>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="template">Template</label>
              <input
                type="text"
                id="template"
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                placeholder="default"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading || slugAvailable === false}>
              {loading ? 'Saving...' : pageId ? 'Update' : 'Publish'}
            </button>
          </div>

          {/* Permalink Meta Box */}
          <div className="meta-box">
            <h3>Permalink</h3>
            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="page-slug"
              />
              {checkingSlug && <span className="slug-checking">Checking...</span>}
              {slugAvailable === false && (
                <div className="slug-error">
                  Slug is already taken.
                  {slugSuggestion && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, slug: slugSuggestion! });
                        checkSlugAvailability(slugSuggestion!);
                      }}
                      className="btn btn-sm"
                    >
                      Use: {slugSuggestion}
                    </button>
                  )}
                </div>
              )}
              {slugAvailable === true && (
                <span className="slug-available">✓ Available</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="locale">Language</label>
              <select
                id="locale"
                value={formData.locale}
                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
              >
                <option value="en">English</option>
                <option value="el">Greek</option>
              </select>
            </div>
          </div>

          {/* Banner Meta Box */}
          <div className="meta-box">
            <h3>Banner</h3>
            <div className="form-group">
              <label htmlFor="banner">Banner Image URL</label>
              <input
                type="text"
                id="banner"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                placeholder="/media/banner.jpg"
              />
            </div>
          </div>

          {/* Gallery Meta Box */}
          <div className="meta-box">
            <h3>Gallery</h3>
            <div className="form-group">
              <label>Gallery Images (one per line)</label>
              <textarea
                value={formData.gallery.join('\n')}
                onChange={(e) => {
                  const images = e.target.value.split('\n').filter(Boolean);
                  setFormData({ ...formData, gallery: images });
                }}
                rows={5}
                placeholder="/media/img1.jpg&#10;/media/img2.jpg"
              />
            </div>
          </div>

          {/* Translations Meta Box */}
          {pageId && (
            <div className="meta-box">
              <h3>Translations</h3>
              <TranslationButton
                pageId={pageId}
                currentLocale={formData.locale}
                onTranslationCreated={() => {
                  // Reload page data
                  loadPage();
                }}
              />
            </div>
          )}

          {/* SEO Meta Box */}
          <div className="meta-box">
            <h3>SEO</h3>
            <div className="form-group">
              <label htmlFor="seoTitle">SEO Title</label>
              <input
                type="text"
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="seoDescription">SEO Description</label>
              <textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="seoKeywords">SEO Keywords</label>
              <input
                type="text"
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                placeholder="keyword1, keyword2"
              />
            </div>
            <div className="form-group">
              <label htmlFor="seoImage">SEO Image URL</label>
              <input
                type="text"
                id="seoImage"
                value={formData.seoImage}
                onChange={(e) => setFormData({ ...formData, seoImage: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

