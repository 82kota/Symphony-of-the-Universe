
let audioCtx: AudioContext | null = null;
let mediaSourceMap = new Map<HTMLAudioElement, MediaElementAudioSourceNode>();

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

 //Returns a MediaElementSource for a given audio element. Creates it only once per AudioContext.

export function getMediaSource(audioEl: HTMLAudioElement): MediaElementAudioSourceNode {
  if (mediaSourceMap.has(audioEl)) {
    return mediaSourceMap.get(audioEl)!;
  }

  const source = getAudioContext().createMediaElementSource(audioEl);
  mediaSourceMap.set(audioEl, source);
  return source;
}
