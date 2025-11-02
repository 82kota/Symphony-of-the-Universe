import { useEffect, useRef } from "react";

interface AudioVisualiserProps {
  audioCtx: AudioContext;
  analyserSource: MediaElementAudioSourceNode;
  colour?: "red" | "green" | "blue";
}

export default function AudioVisualiser({
  audioCtx,
  analyserSource,
  colour = "red",
}: AudioVisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const analyser = audioCtx.createAnalyser();
    analyserSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasCtx = canvas.getContext("2d")!;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    let drawVisual: number;

    //how the visualiser is drawn
    function draw() {
      drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgb(0 0 0)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        let r = 0,
          g = 0,
          b = 0;
        switch (colour) {
          case "red":
            r = barHeight + 100;
            break;
          case "green":
            g = barHeight + 100;
            break;
          case "blue":
            b = barHeight + 100;
            break;
        }

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    draw();
    return () => cancelAnimationFrame(drawVisual);
  }, [audioCtx, analyserSource, colour]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="w-full h-full rounded-3xl"
    />
  );
}
