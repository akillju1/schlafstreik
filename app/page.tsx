"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';

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
  const [mounted, setMounted] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paymentModal, setPaymentModal] = useState<{open: boolean, amount: number}>({ open: false, amount: 0 });

  // LIVE SCHALTER (true = Stream sichtbar, false = Offline-Cover)
  const [isLive, setIsLive] = useState(false); 

  useEffect(() => { setMounted(true); }, []);

  // HALL OF FAME DATEN
  const donators = [
    { name: "Sabine Buhre", min: "20", insta: "-", date: "18.02.2026" }
  ];

  const toggleAudio = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="min-h-screen bg-[#00040a] text-white flex flex-col items-center p-6 font-sans relative overflow-x-hidden">
      <audio ref={audioRef} src="/Schlafstreik.mp3" loop onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)} onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)} />

      <style jsx global>{`
        @keyframes shooting-star {
          0% { transform: translate(-100px, -100px) rotate(45deg); opacity: 0; width: 0px; }
          10% { opacity: 1; width: 150px; }
          40% { transform: translate(110vw, 110vh) rotate(45deg); opacity: 0; width: 250px; }
          100% { transform: translate(110vw, 110vh) rotate(45deg); opacity: 0; }
        }
        .star-line { position: absolute; height: 1.5px; background: linear-gradient(90deg, transparent, white); animation: shooting-star 14s linear infinite; pointer-events: none; }
        input[type='range'] { accent-color: #3b82f6; cursor: pointer; }
      `}</style>

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {mounted && <StarField />}
        <div className="star-line top-[-5%] left-[10%]" style={{ animationDelay: '0s' }}></div>
        <div className="star-line top-[20%] left-[-10%]" style={{ animationDelay: '8s' }}></div>
        <div className="absolute top-[8%] right-[5%] w-36 h-36 md:w-72 md:h-72">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg" alt="Moon" className="w-full h-full object-cover rounded-full opacity-80" style={{ mixBlendMode: 'lighten', maskImage: 'radial-gradient(circle, black 65%, transparent 72%)' }} />
        </div>
      </div>

      {/* AUFBAU-INFO BANNER */}
      <div className="relative z-[40] w-full max-w-2xl mt-4 mb-4 bg-blue-600/20 border border-blue-500/40 backdrop-blur-md p-3 rounded-2xl flex items-center justify-center gap-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-blue-200 text-center">
          Seite im Aufbau – Sleepstreams bald verfügbar!
        </p>
      </div>

      {/* DESKTOP SPENDEN-SEKTION (Nur XL Bildschirme) */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 w-64 hidden xl:flex">
        <div className="mb-2 text-center">
          <p className="text-blue-400 text-[12px] font-bold uppercase tracking-[0.2em]">Support</p>
          <h3 className="text-2xl font-black italic uppercase">SCHENKE <span className="text-blue-500">LEBENSZEIT</span></h3>
        </div>
        <button onClick={() => setPaymentModal({open: true, amount: 5})} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-xl font-black text-lg shadow-lg uppercase transition-all hover:scale-105 active:scale-95 text-center">5 Min. schenken<br/><span className="text-xs opacity-60">5,00 €</span></button>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 50].map((v) => (
            <button key={v} onClick={() => setPaymentModal({open: true, amount: v})} className="bg-white/5 border border-white/10 py-4 rounded-lg font-black hover:bg-white/10 transition-all text-white">{v}€</button>
          ))}
        </div>
        <input id="customMin" type="number" placeholder="Minuten" className="bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-blue-500 text-white" />
        <button onClick={() => { const i = document.getElementById('customMin') as HTMLInputElement; setPaymentModal({open: true, amount: Number(i.value)}); }} className="bg-indigo-600/60 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 text-white font-black">Bestätigen</button>
      </div>

      {/* HAUPT-CONTENT */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        <header className="mt-6 mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white">SCHLAFSTREIK</h1>
          <p className="text-blue-300 italic tracking-[0.3em] text-sm md:text-base">Träumend gegen das System.</p>
        </header>

        {/* MOBILE SPENDEN (Sichtbar auf Handys/Tablets) */}
        <div className="flex flex-col gap-3 w-full max-w-sm mb-10 xl:hidden z-20 px-4">
            <div className="text-center mb-1">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Support</p>
                <h3 className="text-xl font-black italic uppercase">SCHENKE <span className="text-blue-500">LEBENSZEIT</span></h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[5, 10, 20, 50].map((v) => (
                    <button key={v} onClick={() => setPaymentModal({open: true, amount: v})} className="bg-blue-600/20 border border-blue-500/40 p-4 rounded-2xl font-black text-sm uppercase shadow-lg active:scale-95 transition-all">
                        {v}€ <br/><span className="text-[9px] opacity-70 font-normal">{v} Min.</span>
                    </button>
                ))}
            </div>
            <button onClick={() => setPaymentModal({open: true, amount: 0})} className="bg-white/5 border border-white/10 p-3 rounded-xl font-black text-[10px] uppercase opacity-60 tracking-widest">Anderer Betrag</button>
        </div>

        {/* LIVE STREAM BEREICH */}
        <div className="w-full aspect-video bg-black/60 border border-white/10 rounded-[2rem] shadow-2xl flex items-center justify-center relative mb-8 overflow-hidden">
          {!isLive && (
            <div className="absolute inset-0 z-20 bg-[#00040a] flex flex-col items-center justify-center p-6">
              <div className="w-32 h-32 mb-4 opacity-10 bg-blue-500 rounded-full blur-3xl absolute"></div>
              <h3 className="text-xl font-black uppercase italic text-white/40 tracking-widest relative">Signal Offline</h3>
              <p className="text-[10px] text-blue-400/40 uppercase font-bold mt-2 tracking-[0.3em] relative">Nächster Streik in Kürze</p>
            </div>
          )}
          {isLive && (
            <div className="absolute top-6 left-6 flex items-center gap-2 z-30">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Signal</span>
            </div>
          )}
          <iframe 
            className={`w-full h-full transition-opacity duration-1000 ${isLive ? 'opacity-100' : 'opacity-0'}`}
            src="https://www.youtube.com/embed/live_stream?channel=UCqLmnT6O4yKVw1utCQJk1Pw&autoplay=1&mute=1" 
            title="Schlafstreik Live Stream" frameBorder="0" allowFullScreen>
          </iframe>
        </div>

        {/* PLAYER */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-12 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Official Soundtrack</span>
              <h2 className="text-xl font-bold italic uppercase text-white">Schlafstreik <span className="text-xs font-normal opacity-40 ml-2">by Marcel</span></h2>
            </div>
            <button onClick={toggleAudio} className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition-all">
              {isPlaying ? (<div className="flex gap-1.5"><div className="w-1.5 h-5 bg-white"></div><div className="w-1.5 h-5 bg-white"></div></div>) : (<div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent"></div>)}
            </button>
          </div>
          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} className="w-full h-1 bg-white/10 appearance-none mb-4" />
          <div className="flex items-center gap-4 border-t border-white/5 pt-4">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Volume</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(Number(e.target.value)); if (audioRef.current) audioRef.current.volume = Number(e.target.value); }} className="w-24 h-1 bg-white/10 appearance-none" />
          </div>
        </div>

        <button onClick={() => setShowHallOfFame(true)} className="px-12 py-4 bg-white text-black font-black uppercase italic tracking-[0.2em] rounded-full transition-all hover:scale-110 hover:shadow-[0_0_30px_white] active:scale-95 mb-10">Die Hall of Fame</button>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 flex flex-col items-center gap-4 pb-10 relative z-10 w-full text-white">
        <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Marcel 15.02.2026</p>
        <div className="flex gap-6">
          <button onClick={() => setShowImpressum(true)} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest font-bold">Impressum</button>
          <button onClick={() => setShowDatenschutz(true)} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest font-bold">Datenschutz</button>
        </div>
      </footer>

      {/* MODAL: PAYMENT */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-xl bg-black/90 p-4">
          <div className="bg-[#0f172a] border border-blue-500/30 w-full max-w-md rounded-[40px] p-8 md:p-10 text-center relative">
            <button onClick={() => setPaymentModal({open: false, amount: 0})} className="absolute top-6 right-8 text-white/20 hover:text-white text-2xl">✕</button>
            <div className="text-5xl font-black mb-6 italic text-white">{paymentModal.amount},00 €</div>
            <div className="mb-8 p-6 bg-blue-600/10 rounded-2xl border border-blue-500/30 text-left">
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3">Wichtig für die Hall of Fame:</p>
                <p className="text-[14px] text-white leading-relaxed font-bold">
                  Nutze bitte <span className="text-blue-400">NACH</span> der Zahlung den <span className="underline italic">Chat-Button unten rechts</span>!
                </p>
                <p className="text-[12px] text-white/60 mt-2 italic">Schick mir dort deinen Namen und/oder deinen Instagram-Namen wenn du in der Hall of Fame verewigt werden möchtest.</p>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => window.open(`https://www.paypal.com/paypalme/marcelsmoney/${paymentModal.amount}EUR`, '_blank')} className="w-full bg-[#0070ba] py-5 rounded-2xl font-black text-xl text-white">PayPal</button>
              <button onClick={() => window.open("https://buy.stripe.com/00w8wP3Rx5CGfyA22caAw00", '_blank')} className="w-full bg-white/10 border border-white/10 py-5 rounded-2xl text-[10px] font-black tracking-widest text-white uppercase">Stripe / Karte</button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-[150]">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></span>
          <button onClick={() => setShowChatInfo(true)} className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-blue-400/50 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-[#00040a]"></span>
          </button>
        </div>
      </div>

      {/* MODAL: CHAT INFO */}
      {showChatInfo && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center backdrop-blur-md bg-black/90 p-4">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 text-center text-white">
            <h2 className="text-xl font-black italic uppercase mb-4">Let's Talk</h2>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">Hier kannst du mir deinen Namen & Insta für die Hall of Fame schicken:</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => window.open('https://instagram.com/_marcelslifestyle_', '_blank')} className="py-4 bg-white/5 rounded-xl border border-white/10 font-bold hover:bg-white/10 transition-all">Instagram DM</button>
              <button onClick={() => window.open('mailto:marcel.lueck@outlook.com')} className="py-4 bg-white/5 rounded-xl border border-white/10 font-bold hover:bg-white/10 transition-all">E-Mail schreiben</button>
            </div>
            <button onClick={() => setShowChatInfo(false)} className="mt-8 text-[10px] text-white/20 uppercase font-black">Schließen</button>
          </div>
        </div>
      )}

      {/* MODAL: HALL OF FAME */}
      {showHallOfFame && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center backdrop-blur-md bg-black/80 p-4">
          <div className="bg-[#0f172a] border-2 border-white/20 w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 relative">
            <button onClick={() => setShowHallOfFame(false)} className="absolute top-6 right-8 text-white/40 text-2xl">✕</button>
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-8 italic text-white text-white">Hall of <span className="text-blue-500">Fame</span></h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[400px]">
                <thead>
                  <tr className="text-blue-400 text-[10px] uppercase font-black border-b border-white/10">
                    <th className="pb-4">Rebell</th>
                    <th className="pb-4">Support</th>
                    <th className="pb-4">Instagram</th>
                    <th className="pb-4 text-right">Datum</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {donators.map((d, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-4 font-bold">{d.name}</td>
                      <td className="py-4 font-black text-blue-300">{d.min} MIN</td>
                      <td className="py-4 text-xs opacity-60">{d.insta}</td>
                      <td className="py-4 text-[10px] opacity-40 text-right">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* IMPRESSUM & DATENSCHUTZ */}
      {showImpressum && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center backdrop-blur-md bg-black/95 p-4 text-white">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-3xl p-10 relative">
            <button onClick={() => setShowImpressum(false)} className="absolute top-6 right-8 text-white/40 text-2xl">✕</button>
            <h2 className="text-2xl font-black uppercase mb-6 italic border-b border-white/5 pb-4">Impressum</h2>
            <div className="space-y-4 text-sm font-mono">
              <div><p className="text-blue-400 text-[10px] font-black uppercase">Betreiber</p><p className="font-bold text-white">Marcel Lück</p><p>Möckernstraße 80, 28201 Bremen</p></div>
              <div><p className="text-blue-400 text-[10px] font-black uppercase">Kontakt</p><p className="text-white">marcel.lueck@outlook.com</p></div>
            </div>
          </div>
        </div>
      )}

      {showDatenschutz && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center backdrop-blur-md bg-black/95 p-4 text-white">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-3xl p-10 relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowDatenschutz(false)} className="absolute top-6 right-8 text-white/40 text-2xl">✕</button>
            <h2 className="text-2xl font-black uppercase mb-6 italic border-b border-white/5 pb-4">Datenschutz</h2>
            <div className="space-y-4 text-[12px] text-white/70 leading-relaxed font-sans">
              <p className="font-bold text-white">1. Datenverarbeitung</p>
              <p>Betrieb durch Vercel Inc. Erhebung von Server-Log-Dateien.</p>
              <p className="font-bold text-white">2. Spenden</p>
              <p>Abwicklung über PayPal/Stripe.</p>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}