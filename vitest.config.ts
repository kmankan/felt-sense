import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    env: {
      CARTESIA_API_KEY: 'CART_TEST_12312312asdasd',
      // Add other test environment variables as needed
    }
  }
})