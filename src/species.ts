// src/species.ts
export type ApiSource = 'commons' | 'catapi' | 'dogapi';

export type SpeciesKey =
  | 'dog' | 'peacock' | 'cat' | 'monkey' | 'cow' | 'goat' | 'lion' | 'tiger';

export interface SpeciesDef {
  key: SpeciesKey;
  label: string;
  emoji: string;
  query: string;      // Wikimedia search query
  soundUrl: string;   // local or remote mp3/ogg/wav (kid‑friendly, short)
  apiSource: ApiSource;
}

export const USE_CAT_DOG_APIS = true; // flip to false to force Wikimedia for all

export const SPECIES: Record<SpeciesKey, SpeciesDef> = {
  dog: {
    key: 'dog',
    label: 'Dog',
    emoji: '🐶',
    query: 'dog',
    soundUrl: '/sounds/dog-bark.mp3',
    apiSource: USE_CAT_DOG_APIS ? 'dogapi' : 'commons',
  },
  peacock: {
    key: 'peacock',
    label: 'Peacock',
    emoji: '🦚',
    query: 'peacock bird',
    soundUrl: '/sounds/peacock-call.mp3',
    apiSource: 'commons',
  },
  cat: {
    key: 'cat',
    label: 'Cat',
    emoji: '🐱',
    query: 'cat',
    soundUrl: '/sounds/cat-meow.mp3',
    apiSource: USE_CAT_DOG_APIS ? 'catapi' : 'commons',
  },
  monkey: {
    key: 'monkey',
    label: 'Monkey',
    emoji: '🐒',
    query: 'monkey',
    soundUrl: '/sounds/monkey-chatter.mp3',
    apiSource: 'commons',
  },
  cow: {
    key: 'cow',
    label: 'Cow',
    emoji: '🐄',
    query: 'cow cattle',
    soundUrl: '/sounds/cow-moo.mp3',
    apiSource: 'commons',
  },
  goat: {
    key: 'goat',
    label: 'Goat',
    emoji: '🐐',
    query: 'goat',
    soundUrl: '/sounds/goat-bleat.mp3',
    apiSource: 'commons',
  },
  lion: {
    key: 'lion',
    label: 'Lion',
    emoji: '🦁',
    query: 'lion',
    soundUrl: '/sounds/lion-roar.mp3',
    apiSource: 'commons',
  },
  tiger: {
    key: 'tiger',
    label: 'Tiger',
    emoji: '🐯',
    query: 'tiger',
    soundUrl: '/sounds/tiger-growl.mp3',
    apiSource: 'commons',
  },
};

export const SPECIES_ORDER: SpeciesKey[] = [
  'dog','peacock','cat','monkey','cow','goat','lion','tiger'
];

export const speciesGrad: Record<SpeciesKey, string> = {
  dog: 'from-orange-400 to-pink-400',
  peacock: 'from-teal-400 to-cyan-400',
  cat: 'from-purple-400 to-fuchsia-400',
  monkey: 'from-amber-400 to-orange-500',
  cow: 'from-lime-400 to-emerald-400',
  goat: 'from-sky-400 to-indigo-400',
  lion: 'from-yellow-400 to-red-400',
  tiger: 'from-orange-500 to-red-500',
};
