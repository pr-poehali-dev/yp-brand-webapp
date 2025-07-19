import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface GiveawayBannerProps {
  giveaway?: {
    id: number;
    title: string;
    description: string;
    prize: string;
    endDate: string;
    isActive: boolean;
  };
}

const GiveawayBanner: React.FC<GiveawayBannerProps> = ({ giveaway }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    if (!giveaway?.endDate) return;

    const updateCountdown = () => {
      const end = new Date(giveaway.endDate).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${days}д ${hours}ч ${minutes}м`);
      } else {
        setTimeLeft('Завершен');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);

    return () => clearInterval(timer);
  }, [giveaway?.endDate]);

  const handleParticipate = () => {
    setIsParticipating(true);
    // Открываем Telegram-бот для участия
    window.open('https://t.me/ypbrand_bot?start=giveaway', '_blank');
  };

  if (!giveaway?.isActive) return null;

  return (
    <Card className="bg-gradient-to-r from-yp-orange/20 to-purple-500/20 border-yp-orange/30 mb-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-yp-orange/10 to-purple-500/10 animate-pulse"></div>
      <CardContent className="p-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yp-orange/30 rounded-full">
            <Icon name="Gift" size={24} className="text-yp-orange" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-yp-orange font-bold">{giveaway.title}</h3>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                🔥 LIVE
              </Badge>
            </div>
            
            <p className="text-yp-white text-sm mb-2">{giveaway.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-yp-gray mb-3">
              <div className="flex items-center gap-1">
                <Icon name="Trophy" size={12} className="text-yp-orange" />
                <span>Приз: {giveaway.prize}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} className="text-red-400" />
                <span>{timeLeft}</span>
              </div>
            </div>

            <Button
              onClick={handleParticipate}
              disabled={isParticipating}
              className={`${
                isParticipating 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-yp-orange hover:bg-yp-orange/90'
              } text-white text-sm px-4 py-2`}
            >
              {isParticipating ? (
                <>
                  <Icon name="Check" size={14} className="mr-1" />
                  Участвуете
                </>
              ) : (
                <>
                  <Icon name="Zap" size={14} className="mr-1" />
                  Участвовать
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GiveawayBanner;