import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';

const Countdown = ({ 
  endTime, 
  onExpire, 
  className = "",
  size = 'md',
  showLabels = true 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  
  const { isReducedMotion } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = new Date(endTime).getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        });
        
        if (onExpire) {
          onExpire();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <div className={`text-[var(--color-red)] font-bold ${className}`}>
        {t('common.expired', 'EXPIRED')}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const TimeUnit = ({ value, label, isLast = false }) => (
    <div className="flex flex-col items-center">
      <div 
        className={`
          font-bold tabular-nums bg-[var(--color-steel)] px-3 py-2 min-w-[3rem] text-center
          ${sizeClasses[size]}
          ${isReducedMotion ? '' : 'transition-all duration-300'}
        `}
        style={{
          transform: isReducedMotion ? 'none' : 'scale(1)',
          animation: isReducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      {showLabels && (
        <div className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">
          {label}
        </div>
      )}
      {!isLast && (
        <div className={`mx-2 font-bold ${sizeClasses[size]}`}>:</div>
      )}
    </div>
  );

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="Days" />
          <div className={`font-bold ${sizeClasses[size]}`}>:</div>
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className={`font-bold ${sizeClasses[size]}`}>:</div>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <div className={`font-bold ${sizeClasses[size]}`}>:</div>
      <TimeUnit value={timeLeft.seconds} label="Sec" isLast />
    </div>
  );
};

// CSS for pulse animation (add to global CSS)
const countdownCSS = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.getElementById('countdown-styles')) {
  const style = document.createElement('style');
  style.id = 'countdown-styles';
  style.textContent = countdownCSS;
  document.head.appendChild(style);
}

export default Countdown;