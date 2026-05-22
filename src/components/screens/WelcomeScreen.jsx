import { useState } from 'react';
import { ChevronRight, Volleyball, Table2 } from 'lucide-react';
import Ticker from '../Ticker.jsx';
import GroupsTable from '../GroupsTable.jsx';

export default function WelcomeScreen({ onStart, journey, coachName, onCoachChange, groupResults }) {
  const [showGroups, setShowGroups] = useState(false);

  // Edição local pra permitir input vazio sem aplicar o default em cada keystroke
  const [draftCoach, setDraftCoach] = useState(coachName);
  const commitCoach = () => onCoachChange(draftCoach.trim());

  return (
    <div className="paper min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />
      <div className="absolute inset-6 border border-stone-900/40 pointer-events-none" />

      <div className="relative z-10 px-10 pt-10 pb-6">
        <div className="flex items-center justify-between mb-12">
          <div className="f-mono text-xs uppercase tracking-widest">
            edition <span className="font-bold">{journey.edition}</span> · the official programme
          </div>
          <div className="f-mono text-xs uppercase tracking-widest">№ 01</div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="f-serif-i text-xl text-stone-700 mb-2 anim-slide-up stagger-1">presents a journey</div>
            <h1 className="f-display text-[10rem] leading-[0.85] anim-slide-up stagger-2" style={{ color: '#1A1A1A' }}>
              ROAD<br/>TO&nbsp;THE<br/>CUP
            </h1>
            <div className="mt-4 f-serif-i text-2xl text-stone-700 anim-slide-up stagger-3">
              an English-language challenge
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
            <div className="anim-slide-up stagger-3">
              <div className="f-mono text-xs uppercase mb-1">starring</div>
              <div className="f-display text-7xl leading-none">{journey.name}</div>
              <div className="f-display text-5xl leading-none" style={{ color: '#D62828' }}>{journey.year}</div>
              <div className="f-serif-i mt-1 text-stone-700">{journey.location}</div>

              {/* Treinador editável */}
              <div className="f-mono text-[10px] uppercase tracking-widest mt-3 text-stone-600 flex items-center gap-2 flex-wrap">
                <span>coached by</span>
                <input
                  type="text"
                  value={draftCoach}
                  onChange={(e) => setDraftCoach(e.target.value)}
                  onBlur={commitCoach}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  placeholder="Carlo Ancelotti"
                  maxLength={40}
                  className="bg-transparent border-b-2 border-stone-900/40 hover:border-stone-900 focus:border-stone-900 text-stone-900 font-bold uppercase tracking-widest px-1 outline-none w-48 transition-colors"
                />
              </div>
            </div>

            <div className="anim-slide-up stagger-4 mt-6 p-4 border-2 border-stone-900" style={{ backgroundColor: '#FFD500' }}>
              <div className="f-mono text-xs uppercase mb-1">the mission</div>
              <div className="f-serif text-lg font-bold leading-tight">
                {journey.matches.length} matches. {journey.matches.length * 5} questions. One trophy.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Ticker items={['answer correctly', 'create chances', 'beat the odds', 'lift the trophy', 'speak english', 'become the hexa']} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 py-10 gap-4">
        <div className="text-center anim-slide-up stagger-5">
          <div className="f-serif-i text-lg text-stone-700 mb-4">When you're ready…</div>
          <button
            onClick={onStart}
            className="anim-glow group inline-flex items-center gap-4 px-10 py-5 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition"
          >
            <Volleyball className="w-7 h-7 anim-ball" />
            <span className="f-display text-3xl">KICK OFF</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
          </button>
          <div className="f-mono text-xs uppercase tracking-widest mt-6 text-stone-600">
            {journey.matches.length} matches · group stage → final
          </div>
        </div>

        {/* Botão pra abrir tabela dos grupos */}
        <button
          onClick={() => setShowGroups(true)}
          className="anim-slide-up stagger-5 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-stone-900 hover:bg-stone-900 hover:text-white transition"
        >
          <Table2 className="w-4 h-4" />
          <span className="f-mono text-xs uppercase tracking-widest font-bold">ver tabela dos grupos</span>
        </button>
      </div>

      <div className="relative z-10 px-10 pb-6">
        <div className="border-t border-stone-900/30 pt-3 flex items-center justify-between f-mono text-[10px] uppercase tracking-widest text-stone-600">
          <span>{journey.motto}</span>
          <span>★ english · sports · victory ★</span>
          <span>vol. 1</span>
        </div>
      </div>

      {showGroups && (
        <GroupsTable
          onClose={() => setShowGroups(false)}
          highlightGroup={journey.group}
          groupResults={groupResults}
        />
      )}
    </div>
  );
}
