import "../css/app.css";
import "./bootstrap";
// Htan sxoliasmeno!!!

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import { HelmetProvider } from "react-helmet-async";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText ||
    "City Guide";

createInertiaApp({
    title: (title) => `${appName}`,
    resolve: (name) => {
        return resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx"),
        );
    },
    setup({ el, App, props }) {


        const root = createRoot(el);
        root.render(
            <HelmetProvider>
                
                <App {...props} />
                       
            </HelmetProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
