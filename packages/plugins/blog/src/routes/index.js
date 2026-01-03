"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlogRoutes = registerBlogRoutes;
const posts_1 = require("./posts");
const categories_1 = require("./categories");
const tags_1 = require("./tags");
function registerBlogRoutes(router, ctx, requireAuth, requirePermission) {
    (0, posts_1.registerPostRoutes)(router, ctx, requireAuth, requirePermission);
    (0, categories_1.registerCategoryRoutes)(router, ctx, requireAuth, requirePermission);
    (0, tags_1.registerTagRoutes)(router, ctx, requireAuth, requirePermission);
}
//# sourceMappingURL=index.js.map