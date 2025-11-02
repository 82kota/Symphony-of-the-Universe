import { useEffect, useRef } from "react";

interface AudioVisualiserProps {
  audioCtx: AudioContext;
  analyserSource: MediaElementAudioSourceNode;
  wave?: boolean;
  colour?: "red" | "green" | "blue" | "purple" | "orange" | "white";
}

function colourToRGB(colour: string) {
  let rgb = "rgb(255, 0, 0)";
  switch (colour) {
    case "red":
      rgb = "rgb(255, 0, 0)";
      break;
    case "green":
      rgb = "rgb(0, 255, 0)";
      break;
    case "blue":
      rgb = "rgb(0, 0, 255)";
      break;
    case "purple":
      rgb = "rgb(125, 0, 255)";
      break;
    case "orange":
      rgb = "rgb(255, 125, 0)";
      break;
    case "white":
      rgb = "rgb(255, 255, 255)";
      break;
  }
  return rgb;
}

export default function AudioVisualiser({
  audioCtx,
  analyserSource,
  wave = false,
  colour = "red",
}: AudioVisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const analyser = audioCtx.createAnalyser();
    analyserSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = wave ? 2048 : 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasCtx = canvas.getContext("2d")!;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    let drawVisual: number;

    //how the visualiser is drawn
    function drawBar() {
      drawVisual = requestAnimationFrame(drawBar);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgb(0 0 0)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = colourToRGB(colour);
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    //draw a waveform visualiser
    function drawWave() {
      drawVisual = requestAnimationFrame(drawWave);
      analyser.getByteTimeDomainData(dataArray);
      // Fill solid color
      canvasCtx.fillStyle = "rgb(0 0 0)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      // Begin the path
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = colourToRGB(colour);
      canvasCtx.beginPath();

      // Draw each point in the waveform
      const sliceWidth = WIDTH / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (HEIGHT / 2);

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      // Finish the line
      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    }

    wave ? drawWave() : drawBar();
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
