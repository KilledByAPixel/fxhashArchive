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
  test: { environment: 'jsdom' },
})
