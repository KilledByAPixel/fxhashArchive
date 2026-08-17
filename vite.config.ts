import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  // `globals: true` is what makes React Testing Library register its automatic
  // cleanup; without it a file that forgets `afterEach(cleanup)` leaks mounted
  // components into its neighbours' queries. The explicit calls stay, harmlessly.
  test: { environment: 'jsdom', globals: true },
})
