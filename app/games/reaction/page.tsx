'use client';

import { useState } from 'react';
import { GameLayout, PrimaryButton } from '@/components/games/GameLayout';

export default function ReactionGamePage() {
  const [state, setState] = useState<'ready' | 'waiting' | 'go' | 'done'>('ready');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  function start() {
    setState('waiting');
    setReactionTime(null);
    const delay = 1500 + Math.random() * 3000;
    setTimeout(() => {
      setStartTime(Date.now());
      setState('go');
    }, delay);
  }

  function click() {
    if (state === 'go') {
      setReactionTime(Date.now() - startTime);
      setState('done');
    } else if (state === 'waiting') {
      setState('ready');
      setReactionTime(-1);
    } else if (state === 'done') {
      start();
    }
  }

  const bg =
    state === 'waiting'
      ? 'bg-red-500'
      : state === 'go'
        ? 'bg-[#2563EB]'
        : 'bg-slate-200';

  return (
    <GameLayout
      title="Reaction Time"
      subtitle="Click as fast as you can when the box turns blue."
    >
      <div
        onClick={state === 'ready' ? start : click}
        className={`${bg} rounded-2xl p-16 md:p-20 text-center cursor-pointer select-none transition-colors shadow-sm border border-slate-200`}
      >
        {state === 'ready' && (
          <p className="text-2xl text-[#0F172A] font-medium">Click to start</p>
        )}
        {state === 'waiting' && (
          <p className="text-2xl text-white font-medium">Wait for blue...</p>
        )}
        {state === 'go' && (
          <p className="text-3xl font-bold text-white">CLICK NOW</p>
        )}
        {state === 'done' && (
          <div>
            {reactionTime !== null && reactionTime > 0 ? (
              <>
                <p className="text-5xl font-bold text-white">{reactionTime} ms</p>
                <p className="text-white/90 mt-4 text-sm">Click to try again</p>
              </>
            ) : (
              <>
                <p className="text-2xl text-white font-medium">Too early!</p>
                <p className="text-white/90 mt-4 text-sm">Click to retry</p>
              </>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-slate-500 text-sm mt-6">
        Average human reaction time is 200-250 ms. Athletes can reach ~150 ms.
      </p>
      {state === 'ready' && (
        <div className="text-center mt-6">
          <PrimaryButton onClick={start}>Start</PrimaryButton>
        </div>
      )}
    </GameLayout>
  );
}
