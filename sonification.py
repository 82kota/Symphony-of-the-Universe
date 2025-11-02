
import pandas as pd
import matplotlib.pylab as plt
from audiolazy_functions import str2midi, midi2str
from midiutil import MIDIFile

from midi2audio import FluidSynth


filename = 'datasets/Meteorite_Landings'
df = pd.read_csv(filename + '.csv')
print(df.head())

df = df.dropna(subset=['year', 'mass (g)'])  # remove missing rows

years = df['year'].values   #get age values in an array
masses = df['mass (g)'].values  #get diameter values in an array



def map_value(value, min_value, max_value, min_result, max_result):
    """maps value (or array of values) from one range to another"""

    result = min_result + (value - min_value) / (max_value - min_value) * (max_result - min_result)
    return result

times_myrs = max(years) - years  #measure time from 1st impact in data


#myrs_per_beat = 25  #conversion factor: Myrs for each beat of music
#t_data = times_myrs/myrs_per_beat #compress impact times from Myrs to beats
duration_beats = 52.8 #desired duration in beats (actually, onset of last note)
t_data = map_value(times_myrs, 0, max(times_myrs), 0,duration_beats)

bpm = 60  #beats per minute, if bpm = 60, 1 beat = 1 sec
duration_sec = duration_beats*60/bpm #duration in seconds
print('Duration:', duration_sec, 'seconds')

duration_beats = max(t_data)  #duration in beats (actually, onset of last note)
print('Duration:', duration_beats, 'beats')

y_data = map_value(masses, min(masses), max(masses), 0, 1)

y_scale = 0.5  #lower than 1 to spread out more evenly
y_data = y_data**y_scale

note_names = ['C1','C2','G2',
             'C3','E3','G3','A3','B3',
             'D4','E4','G4','A4','B4',
             'D5','E5','G5','A5','B5',
             'D6','E6','F#6','G6','A6']

note_midis = [str2midi(n) for n in note_names]
n_notes = len(note_midis)


print(str2midi('C3'))
print(midi2str(63))

midi_data = []
for i in range(len(y_data)):
    note_index = round(map_value(y_data[i], 0, 1, n_notes-1, 0))
    midi_data.append(note_midis[note_index])
plt.scatter(t_data, midi_data, s=50*y_data)
plt.xlabel('time [beats]')
plt.ylabel('midi note numbers')
plt.show()

vel_min, vel_max = 35, 127  # minimum and maximum note velocity
vel_data = []
for i in range(len(y_data)):
    note_velocity = round(map_value(y_data[i], 0, 1, vel_min, vel_max))
    vel_data.append(note_velocity)

#create midi file object, add tempo
my_midi_file = MIDIFile(1) #one track
my_midi_file.addTempo(track=0, time=0, tempo=bpm)

#add midi notes
for i in range(len(t_data)):
    my_midi_file.addNote(track=0, channel=0, time=t_data[i], pitch=midi_data[i], volume=vel_data[i], duration=2)
#create and save the midi file itself
with open(filename + '.mid', "wb") as f:
    my_midi_file.writeFile(f)

plt.scatter(t_data, midi_data, s=vel_data)
plt.xlabel('time [beats]')
plt.ylabel('midi note numbers')
plt.show()


fs = FluidSynth("soundfonts/Acapella_GM.sf2")
fs.midi_to_audio('datasets/Meteorite_Landings.mid', 'datasets/Meteorite_Landings.wav')