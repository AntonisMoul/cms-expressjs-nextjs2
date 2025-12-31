'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@cms/ui';
export function ListPage({}) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPages, setSelectedPages] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });
    useEffect(() => {
        fetchPages();
    }, [filters, pagination.currentPage]);
    const fetchPages = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.currentPage.toString(),
                perPage: '15',
                ...filters,
            });
            const response = await fetch(`/api/v1/pages?${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setPages(data.data.pages);
                setPagination(data.data.pagination);
            }
        }
        catch (error) {
            console.error('Failed to fetch pages:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedPages(pages.map(page => page.id));
        }
        else {
            setSelectedPages([]);
        }
    };
    const handleSelectPage = (pageId, checked) => {
        if (checked) {
            setSelectedPages(prev => [...prev, pageId]);
        }
        else {
            setSelectedPages(prev => prev.filter(id => id !== pageId));
        }
    };
    const handleBulkAction = async (action) => {
        if (selectedPages.length === 0)
            return;
        try {
            const promises = selectedPages.map(pageId => {
                if (action === 'publish') {
                    return fetch(`/api/v1/pages/${pageId}/publish`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                }
                else if (action === 'unpublish') {
                    return fetch(`/api/v1/pages/${pageId}/unpublish`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                }
                else if (action === 'delete') {
                    return fetch(`/api/v1/pages/${pageId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                }
                return Promise.resolve();
            });
            await Promise.all(promises);
            await fetchPages();
            setSelectedPages([]);
        }
        catch (error) {
            console.error('Bulk action failed:', error);
        }
    };
    const getStatusBadge = (status) => {
        const statusClasses = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
            pending: 'bg-blue-100 text-blue-800',
        };
        return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`, children: status }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Pages" }), _jsx(Link, { href: "/admin/pages/create", children: _jsxs(Button, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Create Page"] }) })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Search pages...", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", value: filters.search, onChange: (e) => setFilters(prev => ({ ...prev, search: e.target.value })) }) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", value: filters.status, onChange: (e) => setFilters(prev => ({ ...prev, status: e.target.value })), children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "pending", children: "Pending" })] })] }) }), selectedPages.length > 0 && (_jsx("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-blue-700", children: [selectedPages.length, " page(s) selected"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleBulkAction('publish'), className: "px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700", children: "Publish" }), _jsx("button", { onClick: () => handleBulkAction('unpublish'), className: "px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700", children: "Unpublish" }), _jsx("button", { onClick: () => handleBulkAction('delete'), className: "px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700", children: "Delete" })] })] }) })), _jsx("div", { className: "bg-white shadow-sm border rounded-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left", children: _jsx("input", { type: "checkbox", className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500", checked: selectedPages.length === pages.length && pages.length > 0, onChange: (e) => handleSelectAll(e.target.checked) }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Author" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "Loading..." }) })) : pages.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "No pages found" }) })) : (pages.map((page) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "checkbox", className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500", checked: selectedPages.includes(page.id), onChange: (e) => handleSelectPage(page.id, e.target.checked) }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center", children: [page.isFeatured && (_jsx("svg", { className: "w-4 h-4 text-yellow-500 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) })), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: page.name }), page.description && (_jsx("div", { className: "text-sm text-gray-500 truncate max-w-xs", children: page.description }))] })] }) }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(page.status) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: page.user ? `${page.user.firstName} ${page.user.lastName}` : 'Unknown' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: new Date(page.createdAt).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 text-sm font-medium", children: [_jsx(Link, { href: `/admin/pages/${page.id}/edit`, className: "text-blue-600 hover:text-blue-900 mr-3", children: "Edit" }), _jsx("button", { className: "text-red-600 hover:text-red-900", children: "Delete" })] })] }, page.id)))) })] }) }) }), pagination.lastPage > 1 && (_jsxs("div", { className: "flex items-center justify-between bg-white px-4 py-3 border rounded-lg", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["Showing page ", pagination.currentPage, " of ", pagination.lastPage] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 })), disabled: pagination.currentPage === 1, className: "px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: "Previous" }), _jsx("button", { onClick: () => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 })), disabled: pagination.currentPage === pagination.lastPage, className: "px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: "Next" })] })] }))] }));
}
