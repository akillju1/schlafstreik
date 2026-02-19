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
  const [hofTab, setHofTab] = useState<'private' | 'business'>('business');
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paymentModal, setPaymentModal] = useState<{open: boolean, amount: number | string}>({ open: false, amount: 0 });
  
  const [isLive, setIsLive] = useState(false); 

  const currentTotal = 20; 
  const goalTotal = 1000000;
  const progressPercent = (currentTotal / goalTotal) * 100;

  const milestones = [
    { amount: 5000, title: "Equipment Upgrade", icon: "🎙️" },
    { amount: 15000, title: "Mission Thailand", icon: "✈️" },
    { amount: 50000, title: "Home Base", icon: "🏠" },
    { amount: 100000, title: "Full-Time Rebel", icon: "🔥" },
    { amount: 200000, title: "Charity Foundation", icon: "🤝" },
    { amount: 1000000, title: "The Million Mark", icon: "💎" },
  ];

  useEffect(() => { setMounted(true); }, []);

  const donators = [{ name: "Sabine Buhre", min: "20", insta: "-", date: "18.02.2026" }];

  const partners = [
    { name: "Lumina Somnia Corp.", logo: "/partner-placeholder.png", amount: "2.324", desc: "Unterstützt die Freiheit des Schlafens." },
    ...Array(9).fill(null).map((_, i) => ({
      name: "Dein Unternehmen?",
      logo: null,
      amount: "500+",
      desc: "Sichere dir Platz " + (i + 2) + " in der Hall of Fame."
    }))
  ];

  const toggleAudio = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  const openPayment = (val: number | string) => {
    setPaymentModal({ open: true, amount: val });
  };

  return (
    <main className="min-h-screen bg-[#00040a] text-white flex flex-col items-center p-6 font-sans relative overflow-x-hidden">
      <audio ref={audioRef} src="/Schlafstreik.mp3" loop onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)} onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)} />

      {/* INFOBANNER GANZ OBEN */}
      <div className="w-full max-w-3xl bg-blue-600/20 border border-blue-500/50 rounded-2xl py-3 px-6 mb-8 relative z-50 text-center backdrop-blur-sm">
        <p className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm italic">
          Seite im Aufbau – Sleepstreams bald verfügbar!
        </p>
      </div>

      <style jsx global>{`
        @keyframes shooting-star {
          0% { transform: translate(-100px, -100px) rotate(45deg); opacity: 0; width: 0px; }
          10% { opacity: 1; width: 150px; }
          40% { transform: translate(110vw, 110vh) rotate(45deg); opacity: 0; width: 250px; }
          100% { transform: translate(110vw, 110vh) rotate(45deg); opacity: 0; }
        }
        .star-line { position: absolute; height: 1.5px; background: linear-gradient(90deg, transparent, white); animation: shooting-star 14s linear infinite; pointer-events: none; }
        input[type='range'] { accent-color: #3b82f6; cursor: pointer; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 10px; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {mounted && <StarField />}
        <div className="star-line top-[-5%] left-[10%]" />
        <div className="absolute top-[8%] right-[5%] w-36 h-36 md:w-72 md:h-72">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg" alt="Moon" className="w-full h-full object-cover rounded-full opacity-80" style={{ mixBlendMode: 'lighten', maskImage: 'radial-gradient(circle, black 65%, transparent 72%)' }} />
        </div>
      </div>

      <div className="absolute left-10 top-[60%] -translate-y-1/2 flex flex-col gap-4 z-20 w-64 hidden xl:flex text-left">
        <div>
          <p className="text-blue-400 text-[12px] font-bold uppercase tracking-[0.2em]">Support</p>
          <h3 className="text-2xl font-black italic uppercase leading-tight">SCHENKE <br/><span className="text-blue-500">LEBENSZEIT</span></h3>
        </div>
        <button onClick={() => openPayment(5)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-xl font-black text-lg shadow-lg uppercase transition-all hover:scale-105 active:scale-95 text-center text-white">5 Min.<br/><span className="text-xs opacity-60">5,00 €</span></button>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 50].map((v) => (
            <button key={v} onClick={() => openPayment(v)} className="bg-white/5 border border-white/10 py-4 rounded-lg font-black hover:bg-white/10 transition-all text-white">{v}€</button>
          ))}
        </div>
        <input id="customMinDesk" type="number" placeholder="Minuten" className="bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-blue-500 text-white" />
        <button onClick={() => { const i = document.getElementById('customMinDesk') as HTMLInputElement; openPayment(Number(i.value)); }} className="bg-indigo-600/60 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 font-black text-white">Bestätigen</button>
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        <header className="mt-6 mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white">SCHLAFSTREIK</h1>
          <p className="text-blue-300 italic tracking-[0.3em] text-sm md:text-base">Träumend gegen das System.</p>
        </header>

        <div className="w-full aspect-video bg-black/60 border border-white/10 rounded-[2rem] shadow-2xl flex items-center justify-center relative mb-8 overflow-hidden">
          {!isLive && (
            <div className="absolute inset-0 z-20 bg-[#00040a]/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
              <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-black uppercase italic text-white tracking-widest">Signal Offline</h3>
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

        <div className="w-full mb-4 text-left">
          <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">The Road to Freedom</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
            {milestones.map((m, i) => (
              <div key={i} className="min-w-[160px] snap-center bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                <span className="text-2xl">{m.icon}</span>
                <p className="text-blue-500 font-black text-sm mt-2">{m.amount.toLocaleString()} €</p>
                <h4 className="font-black uppercase italic text-[10px] text-white leading-tight">{m.title}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 backdrop-blur-md">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Fortschritt: {currentTotal}€</span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ziel: 1.000.000€</span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-blue-600 shadow-[0_0_15px_#2563eb]" style={{ width: `${Math.max(progressPercent, 0.2)}%` }} />
            </div>
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-12 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Official Soundtrack</span>
              <h2 className="text-xl font-bold italic uppercase text-white">Schlafstreik <span className="text-xs font-normal opacity-40 ml-2">by Marcel</span></h2>
            </div>
            <button onClick={toggleAudio} className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition-all text-white">
              {isPlaying ? (<div className="flex gap-1.5"><div className="w-1.5 h-5 bg-white"></div><div className="w-1.5 h-5 bg-white"></div></div>) : (<div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent"></div>)}
            </button>
          </div>
          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} className="w-full h-1 bg-white/10 appearance-none" />
        </div>

        <button onClick={() => setShowHallOfFame(true)} className="px-12 py-4 bg-white text-black font-black uppercase italic tracking-[0.2em] rounded-full transition-all hover:scale-110 active:scale-95 mb-10">Die Hall of Fame</button>
      </div>

      {paymentModal.open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-xl bg-black/90 p-4">
          <div className="bg-[#0f172a] border border-blue-500/30 w-full max-w-md rounded-[40px] p-8 md:p-10 text-center relative text-white">
            <button onClick={() => setPaymentModal({open: false, amount: 0})} className="absolute top-6 right-8 text-white/20 hover:text-white text-2xl">✕</button>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Support bestätigen</h3>
            <div className="mb-10 flex flex-col items-center">
                <div className="flex items-center gap-2">
                  {paymentModal.amount === "" ? (
                      <input autoFocus type="number" placeholder="0" className="bg-transparent border-b-2 border-blue-500 text-6xl font-black w-32 text-center outline-none text-white" onChange={(e) => setPaymentModal({...paymentModal, amount: e.target.value})} />
                  ) : (
                      <span className="text-6xl font-black italic">{paymentModal.amount}</span>
                  )}
                  <span className="text-4xl font-black text-blue-500">€</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase mt-2 font-bold tracking-widest">Wähle deine Zahlungsmethode</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-8">
              <button onClick={() => { const val = paymentModal.amount || 0; window.open(`https://www.paypal.com/paypalme/marcelsmoney/${val}EUR`, '_blank'); }} className="w-full bg-[#0070ba] py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 text-white">PayPal</button>
              <button onClick={() => window.open("https://buy.stripe.com/00w8wP3Rx5CGfyA22caAw00", '_blank')} className="w-full bg-white/10 border border-white/20 py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-white/20 transition-all hover:scale-[1.02] text-white">Stripe / Karte</button>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex gap-4 items-start text-left border border-white/10">
              <div className="bg-blue-600 p-2 rounded-lg mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <p className="text-[12px] text-white/70 leading-relaxed"><span className="text-white font-bold uppercase block mb-1">Hall of Fame Eintrag:</span>Schreibe mir nach der Zahlung kurz über das <span className="text-blue-400 font-bold italic">Chat-Fenster (unten rechts)</span> deinen Namen oder Instagram-Handle.</p>
            </div>
          </div>
        </div>
      )}

      {showHallOfFame && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center backdrop-blur-md bg-black/80 p-4 text-white">
          <div className="bg-[#0f172a] border-2 border-white/20 w-full max-w-3xl rounded-[2.5rem] p-6 md:p-10 relative flex flex-col max-h-[90vh]">
            <button onClick={() => setShowHallOfFame(false)} className="absolute top-6 right-8 text-white/40 text-2xl z-50">✕</button>
            <h2 className="text-3xl font-black uppercase italic mb-6 text-left">Hall of <span className="text-blue-500">Fame</span></h2>
            <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
              <button onClick={() => setHofTab('business')} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${hofTab === 'business' ? 'bg-blue-600' : 'text-white/40'}`}>Partner</button>
              <button onClick={() => setHofTab('private')} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${hofTab === 'private' ? 'bg-blue-600' : 'text-white/40'}`}>Rebellen</button>
            </div>
            <div className="overflow-y-auto custom-scrollbar">
              {hofTab === 'business' ? (
                <div>
                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 mb-8 text-center text-white">
                    <p className="text-blue-400 font-black uppercase tracking-widest text-[13px] italic">Logo-Platzierung ab 500 €</p>
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">Die Rangliste wird nach Spendenhöhe sortiert.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    {partners.map((p, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group flex flex-col items-center relative text-white">
                        <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full font-black text-[10px]">{p.amount}€</div>
                        <div className="w-full aspect-square bg-black/40 rounded-2xl mb-4 flex items-center justify-center border border-white/5 overflow-hidden text-white">
                          {p.logo ? <img src={p.logo} alt="Partner" className="w-full h-full object-contain p-4 text-white" /> : <span className="text-4xl opacity-10 font-black text-white">{i + 1}</span>}
                        </div>
                        <h4 className="font-black uppercase text-white">{p.name}</h4>
                        <p className="text-[10px] text-white/40 mt-1 uppercase font-bold text-center text-white">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-white">
                  <thead><tr className="text-blue-400 text-[10px] uppercase font-black border-b border-white/10"><th className="pb-4">Name</th><th className="pb-4">Zeit</th><th className="pb-4">Instagram</th><th className="pb-4 text-right">Datum</th></tr></thead>
                  <tbody>{donators.map((d, i) => (<tr key={i} className="border-b border-white/5 text-white"><td className="py-4 font-bold text-white">{d.name}</td><td className="py-4 font-black text-blue-300">{d.min} MIN</td><td className="py-4 text-xs font-mono opacity-60 text-white">{d.insta}</td><td className="py-4 text-[10px] opacity-40 text-right text-white">{d.date}</td></tr>))}</tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {showChatInfo && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center backdrop-blur-md bg-black/90 p-4">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 text-center text-white">
            <h2 className="text-xl font-black italic uppercase mb-4 text-white">Let's Talk</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => window.open('https://instagram.com/_marcelslifestyle_', '_blank')} className="py-4 bg-white/5 rounded-xl border border-white/10 font-bold text-white">Instagram DM</button>
              <button onClick={() => window.open('mailto:marcel.lueck@outlook.com')} className="py-4 bg-white/5 rounded-xl border border-white/10 font-bold text-white">E-Mail schreiben</button>
            </div>
            <button onClick={() => setShowChatInfo(false)} className="mt-8 text-[10px] text-white/20 uppercase font-black text-white">Schließen</button>
          </div>
        </div>
      )}

      <footer className="mt-10 flex flex-col items-center gap-4 pb-10 relative z-10 w-full text-center">
        <div className="flex gap-6">
          <button onClick={() => setShowImpressum(true)} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase font-bold text-white">Impressum</button>
          <button onClick={() => setShowDatenschutz(true)} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase font-bold text-white">Datenschutz</button>
        </div>
      </footer>

      {showDatenschutz && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center backdrop-blur-md bg-black/95 p-4 text-white">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-3xl p-10 relative max-h-[85vh] overflow-y-auto custom-scrollbar text-white">
            <button onClick={() => setShowDatenschutz(false)} className="absolute top-6 right-8 text-white/40 text-2xl text-white">✕</button>
            <h2 className="text-2xl font-black uppercase mb-6 italic border-b border-white/5 pb-4 text-white text-left">Datenschutz</h2>
            <div className="space-y-6 text-[12px] text-white/80 leading-relaxed pr-2 text-left text-white">
              <section><h3 className="text-blue-400 font-black uppercase mb-2">1. Allgemeine Informationen</h3><p>Der Schutz deiner Daten hat höchste Priorität. Diese Erklärung gibt dir einen Überblick, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst.</p></section>
              <section><h3 className="text-blue-400 font-black uppercase mb-2">2. Cookies & Speicherung</h3><p>Wir verwenden keine Cookies. Auf unseren eigenen Servern werden keine personenbezogenen Daten von Besuchern dauerhaft gespeichert, außer den technisch notwendigen Protokollen des Hosters.</p></section>
              <section><h3 className="text-blue-400 font-black uppercase mb-2">3. Hosting & Datenübertragung</h3><p>Unsere Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite werden automatisch Server-Log-Dateien (IP-Adresse, Browser, Zeitstempel) erfasst, die für den sicheren Betrieb notwendig sind.</p></section>
              <section><h3 className="text-blue-400 font-black uppercase mb-2">4. Drittanbieter-Einbindungen</h3><p><strong>YouTube:</strong> Wir binden Videos über YouTube ein. Dabei werden Daten an Google-Server übertragen (auch in die USA), sobald der Stream geladen wird.</p><p><strong>Zahlungsdienste (PayPal & Stripe):</strong> Wenn du Support leistest, werden deine Zahlungsdaten direkt an PayPal oder Stripe übermittelt. Wir speichern keine Kreditkartendaten oder Passwörter auf unseren Servern.</p></section>
              <section><h3 className="text-blue-400 font-black uppercase mb-2">5. Deine Rechte</h3><p>Du hast jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten Daten sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Kontaktiere uns dazu bitte per E-Mail.</p></section>
            </div>
          </div>
        </div>
      )}

      {showImpressum && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center backdrop-blur-md bg-black/95 p-4 text-white">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-3xl p-10 relative text-white">
            <button onClick={() => setShowImpressum(false)} className="absolute top-6 right-8 text-white/40 text-2xl text-white">✕</button>
            <h2 className="text-2xl font-black uppercase mb-6 italic border-b border-white/5 pb-4 text-white text-left">Impressum</h2>
            <div className="space-y-4 text-sm font-mono text-left text-white">
              <div><p className="text-blue-400 text-[10px] font-black uppercase">Betreiber</p><p className="font-bold text-white">Marcel Lück</p><p className="text-white">Möckernstraße 80, 28201 Bremen</p></div>
              <div><p className="text-blue-400 text-[10px] font-black uppercase">Kontakt</p><p className="text-white">marcel.lueck@outlook.com</p></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 z-[150]">
        <button onClick={() => setShowChatInfo(true)} className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      </div>
    </main>
  );
}