'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MenuItems;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function MenuItems() {
    var _this = this;
    var _a = (0, react_1.useState)([]), menuItems = _a[0], setMenuItems = _a[1];
    var _b = (0, react_1.useState)([]), hierarchicalItems = _b[0], setHierarchicalItems = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), showForm = _e[0], setShowForm = _e[1];
    var _f = (0, react_1.useState)(null), editingItem = _f[0], setEditingItem = _f[1];
    var _g = (0, react_1.useState)({
        title: '',
        url: '',
        target: '_self',
        icon_class: '',
        css_class: ''
    }), formData = _g[0], setFormData = _g[1];
    var router = (0, navigation_1.useRouter)();
    var params = (0, navigation_1.useParams)();
    var menuId = parseInt(params.id);
    (0, react_1.useEffect)(function () {
        fetchMenuItems();
    }, [menuId]);
    var fetchMenuItems = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, items, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, fetch("/api/menu/menus/".concat(menuId, "/items"))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to fetch menu items');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    items = _a.sent();
                    setMenuItems(items);
                    setHierarchicalItems(buildHierarchy(items));
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'An error occurred');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var buildHierarchy = function (items) {
        var itemMap = new Map();
        var roots = [];
        // Convert items to hierarchical format
        items.forEach(function (item) {
            var hierarchicalItem = __assign(__assign({}, item), { children: [], depth: 0 });
            itemMap.set(item.id, hierarchicalItem);
        });
        // Build hierarchy
        items.forEach(function (item) {
            var hierarchicalItem = itemMap.get(item.id);
            if (item.parent_id && item.parent_id !== 0) {
                var parent_1 = itemMap.get(item.parent_id);
                if (parent_1) {
                    parent_1.children.push(hierarchicalItem);
                    hierarchicalItem.depth = parent_1.depth + 1;
                }
                else {
                    roots.push(hierarchicalItem);
                }
            }
            else {
                roots.push(hierarchicalItem);
            }
        });
        // Sort by position
        var sortByPosition = function (a, b) { return a.position - b.position; };
        roots.sort(sortByPosition);
        roots.forEach(function (root) { return sortChildrenRecursive(root, sortByPosition); });
        return roots;
    };
    var sortChildrenRecursive = function (item, sortFn) {
        item.children.sort(sortFn);
        item.children.forEach(function (child) { return sortChildrenRecursive(child, sortFn); });
    };
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var url, method, response, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = editingItem
                        ? "/api/menu/menu-items/".concat(editingItem.id)
                        : "/api/menu/menus/".concat(menuId, "/items");
                    method = editingItem ? 'PUT' : 'POST';
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to ".concat(editingItem ? 'update' : 'create', " menu item"));
                    }
                    setShowForm(false);
                    setEditingItem(null);
                    setFormData({
                        title: '',
                        url: '',
                        target: '_self',
                        icon_class: '',
                        css_class: ''
                    });
                    fetchMenuItems();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'An error occurred');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function (item) {
        setEditingItem(item);
        setFormData({
            title: item.title,
            url: item.url,
            target: item.target || '_self',
            icon_class: item.icon_class || '',
            css_class: item.css_class || ''
        });
        setShowForm(true);
    };
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this menu item?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/menu/menu-items/".concat(id), {
                            method: 'DELETE',
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to delete menu item');
                    }
                    fetchMenuItems();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    setError(err_3 instanceof Error ? err_3.message : 'Failed to delete menu item');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var renderMenuItem = function (item) { return (<div key={item.id} className="flex items-center py-2">
      <div className="flex-1" style={{ paddingLeft: "".concat(item.depth * 20, "px") }}>
        <div className="flex items-center">
          {item.depth > 0 && <span className="text-gray-400 mr-2">└─</span>}
          <span className="font-medium">{item.title}</span>
          <span className="text-gray-500 text-sm ml-2">({item.url})</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={function () { return handleEdit(item); }} className="text-indigo-600 hover:text-indigo-900 text-sm">
          Edit
        </button>
        <button onClick={function () { return handleDelete(item.id); }} className="text-red-600 hover:text-red-900 text-sm">
          Delete
        </button>
      </div>
    </div>); };
    if (loading) {
        return (<div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>);
    }
    return (<div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage items for this menu.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button onClick={function () { return setShowForm(!showForm); }} className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>
      </div>

      {error && (<div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>)}

      {showForm && (<div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input type="text" name="title" id="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  URL *
                </label>
                <input type="text" name="url" id="url" required value={formData.url} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="/page-url or https://external-link.com"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                    Target
                  </label>
                  <select name="target" id="target" value={formData.target} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="_self">Same Window</option>
                    <option value="_blank">New Window</option>
                    <option value="_parent">Parent Frame</option>
                    <option value="_top">Top Frame</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="icon_class" className="block text-sm font-medium text-gray-700">
                    Icon Class
                  </label>
                  <input type="text" name="icon_class" id="icon_class" value={formData.icon_class} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="fas fa-home"/>
                </div>
              </div>

              <div>
                <label htmlFor="css_class" className="block text-sm font-medium text-gray-700">
                  CSS Class
                </label>
                <input type="text" name="css_class" id="css_class" value={formData.css_class} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="menu-item-custom"/>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={function () {
                setShowForm(false);
                setEditingItem(null);
                setFormData({
                    title: '',
                    url: '',
                    target: '_self',
                    icon_class: '',
                    css_class: ''
                });
            }} className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Menu Structure</h3>
          <p className="mt-1 text-sm text-gray-500">
            Current menu items in hierarchical order.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            {hierarchicalItems.length === 0 ? (<p className="text-gray-500 text-center py-8">
                No menu items found. Add your first item above.
              </p>) : (<div className="space-y-1">
                {hierarchicalItems.map(function (item) { return renderMenuItem(item); })}
              </div>)}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={function () { return router.push('/admin/menus'); }} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          ← Back to Menus
        </button>
      </div>
    </div>);
}
