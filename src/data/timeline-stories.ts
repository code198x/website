import type { StorySelection } from '../lib/timeline';

/** Connections summarise the linked, reviewed articles. Dates come from their metadata. */
export const timelineStories: StorySelection[] = [
  {
    id: 'sound', label: 'Games find their sound', title: 'How did games find their sound?', machine: 'commodore-64',
    description: 'Follow the instruments inside the computer, the people writing for them, and the tools that put music on the screen.',
    steps: [
      { article: 'hardware/sid-chip', connection: 'The C64’s SID puts three synthesiser voices, envelopes and a filter on one chip.' },
      { article: 'games/commando', connection: 'Rob Hubbard’s C64 music shows what a composer could make of that hardware.' },
      { article: 'software/soundtracker', connection: 'On the Amiga, SoundTracker arranges sampled instruments in columns of notes.' },
      { article: 'software/protracker', connection: 'ProTracker continues the tracker approach through shared tools and module files.' },
    ],
  },
  {
    id: 'arcades', label: 'Movement changes the game', title: 'What changes when the enemies move?',
    description: 'Compare three arcade games through a design choice: the way an opponent moves, and what that asks of the player.',
    steps: [
      { article: 'games/space-invaders', connection: 'A formation advances together, speeding up as its numbers fall.' },
      { article: 'games/galaxian', connection: 'Aliens leave the formation to dive at the player.' },
      { article: 'games/pac-man', connection: 'Four ghosts pursue a player through a maze, each using a different targeting rule.' },
    ],
  },
  {
    id: 'making', label: 'More ways to make games', title: 'Who gets to make a game?', machine: 'sinclair-zx-spectrum',
    description: 'A built-in language, an adventure writer and a games BASIC offer different answers. Follow the tools as well as the finished games.',
    steps: [
      { article: 'languages/sinclair-basic', connection: 'A language in the computer’s ROM makes entering and changing a program part of everyday use.' },
      { article: 'tools/the-quill', connection: 'The Quill lets authors build text adventures without writing the machine-code engine.' },
      { article: 'tools/graphic-adventure-creator', connection: 'Graphic Adventure Creator brings pictures and an adventure editor together.' },
      { article: 'languages/amos', connection: 'AMOS gives Amiga programmers a BASIC with graphics, sound and animation facilities.' },
    ],
  },
];
