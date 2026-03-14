"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';

// ==========================================
// 1. KOMPONENTE: STERNENHIMMEL (HINTERGRUND)
// ==========================================
const StarField = React.memo(() => {
  const stars = useMemo(() => {
    return [...Array(250)].map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);
  return (
    <div className="absolute inset-0">
      {stars.map((star, i) => (
        <div key={i} className="absolute bg-white rounded-full"
          style={{ top: star.top, left: star.left, width: `${star.size}px`, height: `${star.size}px`, opacity: star.opacity }}
        />
      ))}
    </div>
  );
});
StarField.displayName = "StarField";

export default function Home() {
  // ==========================================
  // 2. STATES (ZUSTÄNDE & VARIABLEN)
  // ==========================================
  const [mounted, setMounted] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [hofTab, setHofTab] = useState<'private' | 'business'>('business');
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean, amount: number | string }>({ open: false, amount: 0 });
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // ==========================================
  // 3. FINANZEN & FORMELN
  // ==========================================
  const currentTotal = 20;
  const goalTotal = 1000000;

  const getVisualPos = (val: number | string) => {
    const amount = typeof val === 'string' ? parseFloat(val.replace(/\./g, '')) : val;
    if (isNaN(amount) || amount <= 0) return 0;
    return (Math.sqrt(amount) / Math.sqrt(goalTotal)) * 100;
  };

  // ==========================================
  // 4. DIE MEILENSTEINE (INHALT)
  // ==========================================
  const milestones = [
    { amount: 5000, title: "Profi-Ausrüstung", icon: "🎙️", desc: "Verbesserungsvorschläge? Ich upgrade für bessere Streamqualität." },
    { amount: 15000, title: "Mission Thailand", icon: "✈️", desc: "Ich packe meine Koffer und fliege nach Thailand." },
    { amount: 50000, title: "Eigene Basis", icon: "🏠", desc: "Nie wieder Miete. Ich kaufe mir meine eigene Wohnung und sichere mir meine Basis." },
    { amount: 100000, title: "Vollzeit Rebell", icon: "🔥", desc: "Geld gut angelegt in Aktien und ETF." },
    { amount: 200000, title: "Gründung Hilfsorganisation", icon: "🤝", desc: "Zeit, etwas zurückzugeben. Ich gründe eine eigene Organisation, um anderen zu helfen." },
    { amount: 500000, title: "Weltreise kostenlose Umarmungen", icon: "🌎", desc: "Ich reise um die Welt und verteile kostenlose Umarmungen." },
    { amount: 1000000, title: "Die Million", icon: "💎", desc: "Das Ziel ist erreicht. 10% (100.000€) werden umgehend gespendet." },
    { amount: "1.000.000+", title: "Grenzenlose Freiheit", icon: "👑", desc: "Alles über der Million wird zu 50% gespendet. Geld wird gut angelegt und von erzielten Renditen wird regelmäßig was gespendet. Wir verändern die Welt im Schlaf." },
  ];

  // ==========================================
  // 5. FUNKTIONEN (LOGIK)
  // ==========================================
  useEffect(() => { setMounted(true); }, []);
  const [isEn, setIsEn] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const donators = [{ name: "Sabine Buhre", min: "20", insta: "-", date: "18.02.2026" }];

  const partners = [
    {
      name: isEn ? "Your Company" : "Dein Unternehmen",
      logo: "/partner-placeholder.png",
      amount: "2324",
      desc: isEn 
        ? "Example logo - Secure this spot as a main partner." 
        : "Beispiellogo - Sichere dir diesen Platz als Hauptpartner."
    },
    ...Array(9).fill(null).map((_, i) => ({
      name: isEn ? "Your Brand here?" : "Deine Brand hier?",
      logo: null,
      amount: "500+",
      desc: isEn 
        ? `Secure spot ${i + 2} Hall of Fame.` 
        : `Sichere dir Platz ${i + 2} Hall of Fame.`
    }))
  ];

  const toggleAudio = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => { });
      setIsPlaying(!isPlaying);
    }
  };

  const openPayment = (val: number | string) => {
    setPaymentModal({ open: true, amount: val });
  };

  // ==========================================
  // 6. DAS LAYOUT (HTML / JSX)
  // ==========================================
  return (
    <main className="min-h-screen bg-[#00040a] text-white flex flex-col items-center p-6 font-sans relative overflow-x-hidden">
    {/* --- SPRACH-SWITCHER (MEDIUM) --- */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10000, display: 'flex', gap: '12px' }}>
        {/* DEUTSCH */}
        <button 
          onClick={() => { setIsEn(false); window.location.hash = ""; }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${!isEn ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-black/80 border-white/20 opacity-70'}`}
        >
          <img src="https://flagcdn.com/w40/de.png" alt="" className="w-6 h-auto rounded-sm" />
          <span className="font-bold text-sm text-white tracking-wide">DE</span>
        </button>

        {/* ENGLISCH */}
        <button 
          onClick={() => { setIsEn(true); window.location.hash = "en"; }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${isEn ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-black/80 border-white/20 opacity-70'}`}
        >
          <img src="https://flagcdn.com/w40/gb.png" alt="" className="w-6 h-auto rounded-sm" />
          <span className="font-bold text-sm text-white tracking-wide">EN</span>
        </button>
      </div>
      <audio ref={audioRef} src="/Schlafstreik.mp3" loop onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)} onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)} />

      {/* --- BANNER: SEITE IM AUFBAU --- */}
      <div className="w-full max-w-3xl bg-blue-600/20 border border-blue-500/50 rounded-2xl py-3 px-6 mb-8 relative z-50 text-center backdrop-blur-sm">
        <p className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm italic">
          Seite im Aufbau – Sleepstreams bald verfügbar!
        </p>
      </div>

      {/* --- GLOBAL STYLES & ANIMATIONEN --- */}
      <style jsx global>{`
        @keyframes shooting-star {
          0% { transform: translate(-100px, -100px) rotate(45deg); opacity: 0; width: 0px; }
          10% { opacity: 1; width: 150px; }
          40% { transform: translate(110vw, 110vh) rotate(45deg); opacity: 0; width: 250px; }
          100% { transform: translate(110vw, 110vh) rotate(45deg); opacity: 0; }
        }
        .star-line { position: absolute; height: 1.5px; background: linear-gradient(90deg, transparent, white); animation: shooting-star 14s linear infinite; pointer-events: none; }
        input[type='range'] { accent-color: #3b82f6; cursor: pointer; }
        .custom-scrollbar::-webkit-scrollbar { height: 10px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 10px; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* --- HINTERGRUND-EFFEKTE (MOND & STERNE) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {mounted && <StarField />}
        <div className="star-line top-[-5%] left-[10%]" />
        <div className="absolute top-[8%] right-[5%] w-36 h-36 md:w-72 md:h-72">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg" alt="Moon" className="w-full h-full object-cover rounded-full opacity-80" style={{ mixBlendMode: 'lighten', maskImage: 'radial-gradient(circle, black 65%, transparent 72%)' }} />
        </div>
      </div>

      {/* --- SIDEBAR: SUPPORT / LEBENSZEIT --- */}
      <div className="absolute left-10 top-[56%] -translate-y-1/2 flex flex-col gap-4 z-20 w-64 hidden xl:flex text-left">
        <div>
          <p className="text-blue-400 text-[12px] font-bold uppercase tracking-[0.2em]">Support</p>
          <h3 className="text-2xl font-black italic uppercase leading-tight text-white">SCHENKE <br /><span className="text-blue-500">LEBENSZEIT</span></h3>
        </div>
        <button onClick={() => openPayment(5)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-xl font-black text-lg shadow-lg uppercase transition-all hover:scale-105 active:scale-95 text-center">5 Min.<br /><span className="text-xs opacity-60">5,00 €</span></button>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 50].map((v) => (
            <button key={v} onClick={() => openPayment(v)} className="bg-white/5 border border-white/10 text-white py-4 rounded-lg font-black hover:bg-white/10 transition-all">{v}€</button>
          ))}
        </div>
        <input id="customMinDesk" type="number" placeholder="Minuten" className="bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-lm outline-none focus:border-blue-500 text-white placeholder:text-white/70" />
        <button onClick={() => { const i = document.getElementById('customMinDesk') as HTMLInputElement; openPayment(Number(i.value)); }} className="bg-indigo-600/60 text-white py-2 rounded-lg text-[17px] font-bold uppercase tracking-widest border border-white/70 font-black">Bestätigen</button>
      </div>

      {/* --- HEADER --- */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        <header className="mt-6 mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white">SCHLAFSTREIK</h1>
          <p className="text-blue-300 italic tracking-[0.3em] text-sm md:text-base">Träumend gegen das System.</p>
        </header>

        {/* --- VIDEO PLAYER --- */}
        <div className="w-full aspect-video bg-black/60 border border-white/10 rounded-[2rem] shadow-2xl flex items-center justify-center relative mb-8 overflow-hidden">
          {!isLive && (
            <div className="absolute inset-0 z-20 bg-[#00040a]/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
              <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-black uppercase italic tracking-widest text-white">Signal Offline</h3>
              <p className="text-white/40 text-[10px] uppercase font-bold mt-2">Der Stream startet in Kürze</p>
            </div>
          )}
          <iframe
            className={`w-full h-full transition-opacity duration-1000 ${isLive ? 'opacity-100' : 'opacity-0'}`}
            src="https://www.youtube.com/embed/live_stream?channel=UCqLmnT6O4yKVw1utCQJk1Pw&autoplay=1&mute=1"
            frameBorder="0"
            allowFullScreen>
          </iframe>
        </div>

        {/* --- MEILENSTEINE (DER WEG IN DIE FREIHEIT) --- */}
        <div className="w-full mb-4 text-left">
          <h3 className="text-blue-400 text-[12px] font-black uppercase tracking-[0.3em] mb-4">Der Weg in die Freiheit</h3>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x cursor-grab active:cursor-grabbing select-none"
          >
            {milestones.map((m, i) => {
              const isSelected = selectedMilestone === i;
              // Zeige Text bei allen an, wenn IRGENDEINER (nicht null) ausgewählt wurde
              const showAllDescriptions = selectedMilestone !== null;
              
              return (
                <div
                  key={i}
                  onClick={() => setSelectedMilestone(isSelected ? null : i)}
                  className={`min-w-[200px] snap-center cursor-pointer transition-all duration-300 border rounded-2xl p-4 backdrop-blur-md 
                    ${isSelected ? 'bg-blue-600/30 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-4xl">{m.icon}</span>
                    <div className={`text-blue-400 transition-transform ${isSelected ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-blue-500 font-black text-xl mt-4">
                    {typeof m.amount === 'number' ? m.amount.toLocaleString() : m.amount} € </p>
                  <h4 className="font-black uppercase italic text-[14px] leading-tight text-white mb-2">{m.title}</h4>
                  
                  {/* Geänderte Bedingung: Zeigt Text bei allen an, sobald einer aktiv ist */}
                  {showAllDescriptions && (
                    <div className="mt-3 pt-3 border-t border-white/10 animate-fadeIn">
                      <p className="text-[14px] text-white/70 leading-relaxed italic">{m.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- FORTSCHRITTSBALKEN --- */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 backdrop-blur-md">
          <div className="flex justify-between items-end mb-2 text-white">
            <div className="flex flex-col items-start">
              <span className="text-[12px] font-black text-blue-400 uppercase tracking-widest">Fortschritt</span>
              <span className="text-xl font-black italic">{currentTotal.toLocaleString()} €</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[12px] font-black text-white/40 uppercase tracking-widest">Ziel</span>
              <span className="text-xl font-black italic text-white/60">{goalTotal.toLocaleString()} €</span>
            </div>
          </div>

          <div className="w-full h-6 bg-black/60 rounded-full border border-white/10 relative overflow-hidden">
            <div
              className="h-full bg-blue-600 shadow-[0_0_20px_#2563eb] transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(getVisualPos(currentTotal), 0.8)}%` }}
            />
            {milestones.map((m, idx) => {
              const position = getVisualPos(m.amount);
              if (position >= 100 || position <= 0) return null;
              return (
                <div
                  key={idx}
                  className="absolute top-0 w-[2px] h-full bg-yellow-400 shadow-[0_0_8px_#facc15] z-30"
                  style={{ left: `${position}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* --- SOUNDTRACK / AUDIO PLAYER --- */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-12 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Offizieller Soundtrack</span>
              <h2 className="text-lg md:text-xl font-bold italic uppercase text-white leading-tight">Schlafstreik</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Erstellt von Marcel</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 bg-black/20 px-2 py-2 md:px-3 rounded-lg border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-12 md:w-16 h-1 bg-white/10 appearance-none rounded-full" />
              </div>
              <button onClick={toggleAudio} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition-all text-white">
                {isPlaying ? (<div className="flex gap-1"><div className="w-1.5 h-4 bg-white"></div><div className="w-1.5 h-4 bg-white"></div></div>) : (<div className="ml-1 w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent"></div>)}
              </button>
            </div>
          </div>
          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} className="w-full h-1 bg-white/10 appearance-none" />
        </div>

        <button onClick={() => setShowHallOfFame(true)} className="px-12 py-4 bg-white text-black font-black uppercase italic tracking-[0.2em] rounded-full transition-all hover:scale-110 active:scale-95 mb-10">Hall of fame</button>
      </div>

      {/* ==========================================
          7. MODALS (POPUPS) 
          ========================================== */}

      {/* --- PAYMENT MODAL --- */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-xl bg-black/90 p-4 cursor-pointer" onClick={() => setPaymentModal({ open: false, amount: 0 })}>
          <div className="bg-[#0f172a] border border-blue-500/30 w-full max-w-md rounded-[40px] p-8 md:p-10 text-center relative cursor-default" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPaymentModal({ open: false, amount: 0 })} className="absolute top-6 right-8 text-white/20 hover:text-white text-2xl">✕</button>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Support bestätigen</h3>
            <div className="mb-10 flex flex-col items-center">
              <div className="flex items-center gap-2">
                {paymentModal.amount === "" ? (
                  <input autoFocus type="number" placeholder="0" className="bg-transparent border-b-2 border-blue-500 text-6xl font-black w-32 text-center outline-none text-white" onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })} />
                ) : (
                  <span className="text-6xl font-black italic text-white">{paymentModal.amount}</span>
                )}
                <span className="text-4xl font-black text-blue-500">€</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase mt-2 font-bold tracking-widest text-white">Wähle deine Zahlungsmethode</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-8">
              <button onClick={() => { const val = paymentModal.amount || 0; window.open(`https://www.paypal.com/paypalme/marcelsmoney/${val}EUR`, '_blank'); }} className="w-full bg-[#0070ba] text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">PayPal</button>
              <button onClick={() => window.open("https://buy.stripe.com/00w8wP3Rx5CGfyA22caAw00", '_blank')} className="w-full bg-white/10 border border-white/20 text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-white/20 transition-all hover:scale-[1.02]">Stripe / Karte</button>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex gap-4 items-start text-left border border-white/10">
              <div className="bg-blue-600 p-2 rounded-lg mt-1 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <p className="text-[12px] text-white/70 leading-relaxed"><span className="text-white font-bold uppercase block mb-1">Hall of Fame Eintrag:</span>Schreibe mir nach der Zahlung kurz über das <span className="text-blue-400 font-bold italic">Chat-Symbol (unten rechts)</span> deinen Namen oder Instagram-Namen.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- HALL OF FAME MODAL --- */}
{showHallOfFame && (
  <div className="fixed inset-0 z-[500] flex items-center justify-center backdrop-blur-md bg-black/80 p-4 cursor-pointer" onClick={() => setShowHallOfFame(false)}>
    <div className="bg-[#0f172a] border-2 border-white/20 w-full max-w-3xl rounded-[2.5rem] p-6 md:p-10 relative flex flex-col max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setShowHallOfFame(false)} className="absolute top-6 right-8 text-white/40 text-2xl z-50">✕</button>
      <h2 className="text-3xl font-black uppercase italic mb-6 text-left text-white">Hall of <span className="text-blue-500">Fame</span></h2>
      
      <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
        <button onClick={() => setHofTab('business')} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${hofTab === 'business' ? 'bg-blue-600 text-white' : 'text-white/40'}`}>Partner</button>
        <button onClick={() => setHofTab('private')} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${hofTab === 'private' ? 'bg-blue-600 text-white' : 'text-white/40'}`}>Rebellen</button>
      </div>

      {/* DIESER WRAPPER MIT DEM KEY FIXT DEN BUG */}
      <div key={hofTab} className="flex flex-col overflow-hidden animate-fadeIn">
        
        {/* DER BLAUE KASTEN */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 mb-8 text-center">
          <p className="text-blue-400 font-black uppercase tracking-widest text-[13px] italic">
            {hofTab === 'business' ? "Logo-Platzierung ab 500 €" : "Werde Teil der Bewegung"}
          </p>
          <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">Die Rangliste wird nach Spendenhöhe sortiert.</p>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          {hofTab === 'business' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              {partners.map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col items-center relative">
                  <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full font-black text-[10px] text-white">{p.amount}€</div>
                  <div className="w-full aspect-square bg-black/40 rounded-2xl mb-4 flex items-center justify-center border border-white/5 overflow-hidden">
                    {p.logo ? (
                      <img src={p.logo} alt="Partner" className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">Beispiel Logo</span>
                        <span className="text-4xl opacity-10 font-black text-white">{i + 1}</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-black uppercase text-white">{p.name}</h4>
                  <p className="text-[10px] text-white/40 mt-1 uppercase font-bold text-center">{p.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto pb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-blue-400 text-[10px] uppercase font-black border-b border-white/10">
                    <th className="pb-4 w-12 text-center">Rang</th>
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Zeit</th>
                    <th className="pb-4">Instagram</th>
                    <th className="pb-4 text-right">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {donators.map((d, i) => {
                    const rank = i + 1;
                    const trophy = rank === 1 ? "🏆" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
                    return (
                      <tr key={i} className="border-b border-white/5 text-white hover:bg-white/5 transition-colors">
                        <td className="py-4 font-black text-center text-lg">
                          {trophy || <span className="text-sm opacity-30">{rank}</span>}
                        </td>
                        <td className={`py-4 font-bold ${rank <= 3 ? 'text-blue-100' : 'text-white'}`}>{d.name}</td>
                        <td className="py-4 font-black text-blue-400 uppercase">{d.min} MIN</td>
                        <td className="py-4 text-xs font-mono opacity-60">{d.insta}</td>
                        <td className="py-4 text-[10px] opacity-40 text-right">{d.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* --- CHAT INFO MODAL --- */}
      {showChatInfo && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center backdrop-blur-md bg-black/90 p-4 cursor-pointer" onClick={() => setShowChatInfo(false)}>
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 text-center cursor-default" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black italic uppercase mb-4 text-white">Let's Talk</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => window.open('https://instagram.com/_marcelslifestyle_', '_blank')} className="py-4 bg-white/5 rounded-xl border border-white/10 font-bold text-white hover:bg-white/10 transition-all">Instagram DM</button>
              <button onClick={() => window.open('mailto:marcel.lueck@outlook.com')} className="py-4 bg-white/5 rounded-xl border border-white/10 font-bold text-white hover:bg-white/10 transition-all">E-Mail schreiben</button>
            </div>
            <button onClick={() => setShowChatInfo(false)} className="mt-8 text-[10px] text-white/20 uppercase font-black hover:text-white transition-colors">Schließen</button>
          </div>
        </div>
      )}

      {/* --- DATENSCHUTZ MODAL --- */}
      {showDatenschutz && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center backdrop-blur-md bg-black/95 p-4 cursor-pointer" onClick={() => setShowDatenschutz(false)}>
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-3xl p-10 relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default text-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDatenschutz(false)} className="absolute top-6 right-8 text-white/40 text-2xl">✕</button>
            
            <h2 className="text-2xl font-black uppercase mb-6 italic border-b border-white/5 pb-4 text-left">
              {isEn ? "Privacy Policy" : "Datenschutz"}
            </h2>

            <div className="space-y-6 text-[12px] text-white/80 leading-relaxed pr-2 text-left">
              {isEn ? (
                <>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">1. General Information</h3>
                    <p>The protection of your data is our highest priority. This policy provides an overview of what happens to your personal data when you visit this website.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">2. Cookies & Storage</h3>
                    <p>We do not use cookies. No personal data of visitors is permanently stored on our own servers, except for the technically necessary logs of the hoster.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">3. Hosting & Data Transfer</h3>
                    <p>Our website is hosted by Vercel Inc. When accessing the site, server log files (IP address, browser, timestamp) are automatically recorded, which are necessary for secure operation.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">4. Third-Party Integrations</h3>
                    <p><strong>YouTube:</strong> We embed videos via YouTube. Data is transmitted to Google servers (including the USA) as soon as the stream is loaded.</p>
                    <p><strong>Payment Services (PayPal & Stripe):</strong> If you provide support, your payment data is transmitted directly to PayPal or Stripe. We do not store credit card data or passwords on our servers.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">5. Your Rights</h3>
                    <p>You have the right at any time to receive free information about the origin, recipient, and purpose of your stored data, as well as the right to correction or deletion of this data. Please contact us via email for this purpose.</p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">1. Allgemeine Informationen</h3>
                    <p>Der Schutz deiner Daten hat höchste Priorität. Diese Erklärung gibt dir einen Überblick, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">2. Cookies & Speicherung</h3>
                    <p>Wir verwenden keine Cookies. Auf unseren eigenen Servern werden keine personenbezogenen Daten von Besuchern dauerhaft gespeichert, außer den technisch notwendigen Protokollen des Hosters.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">3. Hosting & Datenübertragung</h3>
                    <p>Unsere Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite werden automatisch Server-Log-Dateien (IP-Adresse, Browser, Zeitstempel) erfasst, die für den sicheren Betrieb notwendig sind.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">4. Drittanbieter-Einbindungen</h3>
                    <p><strong>YouTube:</strong> Wir binden Videos über YouTube ein. Dabei werden Daten an Google-Server übertragen (auch in die USA), sobald der Stream geladen wird.</p>
                    <p><strong>Zahlungsdienste (PayPal & Stripe):</strong> Wenn du Support leistest, werden deine Zahlungsdaten direkt an PayPal oder Stripe übermittelt. Wir speichern keine Kreditkartendaten oder Passwörter auf unseren Servern.</p>
                  </section>
                  <section>
                    <h3 className="text-blue-400 font-black uppercase mb-2">5. Deine Rechte</h3>
                    <p>Du hast jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten Daten sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Kontaktiere uns dazu bitte per E-Mail.</p>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- IMPRESSUM MODAL --- */}
      {showImpressum && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center backdrop-blur-md bg-black/95 p-4 cursor-pointer" onClick={() => setShowImpressum(false)}>
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-3xl p-10 relative cursor-default text-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowImpressum(false)} className="absolute top-6 right-8 text-white/40 text-2xl">✕</button>
            <h2 className="text-2xl font-black uppercase mb-6 italic border-b border-white/5 pb-4 text-left">
              {isEn ? "Legal Notice" : "Impressum"}
            </h2>
            <div className="space-y-4 text-sm font-mono text-left">
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase">
                  {isEn ? "Operator" : "Betreiber"}
                </p>
                <p className="font-bold text-white">Marcel Lück</p>
                <p className="text-white">Möckernstraße 80, 28201 Bremen</p>
              </div>
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase">
                  {isEn ? "Contact" : "Kontakt"}
                </p>
                <p className="text-white">marcel.lueck@outlook.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="mt-10 flex flex-col items-center gap-4 pb-10 relative z-10 w-full text-center">
        <div className="flex gap-6">
          <button onClick={() => setShowImpressum(true)} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase font-bold">Impressum</button>
          <button onClick={() => setShowDatenschutz(true)} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase font-bold">Datenschutz</button>
        </div>
      </footer>

      {/* --- FLOATING CHAT BUTTON --- */}
      <div className="fixed bottom-6 right-6 z-[150]">
        <button onClick={() => setShowChatInfo(true)} className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      </div>
    </main>
    
  );
} 
// ==========================================
// AUTOMATISCHER ÜBERSETZUNGS-BLOCK
// ==========================================
if (typeof window !== 'undefined') {
  const dictionary: Record<string, string> = {
    "Seite im Aufbau – Sleepstreams bald verfügbar!": "Site under construction – Sleepstreams coming soon!",
    "Support": "Support",
    "SCHENKE": "GIVE",
    "LEBENSZEIT": "LIFETIME",
    "Bestätigen": "Confirm",
    "Träumend gegen das System.": "Dreaming against the system.",
    "Signal Offline": "Signal Offline",
    "Der Stream startet in Kürze": "The stream will start shortly",
    "Der Weg in die Freiheit": "The Road to Freedom",
    "Fortschritt": "Progress",
    "Ziel": "Goal",
    "Offizieller Soundtrack": "Official Soundtrack",
    "Erstellt von Marcel": "Created by Marcel",
    "Hall of fame": "Hall of Fame",
    "Partner": "Partners",
    "Rebellen": "Rebels",
    "Wähle deine Zahlungsmethode": "Choose payment method",
    "Support bestätigen": "Confirm Support",
    "Minuten": "Minutes",
    "Profi-Ausrüstung": "Pro Equipment",
    "Verbesserungsvorschläge? Ich upgrade für bessere Streamqualität.": "Suggestions? I'm upgrading for better stream quality.",
    "Mission Thailand": "Mission Thailand",
    "Ich packe meine Koffer und fliege nach Thailand.": "Packing my bags and flying to Thailand.",
    "Eigene Basis": "Own Base",
    "Nie wieder Miete. Ich kaufe mir meine eigene Wohnung und sichere mir meine Basis.": "No more rent. Buying my own apartment and securing my base.",
    "Vollzeit Rebell": "Full-time Rebel",
    "Geld gut angelegt in Aktien und ETF.": "Money well invested in stocks and ETFs.",
    "Gründung Hilfsorganisation": "Founding Charity",
    "Zeit, etwas zurückzugeben. Ich gründe eine eigene Organisation, um anderen zu helfen.": "Time to give back. I'm founding my own organization to help others.",
    "Weltreise kostenlose Umarmungen": "World Tour Free Hugs",
    "Ich reise um die Welt und verteile kostenlose Umarmungen.": "Traveling the world and giving out free hugs.",
    "Die Million": "The Million",
    "Das Ziel ist erreicht. 10% (100.000€) werden umgehend gespendet.": "Goal reached. 10% (100,000€) will be donated immediately.",
    "Grenzenlose Freiheit": "Limitless Freedom",
    "Alles über der Million wird zu 50% gespendet. Geld wird gut angelegt und von erzielten Renditen wird regelmäßig was gespendet. Wir verändern die Welt im Schlaf.": "Everything above the million is 50% donated. Money well invested, returns donated regularly. Changing the world while we sleep.",
    "Hall of Fame Eintrag:": "Hall of Fame Entry:",
    "Schreibe mir nach der Zahlung kurz über das": "After payment, send a quick message via the",
    "Chat-Symbol (unten rechts)": "Chat icon (bottom right)",
    "deinen Namen oder Instagram-Namen.": "with your name or Instagram handle.",
    "Logo-Platzierung ab 500 €": "Logo placement from 500 €",
    "Die Rangliste wird nach Spendenhöhe sortiert.": "The ranking is sorted by donation amount.",
    "Werde Teil der Bewegung": "Join the movement",
    "Rang": "Rank",
    "Name": "Name",
    "Zeit": "Time",
    "Datum": "Date",
    "Schließen": "Close",
    "Datenschutz": "Privacy Policy",
    "Impressum": "Imprint"
  };

  const originalTexts = new Map();

 const translate = () => {
    const isEn = window.location.hash === "#en";
    
    // 1. TEXT-KNOTEN
    const walk = (node: Node) => {
      if (node.nodeType === 3) {
        const text = node.nodeValue?.trim() || "";
        
        // Speichere das Original NUR, wenn es Deutsch ist (im Dictionary als Key existiert)
        if (!originalTexts.has(node) && dictionary[text]) {
          originalTexts.set(node, node.nodeValue);
        }

        if (isEn && dictionary[text]) {
          node.nodeValue = node.nodeValue!.replace(text, dictionary[text]);
        } else if (!isEn && originalTexts.has(node)) {
          node.nodeValue = originalTexts.get(node);
        }
      }
      node.childNodes.forEach(walk);
    };
    walk(document.body);

    // 2. INPUT-PLATZHALTER (Minuten FIX)
    document.querySelectorAll('input[placeholder]').forEach(input => {
      const currentPlaceholder = input.getAttribute('placeholder') || "";
      
      // Nur speichern, wenn wir ein deutsches Original finden
      if (!input.getAttribute('data-orig-placeholder') && dictionary[currentPlaceholder]) {
        input.setAttribute('data-orig-placeholder', currentPlaceholder);
      }

      const original = input.getAttribute('data-orig-placeholder');
      
      if (isEn && original && dictionary[original]) {
        input.setAttribute('placeholder', dictionary[original]);
      } else if (!isEn && original) {
        input.setAttribute('placeholder', original);
      }
    });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', translate);
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(translate, 100);
  }
}