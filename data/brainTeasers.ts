export type BrainTeaserCategory =
  | 'logic'
  | 'math'
  | 'lateral'
  | 'sequence'
  | 'word'
  | 'riddle';

export interface BrainTeaser {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: BrainTeaserCategory;
  difficulty: 1 | 2 | 3;
}

export const BRAIN_TEASER_BANK: BrainTeaser[] = [
  {
    id: 1,
    question: 'You overtake the person in 3rd place during a race. What place are you in now?',
    options: ['1st', '2nd', '3rd', '4th', '5th'],
    correctIndex: 2,
    category: 'logic',
    difficulty: 2,
  },
  {
    id: 2,
    question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.20', '$0.50'],
    correctIndex: 1,
    category: 'math',
    difficulty: 2,
  },
  {
    id: 3,
    question:
      'A man lives on the 20th floor. Every morning he takes the elevator down. On rainy days he rides back to the 20th floor. On sunny days he rides only to the 15th floor and walks the rest. Why?',
    options: [
      'He exercises on sunny days',
      'The elevator is broken above floor 15',
      'He is too short to reach the 20 button without his umbrella',
      'Floor 20 is closed on sunny days',
      'He visits a friend on floor 15',
    ],
    correctIndex: 2,
    category: 'lateral',
    difficulty: 3,
  },
  {
    id: 4,
    question: 'What number comes next in the sequence: 1, 1, 2, 3, 5, 8, __?',
    options: ['10', '11', '12', '13', '15'],
    correctIndex: 3,
    category: 'sequence',
    difficulty: 1,
  },
  {
    id: 5,
    question: 'What five-letter word becomes shorter when you add two letters to it?',
    options: ['Small', 'Short', 'Brief', 'Tiny', 'Little'],
    correctIndex: 1,
    category: 'word',
    difficulty: 2,
  },
  {
    id: 6,
    question:
      'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    options: ['A shadow', 'An echo', 'A cloud', 'A whisper', 'A flag'],
    correctIndex: 1,
    category: 'riddle',
    difficulty: 1,
  },
  {
    id: 7,
    question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would 100 machines take to make 100 widgets?',
    options: ['100 minutes', '20 minutes', '5 minutes', '10 minutes', '50 minutes'],
    correctIndex: 2,
    category: 'logic',
    difficulty: 2,
  },
  {
    id: 8,
    question: 'What is the next letter: O, T, T, F, F, S, S, __?',
    options: ['N', 'E', 'T', 'H', 'O'],
    correctIndex: 1,
    category: 'sequence',
    difficulty: 2,
  },
  {
    id: 9,
    question:
      'A farmer has 17 sheep. All but 9 die. How many sheep does the farmer have left?',
    options: ['8', '9', '17', '0', '1'],
    correctIndex: 1,
    category: 'logic',
    difficulty: 1,
  },
  {
    id: 10,
    question: 'What has keys but no locks, space but no room, and you can enter but not go inside?',
    options: ['A map', 'A keyboard', 'A book', 'A piano', 'A door'],
    correctIndex: 1,
    category: 'riddle',
    difficulty: 2,
  },
  {
    id: 11,
    question: 'If you multiply all the numbers on a telephone keypad, what do you get?',
    options: ['0', '362880', '10', '1', '5040'],
    correctIndex: 0,
    category: 'math',
    difficulty: 1,
  },
  {
    id: 12,
    question:
      'A man pushes his car to a hotel and tells the owner he is bankrupt. What classic board game does this describe?',
    options: ['Chess', 'Monopoly', 'Clue', 'Risk', 'Scrabble'],
    correctIndex: 1,
    category: 'lateral',
    difficulty: 2,
  },
  {
    id: 13,
    question: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
    options: ['The letter M', 'Time', 'A breath', 'Light', 'The number 1'],
    correctIndex: 0,
    category: 'word',
    difficulty: 2,
  },
  {
    id: 14,
    question: 'What is the next number: 2, 6, 12, 20, 30, __?',
    options: ['36', '40', '42', '44', '48'],
    correctIndex: 2,
    category: 'sequence',
    difficulty: 2,
  },
  {
    id: 15,
    question:
      'Brothers and sisters I have none, but this man\'s father is my father\'s son. Who is the man in the photograph?',
    options: ['My son', 'My father', 'Myself', 'My uncle', 'My brother'],
    correctIndex: 0,
    category: 'logic',
    difficulty: 3,
  },
  {
    id: 16,
    question:
      'A lily pad doubles in size every day. If it takes 48 days to cover the entire pond, on what day does it cover half the pond?',
    options: ['24 days', '47 days', '46 days', '12 days', '40 days'],
    correctIndex: 1,
    category: 'math',
    difficulty: 2,
  },
  {
    id: 17,
    question:
      'You are in a room with three light switches. One controls a bulb in another room. You may flip switches, then visit the other room once. How do you determine which switch controls the bulb?',
    options: [
      'Flip all three and check',
      'Flip one, wait, flip a second, use heat and light to identify all three',
      'It is impossible with one visit',
      'Ask someone in the other room',
      'Flip them randomly until it works',
    ],
    correctIndex: 1,
    category: 'lateral',
    difficulty: 3,
  },
  {
    id: 18,
    question: 'Rearrange the letters in "CIFAIPC" to name a well-known ocean creature.',
    options: ['Dolphin', 'Pacific', 'Shark', 'Atlantic', 'Coral'],
    correctIndex: 1,
    category: 'word',
    difficulty: 3,
  },
  {
    id: 19,
    question:
      'The more you take, the more you leave behind. What are they?',
    options: ['Memories', 'Footsteps', 'Breaths', 'Photos', 'Words'],
    correctIndex: 1,
    category: 'riddle',
    difficulty: 1,
  },
  {
    id: 20,
    question:
      'Three doctors said that Robert is their brother. Robert says he has no brothers. Who is lying?',
    options: [
      'Robert is lying',
      'The doctors are lying',
      'Nobody is lying',
      'Robert is a doctor',
      'The doctors are women',
    ],
    correctIndex: 4,
    category: 'logic',
    difficulty: 2,
  },
];
