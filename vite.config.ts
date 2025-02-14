import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    esbuild: {
        logOverride: { "this-is-undefined-in-esm": "silent" }
    },
    build: {
        outDir: "./build",
        target: "ESNEXT",
        sourcemap: true,
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return
                }
                warn(warning)
            }
        }
    },
    optimizeDeps: { include: ["react/jsx-runtime"] },
    plugins: [
        react({})
    ]
})
