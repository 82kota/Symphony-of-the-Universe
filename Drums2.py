# jazz_radioactive_drums_pygame.py
# Radioactive hits → jazz drum solo. Uses pygame.mixer for sample playback.

import os
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import pygame

# ---------- Audio setup (pygame) ----------
pygame.mixer.pre_init(frequency=44100, size=-16, channels=2, buffer=512)
pygame.init()

SAMPLES_DIR = "samples"
KIT_FILES = {
    "ride":  os.path.join(SAMPLES_DIR, "ride.wav"),
    "snare": os.path.join(SAMPLES_DIR, "snare.wav"),
    "kick":  os.path.join(SAMPLES_DIR, "kick.wav"),
    "hihat": os.path.join(SAMPLES_DIR, "hihat.wav"),
}

# Load samples
KIT = {}
for name, path in KIT_FILES.items():
    if not os.path.exists(path):
        raise SystemExit(f"Missing sample: {path}")
    KIT[name] = pygame.mixer.Sound(path)

# Create a few mixer channels for overlapping hits
CHANNELS = [pygame.mixer.Channel(i) for i in range(8)]
_chan_idx = 0
def play(name, volume=1.0):
    global _chan_idx
    ch = CHANNELS[_chan_idx % len(CHANNELS)]
    _chan_idx += 1
    snd = KIT[name]
    ch.set_volume(max(0.0, min(1.0, float(volume))))
    ch.play(snd)

# ---------- Quadrant logic ----------
def quadrant_of(x, y):
    if x > 0 and y > 0:  return "Q1"  # +x,+y
    if x < 0 and y > 0:  return "Q2"  # -x,+y
    if x < 0 and y < 0:  return "Q3"  # -x,-y
    if x > 0 and y < 0:  return "Q4"  # +x,-y
    # hits on axes -> pick something musical
    return "Q1" if y >= 0 else "Q3"

QUADRANT_TO_PIECE = {
    "Q1": "ride",   # timekeeping
    "Q2": "snare",  # comping
    "Q3": "kick",   # feathered bass
    "Q4": "hihat",  # hat time
}

# ---------- “Humanization” ----------
rng = np.random.default_rng(123)
VEL_LOW, VEL_HIGH = 0.85, 1.10   # velocity jitter range
GHOST_SNARE_PROB = 0.12
HIHAT_DOUBLE_PROB = 0.10

def human_vel():
    return float(rng.uniform(VEL_LOW, VEL_HIGH))

# ---------- Simulation parameters ----------
seed = 17
frames = 360
fps = 4
expected_hits = 1
sigma = 0.22
screen_size = 1.0
marker_size = 10

if seed is not None:
    np.random.seed(seed)

# Pre-generate events
xs_all, ys_all, fs_all = [], [], []
for f in range(frames):
    n = np.random.poisson(expected_hits)
    xs_all.append(np.random.normal(0.0, sigma, size=n))
    ys_all.append(np.random.normal(0.0, sigma, size=n))
    fs_all.append(np.full(n, f, dtype=int))

X = np.concatenate(xs_all) if xs_all else np.array([])
Y = np.concatenate(ys_all) if ys_all else np.array([])
F = np.concatenate(fs_all) if fs_all else np.array([])

# ---------- Plot ----------
fig, ax = plt.subplots(figsize=(6, 6))
ax.set_xlim(-screen_size, screen_size)
ax.set_ylim(-screen_size, screen_size)
ax.set_aspect("equal", adjustable="box")
ax.set_xlabel("x (arb.)")
ax.set_ylabel("y (arb.)")
ax.set_title("Radioactive → Jazz drums (quadrants = kit)")
ax.axvline(0, linewidth=0.5, linestyle="--")
ax.axhline(0, linewidth=0.5, linestyle="--")
scat = ax.scatter([], [], s=marker_size)

def update(frame):
    # visual (cumulative)
    mask_cum = (F <= frame)
    scat.set_offsets(np.column_stack([X[mask_cum], Y[mask_cum]]) if mask_cum.any() else np.empty((0, 2)))

    # audio (new hits)
    mask_new = (F == frame)
    if mask_new.any():
        xs_new = X[mask_new]
        ys_new = Y[mask_new]
        for x, y in zip(xs_new, ys_new):
            q = quadrant_of(x, y)
            piece = QUADRANT_TO_PIECE[q]
            vel = human_vel()
            play(piece, volume=vel)

            # tasty extras
            if piece == "snare" and rng.random() < GHOST_SNARE_PROB:
                # ghost note shortly after (schedule by timer)
                pygame.time.set_timer(pygame.USEREVENT + 1, 40, loops=1)
                # store a lightweight closure via event
                pygame.event.post(pygame.event.Event(pygame.USEREVENT + 2, {"piece": "snare", "vol": 0.6 * vel}))
            if piece == "hihat" and rng.random() < HIHAT_DOUBLE_PROB:
                pygame.time.set_timer(pygame.USEREVENT + 3, 55, loops=1)
                pygame.event.post(pygame.event.Event(pygame.USEREVENT + 4, {"piece": "hihat", "vol": 0.9 * vel}))

    ax.set_title(f"Radioactive → Jazz drums (frame {frame+1}/{frames}) — total hits: {mask_cum.sum()}")
    # process any delayed mini-events
    for e in pygame.event.get([pygame.USEREVENT + 1, pygame.USEREVENT + 2, pygame.USEREVENT + 3, pygame.USEREVENT + 4]):
        if e.type in (pygame.USEREVENT + 2, pygame.USEREVENT + 4):
            play(e.dict["piece"], volume=e.dict["vol"])
    return scat,

interval_ms = int(1000 / fps)
anim = FuncAnimation(fig, update, frames=frames, interval=interval_ms, blit=True)

plt.show()

# Note: pygame.mixer keeps running while the script runs.
# Close the plot window to stop the performance.
