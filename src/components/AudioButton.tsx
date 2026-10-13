import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakFrench, stopSpeech } from '../utils/audio';

interface AudioButtonProps {
  text: string;
  speed?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'chip';
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  speed = 0.82,
  label,
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const started = speakFrench(text, {
      rate: speed,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });

    if (!started) {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }[size];

  const variantClasses = {
    primary: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm',
    secondary: 'bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-900 border border-amber-300',
    ghost: 'hover:bg-amber-100 text-amber-800',
    chip: 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 shadow-xs',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Écouter : ${text}`}
      title={`Écouter la prononciation de « ${text} »`}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all cursor-pointer select-none ${sizeClasses} ${variantClasses} ${
        isPlaying ? 'ring-2 ring-amber-400 animate-pulse' : ''
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-red-500 animate-bounce" />
          {label && <span className="font-semibold">{label}</span>}
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-amber-600 transition-transform group-hover:scale-110" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
