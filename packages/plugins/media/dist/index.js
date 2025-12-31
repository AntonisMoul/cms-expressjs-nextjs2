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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRoutes = exports.uploadUtils = exports.UploadUtils = exports.MediaService = exports.plugin = void 0;
// Plugin
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "plugin", { enumerable: true, get: function () { return __importDefault(plugin_1).default; } });
// Services
var mediaService_1 = require("./services/mediaService");
Object.defineProperty(exports, "MediaService", { enumerable: true, get: function () { return mediaService_1.MediaService; } });
// Utils
var upload_1 = require("./utils/upload");
Object.defineProperty(exports, "UploadUtils", { enumerable: true, get: function () { return upload_1.UploadUtils; } });
Object.defineProperty(exports, "uploadUtils", { enumerable: true, get: function () { return upload_1.uploadUtils; } });
// Models and Types
__exportStar(require("./models/types"), exports);
// API Routes (for direct usage if needed)
var routes_1 = require("./api/routes");
Object.defineProperty(exports, "mediaRoutes", { enumerable: true, get: function () { return __importDefault(routes_1).default; } });
