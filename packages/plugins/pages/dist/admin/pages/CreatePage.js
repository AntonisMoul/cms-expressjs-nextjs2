'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@cms/ui';
export function CreatePage({}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        status: 'draft',
        description: '',
        isFeatured: false,
    });
    const [seoData, setSeoData] = useState({
        seoTitle: '',
        seoDescription: '',
        seoImage: '',
        index: 'index',
    });
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
            const response = await fetch('/api/v1/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submitData),
            });
            if (response.ok) {
                const data = await response.json();
                router.push(`/admin/pages/${data.data.page.id}/edit`);
            }
            else {
                console.error('Failed to create page');
            }
        }
        catch (error) {
            console.error('Error creating page:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Page" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", onClick: (e) => handleSubmit(e, 'save'), disabled: loading, children: "Save Draft" }), _jsx(Button, { onClick: (e) => handleSubmit(e, 'publish'), disabled: loading, children: loading ? 'Publishing...' : 'Publish' })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: _jsx("input", { type: "text", placeholder: "Page Title", className: "w-full text-2xl font-bold border-none outline-none focus:ring-0 p-0", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })) }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border", children: _jsx("div", { className: "p-6", children: _jsx("textarea", { placeholder: "Page content...", className: "w-full min-h-[400px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500", value: formData.content, onChange: (e) => setFormData(prev => ({ ...prev, content: e.target.value })) }) }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Publish" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", value: formData.status, onChange: (e) => setFormData(prev => ({ ...prev, status: e.target.value })), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "pending", children: "Pending Review" })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "isFeatured", className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500", checked: formData.isFeatured, onChange: (e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked })) }), _jsx("label", { htmlFor: "isFeatured", className: "ml-2 text-sm text-gray-700", children: "Mark as featured" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Permalink" }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "text-sm text-gray-600 mb-2", children: "URL Slug" }), _jsxs("div", { className: "flex", children: [_jsx("span", { className: "inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md", children: "/" }), _jsx("input", { type: "text", placeholder: "page-slug", className: "flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500", value: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), readOnly: true })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "The permalink is automatically generated from the title." })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Featured Image" }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [_jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", children: _jsx("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) }), _jsxs("div", { className: "mt-4", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-500 text-sm font-medium", children: "Upload featured image" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "PNG, JPG up to 2MB" })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Gallery" }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [_jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", children: _jsx("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) }), _jsxs("div", { className: "mt-4", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-500 text-sm font-medium", children: "Add gallery images" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Multiple images allowed" })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "SEO" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "SEO Title" }), _jsx("input", { type: "text", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", value: seoData.seoTitle, onChange: (e) => setSeoData(prev => ({ ...prev, seoTitle: e.target.value })), placeholder: "Custom SEO title" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Leave blank to use page title. Recommended: 50-60 characters." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "SEO Description" }), _jsx("textarea", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3, value: seoData.seoDescription, onChange: (e) => setSeoData(prev => ({ ...prev, seoDescription: e.target.value })), placeholder: "Custom SEO description" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Leave blank to use page description. Recommended: 150-160 characters." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Index" }), _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", value: seoData.index, onChange: (e) => setSeoData(prev => ({ ...prev, index: e.target.value })), children: [_jsx("option", { value: "index", children: "Index (allow search engines)" }), _jsx("option", { value: "noindex", children: "No Index (block search engines)" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Language" }) }), _jsx("div", { className: "p-6", children: _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", defaultValue: "en", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "el", children: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Translations" }) }), _jsxs("div", { className: "p-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Create translations for this page in other languages." }), _jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-sm text-gray-700", children: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC (el)" }), _jsx("button", { className: "text-blue-600 hover:text-blue-800 text-sm font-medium", children: "Create Translation" })] }) })] })] })] })] })] }));
}
