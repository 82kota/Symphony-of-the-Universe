import numpy as np
import pandas as pd
from scipy.io.wavfile import write
from scipy import signal

# -------- settings you can tweak --------
CSV_PATH = "gw_5min.csv"
OUT_WAV  = "gw_5min.wav"

# Playback speed factor. 1 = real-time; 4 plays 4x faster (higher pitch, shorter).
speedup = 0.5

# Optional bandpass to make it more "listenable" (Hz). Set to None to disable.
band = (0, 500.0)   # typical for GW "chirp" audibilization
filter_order = 0
# ----------------------------------------

# --- Load CSV ---
df = pd.read_csv(CSV_PATH)

if not {"time", "strain"}.issubset(df.columns):
    raise ValueError("CSV must contain 'time' and 'strain' columns.")

t = df["time"].to_numpy(dtype=float)
x = df["strain"].to_numpy(dtype=float)

# --- Estimate sampling rate from time column ---
# Use robust median spacing in case of tiny jitter
dt = np.median(np.diff(t))
if not np.isfinite(dt) or dt <= 0:
    raise ValueError("Could not determine a valid sample spacing from the 'time' column.")
fs = float(1.0 / dt)

# --- Handle NaNs (interpolate, filling edges too) ---
# If everything is NaN, abort early:
if np.all(~np.isfinite(x)):
    raise ValueError("All 'strain' values are NaN; nothing to export.")

x_series = pd.Series(x)
x_interp = x_series.interpolate(method="linear", limit_direction="both").to_numpy()

# --- Optional band-pass to emphasize audible content ---
if band is not None:
    nyq = 0.5 * fs
    low, high = band[0] / nyq, band[1] / nyq
    if high >= 1.0:
        high = min(high, 0.999)  # keep it stable if upper band is too high
    if low <= 0:
        low = max(low, 1e-6)
    sos = signal.butter(filter_order, [low, high], btype="bandpass", output="sos")
    x_filt = signal.sosfiltfilt(sos, x_interp)
else:
    x_filt = x_interp

# --- Remove any DC offset, just in case ---
x_filt = x_filt - np.mean(x_filt)

# --- Normalize to -1..1 for audio (peak normalize with small safety margin) ---
peak = np.max(np.abs(x_filt))
if not np.isfinite(peak) or peak == 0:
    raise ValueError("Signal has zero or invalid amplitude after processing.")
scaled = (x_filt / peak) * 0.99  # 0.99 to avoid hitting exactly 1.0

# --- Choose playback sampling rate (speedup changes pitch+duration) ---
fs_audio = int(round(fs * float(speedup)))

# --- Convert to 16-bit PCM and write WAV ---
audio_int16 = np.int16(np.clip(scaled, -1.0, 1.0) * 32767)
write(OUT_WAV, fs_audio, audio_int16)

print(f"Saved '{OUT_WAV}' at {fs_audio} Hz "
      f"({len(audio_int16)/fs_audio:.1f} seconds, speedup={speedup}x).")


#plot the data
import matplotlib.pyplot as plt
plt.plot(t, x)
plt.xlabel('Time (s)')
plt.ylabel('Strain')
plt.title('Gravitational Wave Signal')
plt.show()