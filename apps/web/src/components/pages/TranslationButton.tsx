'use client';

import { useState } from 'react';
import { pagesApi } from '@/lib/api/pages';

interface TranslationButtonProps {
  pageId: number;
  currentLocale: string;
  onTranslationCreated?: () => void;
}

export default function TranslationButton({
  pageId,
  currentLocale,
  onTranslationCreated,
}: TranslationButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetLocale, setTargetLocale] = useState('el');
  const [slug, setSlug] = useState('');

  const handleCreateTranslation = async () => {
    if (!targetLocale) {
      alert('Please select a target locale');
      return;
    }

    setLoading(true);
    try {
      await pagesApi.createTranslation(pageId, {
        targetLocale,
        slug: slug || undefined,
      });
      setShowModal(false);
      if (onTranslationCreated) {
        onTranslationCreated();
      }
      alert('Translation created successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to create translation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="btn btn-sm"
      >
        Create Translation
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Translation</h2>
            <div className="form-group">
              <label htmlFor="targetLocale">Target Language</label>
              <select
                id="targetLocale"
                value={targetLocale}
                onChange={(e) => setTargetLocale(e.target.value)}
              >
                <option value="el">Greek</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="translationSlug">Slug (optional, auto-generated if empty)</label>
              <input
                type="text"
                id="translationSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated"
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTranslation}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Translation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          min-width: 400px;
          max-width: 90%;
        }

        .modal-content h2 {
          margin: 0 0 1.5rem 0;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
      `}</style>
    </>
  );
}

