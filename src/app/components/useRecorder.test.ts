import { renderHook, act } from '@testing-library/react';
import { useRecorder } from './useRecorder';
import { transcribeAudioStream, speakText, callLLM } from "../../lib/api/SendAudioStream";
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the external dependencies
vi.mock("../../lib/api/SendAudioStream", () => ({
  transcribeAudioStream: vi.fn(),
  speakText: vi.fn(),
  callLLM: vi.fn()
}));

describe('useRecorder', () => {
  // Mock MediaRecorder and getUserMedia
  // Simpler approach
global.MediaStream = vi.fn().mockImplementation(() => ({
  // Add any properties you need
  getTracks: () => [],
  addTrack: vi.fn(),
}));

const mockStream = new MediaStream();
  const mockMediaRecorder = {
    start: vi.fn(),
    stop: vi.fn(),
    ondataavailable: vi.fn()
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock navigator.mediaDevices.getUserMedia
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue(mockStream)
    } as any;

    // Mock MediaRecorder
    global.MediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorder) as any;

    // Mock AudioContext and AnalyserNode
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createAnalyser: () => ({
        fftSize: 32,
        frequencyBinCount: 16,
        getByteFrequencyData: vi.fn(),
      }),
      createMediaStreamSource: () => ({
        connect: vi.fn()
      }),
      close: vi.fn()
    })) as any;
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useRecorder({ 
      conversationId: '123', 
      setConversationState: vi.fn() 
    }));

    expect(result.current.isRecording).toBe(false);
    expect(result.current.volumeLevels).toEqual(Array(15).fill(0));
    expect(typeof result.current.startRecording).toBe('function');
    expect(typeof result.current.stopRecording).toBe('function');
  });

  it('should handle startRecording correctly', () => {
    const mockSetConversationState = vi.fn();
    const { result } = renderHook(() => useRecorder({ 
      conversationId: '123', 
      setConversationState: mockSetConversationState 
    }));

    act(() => {
      result.current.startRecording();
    });

    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(true);
    expect(mockSetConversationState).toHaveBeenCalledWith('listening');
  });

  it('should handle stopRecording correctly', () => {
    const mockSetConversationState = vi.fn();
    const { result } = renderHook(() => useRecorder({ 
      conversationId: '123', 
      setConversationState: mockSetConversationState 
    }));

    act(() => {
      result.current.startRecording();
      result.current.stopRecording();
    });

    expect(mockMediaRecorder.stop).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);
    expect(mockSetConversationState).toHaveBeenCalledWith('thinking');
  });

  it('should process audio data when available', async () => {
    const mockResponse = { response: 'Hello' };
    (callLLM as any).mockResolvedValue(mockResponse);

    renderHook(() => useRecorder({ 
      conversationId: '123', 
      setConversationState: vi.fn() 
    }));

    // Simulate ondataavailable event
    const mockBlob = new Blob(['test'], { type: 'audio/wav' });
    await act(async () => {
      await mockMediaRecorder.ondataavailable({ data: mockBlob });
    });

    expect(transcribeAudioStream).toHaveBeenCalled();
    expect(callLLM).toHaveBeenCalledWith('123');
    expect(speakText).toHaveBeenCalledWith('Hello');
  });
});