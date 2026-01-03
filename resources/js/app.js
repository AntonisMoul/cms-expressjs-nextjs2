"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../css/app.css");
require("./bootstrap");
// Htan sxoliasmeno!!!
const client_1 = require("react-dom/client");
const react_1 = require("@inertiajs/react");
const inertia_helpers_1 = require("laravel-vite-plugin/inertia-helpers");
const react_helmet_async_1 = require("react-helmet-async");
const appName = window.document.getElementsByTagName("title")[0]?.innerText ||
    "City Guide";
(0, react_1.createInertiaApp)({
    title: (title) => `${appName}`,
    resolve: (name) => {
        return (0, inertia_helpers_1.resolvePageComponent)(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx"));
    },
    setup({ el, App, props }) {
        const root = (0, client_1.createRoot)(el);
        root.render(<react_helmet_async_1.HelmetProvider>
                
                <App {...props}/>
                       
            </react_helmet_async_1.HelmetProvider>);
    },
    progress: {
        color: "#4B5563",
    },
});
//# sourceMappingURL=app.js.map