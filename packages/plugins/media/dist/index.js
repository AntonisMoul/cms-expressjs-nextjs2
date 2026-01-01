"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaAdminController = exports.MediaService = exports.mediaPlugin = void 0;
const express_1 = require("express");
const controller_1 = require("./admin/controller");
const multer_1 = __importDefault(require("multer"));
const plugin = {
    name: 'media',
    version: '1.0.0',
    registerApiRoutes(router, ctx) {
        const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
        // Admin routes
        const adminRouter = (0, express_1.Router)();
        // Folder routes
        adminRouter.get('/folders', controller_1.MediaAdminController.getFolders);
        adminRouter.post('/folders', controller_1.MediaAdminController.createFolder);
        adminRouter.put('/folders/:id', controller_1.MediaAdminController.updateFolder);
        adminRouter.delete('/folders/:id', controller_1.MediaAdminController.deleteFolder);
        // File routes
        adminRouter.get('/files', controller_1.MediaAdminController.getFiles);
        adminRouter.post('/files/upload', upload.array('files'), controller_1.MediaAdminController.uploadFiles);
        adminRouter.put('/files/:id', controller_1.MediaAdminController.updateFile);
        adminRouter.delete('/files/:id', controller_1.MediaAdminController.deleteFile);
        adminRouter.put('/files/:id/move', controller_1.MediaAdminController.moveFile);
        // Bulk operations
        adminRouter.post('/files/bulk-delete', controller_1.MediaAdminController.bulkDelete);
        adminRouter.post('/files/bulk-move', controller_1.MediaAdminController.bulkMove);
        // Storage info
        adminRouter.get('/storage-usage', controller_1.MediaAdminController.getStorageUsage);
        // Mount admin routes
        router.use('/media', adminRouter);
    },
    getAdminNavigation() {
        return [
            {
                id: 'media',
                label: 'Media',
                icon: 'ti ti-folder',
                href: '/admin/media',
                priority: 999,
                permissions: ['media.index'],
            },
        ];
    },
    permissions: [
        { key: 'media.index', name: 'View Media Library', module: 'media' },
        { key: 'media.upload', name: 'Upload Files', module: 'media' },
        { key: 'media.edit', name: 'Edit Media Files', module: 'media' },
        { key: 'media.delete', name: 'Delete Media Files', module: 'media' },
        { key: 'media.folders.manage', name: 'Manage Folders', module: 'media' },
    ],
};
exports.mediaPlugin = plugin;
var service_1 = require("./service");
Object.defineProperty(exports, "MediaService", { enumerable: true, get: function () { return service_1.MediaService; } });
var controller_2 = require("./admin/controller");
Object.defineProperty(exports, "MediaAdminController", { enumerable: true, get: function () { return controller_2.MediaAdminController; } });
//# sourceMappingURL=index.js.map