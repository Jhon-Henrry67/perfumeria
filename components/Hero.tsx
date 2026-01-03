
import React from 'react';

interface HeroProps {
  onExplore: () => void;
  onIAOpen: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onIAOpen }) => {
  return (
    <div 
      className="relative w-full h-[360px] md:h-[420px] bg-cover bg-center flex items-center justify-center overflow-hidden" 
      style={{
        backgroundImage: 'linear-gradient(rgba(20, 14, 29, 0.7) 0%, rgba(20, 14, 29, 0.95) 100%), url("https://images.unsplash.com/photo-1605141040854-47c7df9f20e9?auto=format&fit=crop&q=80&w=1600")'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/30 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative text-center px-4 max-w-4xl z-10 animate-fade-in-up">
        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
          La Esencia de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Elegancia</span>
        </h1>
        <p className="text-text-secondary text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Fragancias curadas de las casas de perfumes más prestigiosas del mundo. 
          Encuentra la nota única que resuene con tus deseos más profundos.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={onExplore}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            Explorar Colección
          </button>
          <button 
            onClick={onIAOpen}
            className="border border-primary bg-primary/10 hover:bg-primary/20 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(127,19,236,0.3)]"
          >
            IA de asistencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
