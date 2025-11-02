import numpy as np
import pandas as pd

fs = 4096
t = np.linspace(0, 8, fs*8)
noise = np.random.normal(0, 1e-21, size=len(t))
chirp = 1e-21*np.sin(2*np.pi*100*t**2)  # fake "chirp"
data = noise + chirp

#plot the data
import matplotlib.pyplot as plt
plt.plot(t, data)
plt.xlabel('Time (s)')
plt.ylabel('Strain')
plt.title('Simulated Gravitational Wave Signal with Noise')
plt.show()
#turn this data into a csv

df = pd.DataFrame({'time': t, 'strain': data})
df.to_csv('simulated_gw_data.csv', index=False)
#save the data to a csv file
#save as txt aswerll
df.to_csv('simulated_gw_data.txt', index=False, sep='\t')




import numpy as np
from scipy.io.wavfile import write

fs = 4096  # your sample rate
t = np.linspace(0, 4, fs*4)
data = np.random.normal(0, 1e-21, len(t)) + 5e-21*np.sin(2*np.pi*100*t**2)

# normalize to -1..1
scaled = data / np.max(np.abs(data))
speedup = 1
fs_audio = int(fs * speedup)
# Convert to 16-bit PCM values
audio = np.int16(scaled / np.max(np.abs(scaled)) * 32767)

write("ligo_sound.wav", fs_audio, audio)
print("Saved as ligo_sound.wav")
