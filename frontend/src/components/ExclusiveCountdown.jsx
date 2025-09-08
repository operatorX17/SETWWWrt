import React, { useState, useEffect } from 'react';
import { Clock, Zap, Star, Users, TrendingUp, AlertTriangle, Crown } from 'lucide-react';

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
  const [activeViewers, setActiveViewers] = useState(1247);
  const [stockLeft, setStockLeft] = useState(23);
  const [recentPurchases, setRecentPurchases] = useState([
    { name: 'Rajesh K.', location: 'Hyderabad', time: '2 min ago' },
    { name: 'Priya M.', location: 'Vijayawada', time: '5 min ago' },
    { name: 'Arjun S.', location: 'Guntur', time: '8 min ago' }
  ]);
  const [currentPurchase, setCurrentPurchase] = useState(0);

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

    // Stable viewer count based on time
    const stableViewers = 85 + (new Date().getMinutes() % 20);
    setActiveViewers(stableViewers);

    // Rotate recent purchases at stable intervals
    const purchaseInterval = setInterval(() => {
      setCurrentPurchase(prev => (prev + 1) % recentPurchases.length);
    }, 6000);

    // Set stable stock count
    const stableStock = 12 + (new Date().getHours() % 8);
    setStockLeft(stableStock);

    return () => {
      clearInterval(timer);
      clearInterval(purchaseInterval);
    };
  }, [endTime, onComplete, recentPurchases.length]);

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
      
      {/* Live Activity Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <Users size={12} />
            <span className="font-bold">{activeViewers.toLocaleString()} watching</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <AlertTriangle size={12} />
            <span className="font-bold">Only {stockLeft} left</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[var(--color-gold)]">
          <TrendingUp size={12} />
          <span className="font-bold">High Demand</span>
        </div>
      </div>
      
      <div className="relative z-10 mt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="text-[var(--color-gold)]" size={20} fill="currentColor" />
            <h3 className="text-lg font-black uppercase tracking-wider">
              {title}
            </h3>
            <Crown className="text-[var(--color-gold)]" size={20} fill="currentColor" />
          </div>
          <p className="text-sm text-red-200 font-medium">
            {subtitle} • Never Restocked
          </p>
        </div>

        {/* Recent Purchase Alert */}
        <div className="bg-black/30 border border-[var(--color-gold)]/30 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-[var(--color-gold)] rounded-full animate-pulse"></div>
            <span className="text-[var(--color-gold)] font-bold">
              {recentPurchases[currentPurchase].name} from {recentPurchases[currentPurchase].location}
            </span>
            <span className="text-gray-300">just purchased • {recentPurchases[currentPurchase].time}</span>
          </div>
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

        {/* Urgency Alerts */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 text-center">
            <AlertTriangle className="mx-auto mb-1 text-yellow-400" size={16} />
            <div className="text-xs font-bold text-yellow-400">STOCK ALERT</div>
            <div className="text-sm font-black">{stockLeft} LEFT</div>
          </div>
          <div className="bg-orange-900/50 border border-orange-500/50 rounded-lg p-3 text-center">
            <TrendingUp className="mx-auto mb-1 text-orange-400" size={16} />
            <div className="text-xs font-bold text-orange-400">DEMAND</div>
            <div className="text-sm font-black">EXTREME</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-[var(--color-gold)]/20 border border-[var(--color-gold)] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-[var(--color-gold)] mb-2">
              <Crown size={16} />
              <span className="text-sm font-bold">
                PSPK ELITE ACCESS ONLY
              </span>
            </div>
            <p className="text-xs text-white font-medium">
              Join the elite. Limited quantities. Never reprinted. Once gone, gone forever.
            </p>
          </div>
          <div className="text-xs text-red-200 opacity-80">
            ⚡ Free shipping on all orders • 🔒 Secure checkout • 💎 Premium quality guaranteed
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveCountdown;