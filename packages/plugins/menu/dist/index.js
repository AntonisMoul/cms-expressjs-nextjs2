"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = exports.menuPlugin = void 0;
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "menuPlugin", { enumerable: true, get: function () { return __importDefault(plugin_1).default; } });
var menuService_1 = require("./services/menuService");
Object.defineProperty(exports, "MenuService", { enumerable: true, get: function () { return menuService_1.MenuService; } });
