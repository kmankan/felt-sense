"use client";
import { useEffect, useState } from 'react';
import { Visualizer, useVisualizer } from 'react-sound-visualizer';

export default function SoundVisualizer() {
    const [audio, setAudio] = useState<MediaStream | null>(null);


    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: false,
            })
            .then(setAudio);
    }, []);

    return (
        <Visualizer audio={audio} mode="continuous">
            {({ canvasRef, stop, start, reset }) => (
                <>
                    <canvas ref={canvasRef} width={100} height={100} />

                    <div>
                        <button onClick={start}>Start</button>
                        <button onClick={stop}>Stop</button>
                        <button onClick={reset}>Reset</button>
                    </div>
                </>
            )}
        </Visualizer>
    );
}
