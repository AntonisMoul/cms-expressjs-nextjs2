"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./api/routes"));
const plugin = {
    name: 'Media',
    version: '1.0.0',
    description: 'Media management system with file uploads, galleries, and folder organization',
    // API routes registration
    registerApiRoutes: (router, context) => {
        (0, routes_1.default)(router, context);
    },
    // Permissions
    permissions: [
        {
            key: 'media.index',
            name: 'View Media Files',
            module: 'media',
        },
        {
            key: 'media.upload',
            name: 'Upload Media Files',
            module: 'media',
        },
        {
            key: 'media.edit',
            name: 'Edit Media Files',
            module: 'media',
        },
        {
            key: 'media.delete',
            name: 'Delete Media Files',
            module: 'media',
        },
        {
            key: 'galleries.index',
            name: 'View Galleries',
            module: 'media',
        },
        {
            key: 'galleries.create',
            name: 'Create Galleries',
            module: 'media',
        },
        {
            key: 'galleries.edit',
            name: 'Edit Galleries',
            module: 'media',
        },
        {
            key: 'galleries.delete',
            name: 'Delete Galleries',
            module: 'media',
        },
    ],
    // Admin navigation
    adminNavigation: [
        {
            id: 'media',
            name: 'Media',
            icon: 'ti ti-photo',
            route: '/admin/media',
            permissions: ['media.index'],
            priority: 6,
        },
    ],
    // Initialization
    init: async (context) => {
        console.log('Media plugin initialized');
    },
    // Cleanup
    destroy: async () => {
        console.log('Media plugin destroyed');
    },
};
exports.default = plugin;
