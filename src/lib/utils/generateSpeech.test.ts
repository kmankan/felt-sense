import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speak } from './generateSpeech';


// GIVEN SOME EXPECTED AND UNEXPECTED INPUTS:
// what should the output be?

// Unit tests that mock external dependencies
describe('[UNIT] speak', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock global fetch
    global.fetch = vi.fn();
  });

  it('should make correct API request with given text', async () => {
    const mockResponse = new Response(new ArrayBuffer(8), { status: 200 });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const text = "Hello world";
    await speak(text);

   expect(fetch).toHaveBeenCalledWith("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "Cartesia-Version": "2024-06-10",
        "X-API-Key": process.env.CARTESIA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: text,
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "98a34ef2-2140-4c28-9c71-663dc4dd7022",
        },
        output_format: {
          container: "wav",
          encoding: "pcm_f32le",
          sample_rate: 44100,
        },
      }), 
    });
  });

  it('should throw error on failed API response', async () => {
    const mockResponse = new Response(null, { status: 400, statusText: 'Bad Request' });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(speak("test")).rejects.toThrow('TTS API error: 400 Bad Request');
  });
});

// Integration tests that use real API
describe('[INTEGRATION] speak', () => {
  it.skip('should return buffer with audio data', async () => {
    const result = await speak("Integration test");
    
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  }, 3000); // Increased timeout for API call
});
