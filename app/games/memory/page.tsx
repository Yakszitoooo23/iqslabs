'use client';

import { useState } from 'react';
import { GameLayout, PrimaryButton } from '@/components/games/GameLayout';

const COLORS = [
  { id: 0, className: 'bg-red-500', label: 'Red' },
  { id: 1, className: 'bg-blue-500', label: 'Blue' },
  { id: 2, className: 'bg-green-500', label: 'Green' },
  { id: 3, className: 'bg-yellow-400', label: 'Yellow' },
];

export default function MemoryGamePage() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'done'>('idle');
  const [showIdx, setShowIdx] = useState(-1);
  const [round, setRound] = useState(0);

  function showSequence(seq: number[]) {
    setPhase('showing');
    let i = 0;
    const interval = setInterval(() => {
      setShowIdx(seq[i]);
      setTimeout(() => setShowIdx(-1), 400);
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('input'), 500);
      }
    }, 700);
  }

  function startGame() {
    const newSeq = [Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setUserSeq([]);
    setRound(1);
    showSequence(newSeq);
  }

  function handleClick(idx: number) {
    if (phase !== 'input') return;
    const next = [...userSeq, idx];
    setUserSeq(next);

    if (sequence[next.length - 1] !== idx) {
      setPhase('done');
      return;
    }

    if (next.length === sequence.length) {
      const extended = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(extended);
      setUserSeq([]);
      setRound((r) => r + 1);
      setTimeout(() => showSequence(extended), 600);
    }
  }

  return (
    <GameLayout
      title="Memory Sequence"
      subtitle="Watch the colors, then repeat the sequence. It gets longer each round."
    >
      {phase === 'idle' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center space-y-6">
          <p className="text-slate-600">
            Four colored tiles flash in order. Tap them back in the same order.
          </p>
          <PrimaryButton onClick={startGame}>Start</PrimaryButton>
        </div>
      )}

      {phase !== 'idle' && (
        <>
          <p className="text-center text-slate-500 mb-6">
            Round {round} · Sequence length {sequence.length}
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => handleClick(color.id)}
                disabled={phase !== 'input'}
                aria-label={color.label}
                className={`${color.className} h-32 rounded-2xl transition-all shadow-sm border-2 border-white/20 ${
                  showIdx === color.id ? 'opacity-100 scale-105' : 'opacity-50'
                } ${phase === 'input' ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
              />
            ))}
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center mt-8 space-y-4">
          <p className="text-2xl font-bold text-[#0F172A]">Game Over</p>
          <p className="text-slate-500">You reached round {round}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <PrimaryButton onClick={startGame}>Play Again</PrimaryButton>
            <a
              href="/games"
              className="px-8 py-3 border border-slate-200 hover:border-[#2563EB] text-[#0F172A] font-semibold rounded-xl transition text-center"
            >
              Back to Games
            </a>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
