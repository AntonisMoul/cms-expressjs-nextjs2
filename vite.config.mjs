import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

import path from 'path';
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css", // MUST come first
                "resources/js/app.tsx",
            ],
            refresh: true,
        }),
        react(),
       
    ],
   
});