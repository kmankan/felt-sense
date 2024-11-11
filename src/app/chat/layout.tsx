"use client";
import React, { useRef, useEffect } from "react";




export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    console.log("canvasRef", canvasRef);
    const canvas = canvasRef.current;
    if (canvas) {
      console.log("canvas", canvas);
      const gl = canvas.getContext("webgl");
      if (gl) {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        const vertexShader = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragmentShader = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;

      vec3 pastelBlue = vec3(0.68, 0.85, 0.9);      // Soft sky blue
      vec3 pastelLavender = vec3(0.8, 0.7, 0.9);    // Gentle lavender
      vec3 pastelPink = vec3(0.95, 0.75, 0.8);      // Warm pink
      vec3 warmBeige = vec3(0.95, 0.9, 0.8);        // Soft beige

      // Smooth interpolation function
      float smooth_mix(float a, float b, float t) {
          t = t * t * (3.0 - 2.0 * t);
          return mix(a, b, t);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy/resolution.xy;
        float t = time * 0.2;  // Slowed down time for gentler transitions
        
        // Create soft, flowing movement
        float flow = smooth_mix(
          sin(uv.x * 2.0 + t + sin(uv.y + t) * 0.5),
          cos(uv.y * 2.0 - t + sin(uv.x - t) * 0.5),
          sin(t * 0.2) * 0.5 + 0.5
        );
        
        // Normalize flow to [0,1]
        flow = flow * 0.5 + 0.5;
        
        // Create smooth transitions between four colors
        vec3 color;
        if(flow < 0.33) {
          color = mix(pastelBlue, pastelLavender, smooth_mix(0.0, 1.0, flow * 3.0));
        } else if(flow < 0.66) {
          color = mix(pastelLavender, pastelPink, smooth_mix(0.0, 1.0, (flow - 0.33) * 3.0));
        } else {
          color = mix(pastelPink, warmBeige, smooth_mix(0.0, 1.0, (flow - 0.66) * 3.0));
        }
        
        // Add subtle variation
        float brightness = 1.0 + sin(uv.x * 4.0 + t) * 0.05 + cos(uv.y * 4.0 - t) * 0.05;
        color *= brightness;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

        function createShader(gl, type, source) {
          const shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          return shader;
        }

        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
        gl.linkProgram(program);
        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, 'time');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');

        function resize() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        }

        window.addEventListener('resize', resize);
        resize();

        function render(time) {
          gl.uniform1f(timeLocation, time / 1000);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
        // Initialize your WebGL shader here
        // Example: gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2000, background: 'linear-gradient(to right, lightblue, lightpink)' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -500 }} />
      {children}
    </>
  );
}
