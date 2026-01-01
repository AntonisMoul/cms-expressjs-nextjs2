import { Router } from 'express';
import { PluginContract, AdminNavItem } from '@cms/core';
import { MediaAdminController } from './admin/controller';
import multer from 'multer';

const plugin: PluginContract = {
  name: 'media',
  version: '1.0.0',

  registerApiRoutes(router: Router, ctx: any) {
    const upload = multer({ storage: multer.memoryStorage() });

    // Admin routes
    const adminRouter = Router();

    // Folder routes
    adminRouter.get('/folders', MediaAdminController.getFolders);
    adminRouter.post('/folders', MediaAdminController.createFolder);
    adminRouter.put('/folders/:id', MediaAdminController.updateFolder);
    adminRouter.delete('/folders/:id', MediaAdminController.deleteFolder);

    // File routes
    adminRouter.get('/files', MediaAdminController.getFiles);
    adminRouter.post('/files/upload', upload.array('files'), MediaAdminController.uploadFiles);
    adminRouter.put('/files/:id', MediaAdminController.updateFile);
    adminRouter.delete('/files/:id', MediaAdminController.deleteFile);
    adminRouter.put('/files/:id/move', MediaAdminController.moveFile);

    // Bulk operations
    adminRouter.post('/files/bulk-delete', MediaAdminController.bulkDelete);
    adminRouter.post('/files/bulk-move', MediaAdminController.bulkMove);

    // Storage info
    adminRouter.get('/storage-usage', MediaAdminController.getStorageUsage);

    // Mount admin routes
    router.use('/media', adminRouter);
  },

  getAdminNavigation(): AdminNavItem[] {
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

export { plugin as mediaPlugin };
export { MediaService } from './service';
export { MediaAdminController } from './admin/controller';

