"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./api/routes"));
const menuPlugin = {
    name: 'menu',
    version: '1.0.0',
    registerApiRoutes: (router) => {
        router.use('/menu', routes_1.default);
    },
    permissions: [
        {
            key: 'menus.view',
            name: 'View Menus',
            module: 'menus',
            description: 'Can view menus and menu items'
        },
        {
            key: 'menus.create',
            name: 'Create Menus',
            module: 'menus',
            description: 'Can create new menus'
        },
        {
            key: 'menus.edit',
            name: 'Edit Menus',
            module: 'menus',
            description: 'Can edit menus and menu items'
        },
        {
            key: 'menus.delete',
            name: 'Delete Menus',
            module: 'menus',
            description: 'Can delete menus'
        }
    ],
    adminNavigation: [
        {
            id: 'menus',
            name: 'Menus',
            icon: 'menu',
            route: '/admin/menus',
            permissions: ['menus.view'],
            children: [
                {
                    id: 'menus-list',
                    name: 'All Menus',
                    route: '/admin/menus',
                    permissions: ['menus.view']
                },
                {
                    id: 'menu-locations',
                    name: 'Menu Locations',
                    route: '/admin/menus/locations',
                    permissions: ['menus.view']
                }
            ]
        }
    ]
};
exports.default = menuPlugin;
