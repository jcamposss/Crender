import { defineConfig, type Plugin } from 'vite';

// SketchUp opens the dialog from file://, where Chromium blocks ES module scripts (CORS).
// The bundle is emitted as IIFE and the tag rewritten to a classic deferred script.
function classicScriptTags(): Plugin {
  return {
    name: 'crender-classic-script-tags',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(/<script type="module" crossorigin/g, '<script defer');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [classicScriptTags()],
  build: {
    outDir: '../sketchup-extension/src/crender_ia/ui',
    emptyOutDir: true,
    // Older SketchUp versions embed an old Chromium; ES2019 keeps the syntax loadable there.
    // Vite does not polyfill DOM APIs, so newer DOM methods must be avoided by hand.
    target: 'es2019',
    modulePreload: false,
    rolldownOptions: {
      output: { format: 'iife' },
    },
  },
});
