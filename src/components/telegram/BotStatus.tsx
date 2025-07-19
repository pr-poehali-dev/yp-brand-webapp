import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface BotStatusProps {
  botStatus: 'connecting' | 'connected' | 'error';
  botInfo: any;
  botToken: string;
  isProcessing: boolean;
  onQuickAction?: (action: string) => void;
}

const BotStatus: React.FC<BotStatusProps> = ({ 
  botStatus, 
  botInfo, 
  botToken, 
  isProcessing,
  onQuickAction 
}) => {
  return (
    <Card className="bg-yp-white/5 border-yp-gray/20">
      <CardHeader>
        <CardTitle className="text-yp-orange flex items-center gap-2">
          <Icon name="Bot" size={20} />
          Telegram Bot
          <Badge 
            className={
              botStatus === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              botStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }
          >
            {botStatus === 'connected' ? '🟢 Онлайн' :
             botStatus === 'connecting' ? '🟡 Подключение' : '🔴 Ошибка'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {botInfo && (
          <div className="bg-yp-gray/10 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yp-orange/20 rounded-full flex items-center justify-center">
                <Icon name="Bot" size={20} className="text-yp-orange" />
              </div>
              <div>
                <h3 className="font-medium text-yp-white">@{botInfo.username}</h3>
                <p className="text-sm text-yp-gray">{botInfo.first_name}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yp-gray">Быстрые действия:</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-yp-orange/30 text-yp-orange hover:bg-yp-orange/10"
              disabled={botStatus !== 'connected' || isProcessing}
              onClick={() => onQuickAction?.('broadcast')}
            >
              <Icon name="Send" size={14} className="mr-1" />
              Рассылка
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-yp-gray/30 text-yp-gray hover:bg-yp-gray/10"
              disabled={botStatus !== 'connected'}
              onClick={() => onQuickAction?.('analytics')}
            >
              <Icon name="BarChart3" size={14} className="mr-1" />
              Аналитика
            </Button>
          </div>
        </div>

        <div className="text-xs text-yp-gray">
          <p>Token: {botToken.slice(0, 20)}...</p>
          <p>API: api.telegram.org</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotStatus;