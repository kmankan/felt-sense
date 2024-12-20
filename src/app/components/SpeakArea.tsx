/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { transcribeAudioStream, callLLM, generateSpeech } from "@/lib/api/SendAudioStream";
import { useChatStore } from "@/app/store/chat";
import { createNewConversation } from "@/lib/api/newConversation";

export default function SpeakArea() {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [volumeLevels, setVolumeLevels] = useState<number[]>(Array(15).fill(0));
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const {
        conversationState,
        setConversationState,
        conversationId,
        setConversationId,
        setCurrentMessage,
        setConversationInitiated,
        voice,
    } = useChatStore();
    const [showModal, setShowModal] = useState(true);
    const [isMobile] = useState(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    useEffect(() => {
        // Only initialize if conversationId
        if (conversationId) {
            const initMediaRecorder = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                    // Create and resume audio context
                    const context = new AudioContext();
                    await context.resume();
                    const analyserNode = context.createAnalyser();
                    analyserNode.fftSize = 32;

                    const source = context.createMediaStreamSource(stream);
                    source.connect(analyserNode);

                    setAudioContext(context);
                    setAnalyser(analyserNode);

                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);

                    recorder.ondataavailable = async (event) => {
                        if (event.data.size > 0) {
                            const audioBlob = new Blob([event.data], { type: "audio/wav" });
                            const audioStream = audioBlob.stream();

                            await transcribeAudioStream(audioStream, conversationId);
                            const response = await callLLM(conversationId);
                            setCurrentMessage(response.response);
                            setConversationState("speaking");
                            console.log("Voice: ", voice);
                            await generateSpeech(response.response, voice);
                            setConversationState("thinking");
                        }
                    };
                } catch (error) {
                    console.error("Error initializing media recorder:", error);
                }
            };

            initMediaRecorder();
            console.log("Media recorder initialized");
            console.log("Voice: ", voice);
        }

        return () => {
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [conversationId, voice]);

    /// For audio animation
    useEffect(() => {
        let animationFrameId: number;

        const updateVolumeLevels = () => {
            if (analyser && isRecording) {
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);

                const newLevels = Array.from(dataArray)
                    .slice(0, 15)
                    .map(value => value / 255);

                setVolumeLevels(newLevels);
            }
            animationFrameId = requestAnimationFrame(updateVolumeLevels);
        };

        if (isRecording) {
            updateVolumeLevels();
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isRecording, analyser]);
    // console.log(volumeLevels);

    const recordAudio = async () => {
        try {
            console.log("Recording audio");
            if (mediaRecorder && audioContext) {
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                mediaRecorder.start();
                setIsRecording(true);
                console.log("Recording started");
                setConversationState("listening");
            }
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopAudio = async () => {
        console.log("Stopping audio", isMobile ? "on mobile" : "on desktop");
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            console.log("Audio stopped");
            setConversationState("thinking");

            // Pre-initialize audio for both mobile and desktop
            const audio = new Audio();
            try {
                if (isMobile) {
                    // Mobile needs more careful initialization
                    audio.muted = true;
                    await audio.play().catch(() => { });
                    audio.pause();
                    audio.muted = false;
                    console.log("Mobile audio pre-initialized");
                } else {
                    // Desktop initialization
                    await audio.play().catch(() => { });
                    audio.pause();
                    console.log("Desktop audio pre-initialized");
                }
            } catch (e) {
                console.log("Audio pre-initialization failed:", e);
            }
        }
    };

    // For space bar recording  
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault(); // Prevent default space bar behavior (scrolling)
                if (isRecording) {
                    stopAudio();
                } else {
                    recordAudio();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isRecording]);

    const handleStartSession = async () => {
        // create a new conversation
        const conversation = await createNewConversation();
        setConversationId(conversation.id);
        setConversationInitiated(true);
        console.log("Conversation created with id: ", conversation.id);
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-4 p-4 mt-auto">
            {showModal && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-25 z-50" />
                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
                            <h2 className="text-xl font-semibold mb-4">Welcome</h2>
                            <p className="text-gray-600 mb-6">Ready to start your conversation?</p>
                            <button
                                onClick={handleStartSession}
                                className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors"
                            >
                                Start a session
                            </button>
                        </div>
                    </div>
                </>
            )}
            {conversationState === "listening" ? <div className="flex gap-2">
                {volumeLevels.slice(5, 15).map((level, index) => (
                    <div
                        key={index}
                        className="bg-gray-300"
                        style={{
                            height: `${level * 100}px`, // Scale the height based on the volume level
                            width: '10px', // Width of each column
                            transition: 'height 0.1s ease-in-out' // Smooth transition for height changes
                        }}
                    />
                ))}
            </div> : <div className="text-gray-500 mb-2 mt-auto mx-auto">{conversationState === "speaking" ? "Speaking..." : conversationState === "thinking" ? "Thinking..." : "Listening..."}</div>
            }
            <div className="flex justify-center">
                <button
                    onClick={() => isRecording ? stopAudio() : recordAudio()}
                    className={`rounded-full sm:w-24 sm:h-24 w-16 h-16 bg-blue-500 mb-6 hover:bg-blue-600 ${isRecording ? 'animate-pulse' : ''}`}
                    style={{ aspectRatio: '1 / 1' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up" style={{ transform: 'scale(0.5)' }}>
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                </button>
            </div>
            {/* <div>
                {isRecording ? "Recording..." : "Not recording"}
            </div> */}

        </div>
    );
}