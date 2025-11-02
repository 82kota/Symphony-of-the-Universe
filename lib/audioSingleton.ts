
let audioCtx: AudioContext | null = null;
const mediaSourceMap = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function getMediaSource(audioEl: HTMLAudioElement): MediaElementAudioSourceNode {
  if (mediaSourceMap.has(audioEl)) {
    return mediaSourceMap.get(audioEl)!;
  }
  const ctx = getAudioContext();
  const source = ctx.createMediaElementSource(audioEl);
  mediaSourceMap.set(audioEl, source);
  return source;
}
