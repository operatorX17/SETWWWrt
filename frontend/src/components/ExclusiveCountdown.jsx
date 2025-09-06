import React, { useState, useEffect } from 'react';
import { Clock, Zap, Star } from 'lucide-react';

const ExclusiveCountdown = ({ 
  endTime, 
  title = "PSPK EXCLUSIVE DROP", 
  subtitle = "Limited Time Only",
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(endTime).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-6 rounded-lg border-2 border-red-600">
        <div className="text-center">
          <Zap className="mx-auto mb-2 text-yellow-400" size={32} />
          <h3 className="text-xl font-black uppercase tracking-wider mb-2">
            DROP COMPLETED
          </h3>
          <p className="text-red-200">
            This exclusive drop has ended. Join waitlist for next drop!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[var(--color-red)] to-red-800 text-white p-6 rounded-lg border-2 border-[var(--color-gold)] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="text-[var(--color-gold)]" size={20} fill="currentColor" />
            <h3 className="text-lg font-black uppercase tracking-wider">
              {title}
            </h3>
            <Star className="text-[var(--color-gold)]" size={20} fill="currentColor" />
          </div>
          <p className="text-sm text-red-200 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Countdown Display */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.minutes },
            { label: 'SECS', value: timeLeft.seconds }
          ].map((unit, index) => (
            <div key={index} className="text-center">
              <div className="bg-black/30 rounded-lg p-3 border border-[var(--color-gold)]/50">
                <div className="text-2xl font-black text-[var(--color-gold)]">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs font-bold text-white/80 mt-1">
                  {unit.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-[var(--color-gold)] mb-2">
            <Clock size={16} />
            <span className="text-sm font-bold">
              PSPK FANS GET FIRST ACCESS
            </span>
          </div>
          <p className="text-xs text-red-200">
            Join the elite. Limited quantities. Never reprinted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveCountdown;