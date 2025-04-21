import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg}"],
            },
            manifest: {
                start_url: "/",
                scope: "/",
                display: "standalone",
                name: "Inventario",
                short_name: "InvAlm",
                description: "App de inventario",
                theme_color: "#FFF",
                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
    // host: "almada.com",
    // https: {
    //   key: "./localhost-key.pem", // Ruta al archivo .key
    //   cert: "./localhost.pem", // Ruta al archivo .crt
    // },
    },
});
