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
exports.blogRoutes = exports.TagService = exports.CategoryService = exports.PostService = exports.plugin = void 0;
// Plugin
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "plugin", { enumerable: true, get: function () { return __importDefault(plugin_1).default; } });
// Services
var postService_1 = require("./services/postService");
Object.defineProperty(exports, "PostService", { enumerable: true, get: function () { return postService_1.PostService; } });
var categoryService_1 = require("./services/categoryService");
Object.defineProperty(exports, "CategoryService", { enumerable: true, get: function () { return categoryService_1.CategoryService; } });
var tagService_1 = require("./services/tagService");
Object.defineProperty(exports, "TagService", { enumerable: true, get: function () { return tagService_1.TagService; } });
// Models and Types
__exportStar(require("./models/types"), exports);
// API Routes (for direct usage if needed)
var routes_1 = require("./api/routes");
Object.defineProperty(exports, "blogRoutes", { enumerable: true, get: function () { return __importDefault(routes_1).default; } });
