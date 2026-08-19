import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  // `globals: true` is deliberately OFF. It has been observed to make Vitest
  // fail with "Vitest failed to find the current suite" when run under bash
  // (which is what CI uses) — even though the same repo can pass under other
  // shells, so the failure will not always reproduce locally. Do not re-add
  // `globals: true` to get automatic React Testing Library cleanup "for free";
  // every rendering test file instead registers `afterEach(cleanup)` itself.
  /**
   * Archived generators run in a sandboxed iframe, which gives them an opaque
   * origin — so their own images count as cross-origin and taint any canvas they
   * touch. The fix is for those images to request CORS (see scripts/cors-shim.mjs),
   * which needs the server to allow it. GitHub Pages sends this header on
   * everything; Vite sends nothing, so without this the affected pieces work in
   * production and fail locally, which is the worst way round.
   */
  server: { headers: { 'Access-Control-Allow-Origin': '*' } },
  preview: { headers: { 'Access-Control-Allow-Origin': '*' } },
  test: { environment: 'jsdom' },
})
