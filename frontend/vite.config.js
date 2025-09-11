import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: "./test/setupTests.js",
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '**/*.config.{js,ts}',
        'src/App*',
        'src/main.jsx',
        'src/components/FlightForm.jsx',
        'src/components/FlightsList.jsx',
        'src/components/FlightsPage.jsx',
      ],
    },
  },
})
