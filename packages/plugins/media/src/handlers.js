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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaJobHandlers = getMediaJobHandlers;
const sharp_1 = __importDefault(require("sharp"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function getMediaJobHandlers(ctx) {
    return [
        {
            name: 'media.processImage',
            handler: async (payload) => {
                const db = ctx.db;
                const mediaFile = await db.mediaFile.findUnique({
                    where: { id: payload.mediaFileId },
                });
                if (!mediaFile) {
                    throw new Error(`Media file ${payload.mediaFileId} not found`);
                }
                // Read image file
                // payload.filePath is just the filename, need to construct full path
                const fullPath = path.join(process.cwd(), 'storage', 'app', 'public', 'media', payload.filePath);
                const imageBuffer = await fs.readFile(fullPath);
                // Generate thumbnails
                const thumbnails = {};
                const mediaDir = path.join(process.cwd(), 'storage', 'app', 'public', 'media');
                const fileExt = path.extname(payload.filePath);
                const fileBase = path.basename(payload.filePath, fileExt);
                // Small thumbnail (150x150)
                const smallThumb = await (0, sharp_1.default)(imageBuffer)
                    .resize(150, 150, { fit: 'cover' })
                    .toBuffer();
                const smallPath = path.join(mediaDir, `${fileBase}-thumb-small${fileExt}`);
                await fs.writeFile(smallPath, smallThumb);
                thumbnails.small = `/media/${path.basename(smallPath)}`;
                // Medium thumbnail (300x300)
                const mediumThumb = await (0, sharp_1.default)(imageBuffer)
                    .resize(300, 300, { fit: 'cover' })
                    .toBuffer();
                const mediumPath = path.join(mediaDir, `${fileBase}-thumb-medium${fileExt}`);
                await fs.writeFile(mediumPath, mediumThumb);
                thumbnails.medium = `/media/${path.basename(mediumPath)}`;
                // Large thumbnail (800x800)
                const largeThumb = await (0, sharp_1.default)(imageBuffer)
                    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
                    .toBuffer();
                const largePath = path.join(mediaDir, `${fileBase}-thumb-large${fileExt}`);
                await fs.writeFile(largePath, largeThumb);
                thumbnails.large = `/media/${path.basename(largePath)}`;
                // Get image dimensions
                const metadata = await (0, sharp_1.default)(imageBuffer).metadata();
                // Update media file options
                const options = {
                    thumbnails,
                    width: metadata.width,
                    height: metadata.height,
                    processed: true,
                };
                await db.mediaFile.update({
                    where: { id: payload.mediaFileId },
                    data: {
                        options: JSON.stringify(options),
                    },
                });
            },
            maxAttempts: 3,
            backoff: 30,
        },
    ];
}
//# sourceMappingURL=handlers.js.map