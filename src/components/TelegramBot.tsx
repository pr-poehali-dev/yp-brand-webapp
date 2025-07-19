import React, { useState, useEffect } from 'react';
import BotStatus from './telegram/BotStatus';
import BotMessages from './telegram/BotMessages';
import { BotAPI } from './telegram/BotAPI';
import { BotHandlers } from './telegram/BotHandlers';

interface TelegramBotProps {
  botToken: string;
  onUpdate?: (data: any) => void;
}

const TelegramBot: React.FC<TelegramBotProps> = ({ botToken, onUpdate }) => {
  const [botStatus, setBotStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [botInfo, setBotInfo] = useState<any>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [botAPI, setBotAPI] = useState<BotAPI | null>(null);
  const [botHandlers, setBotHandlers] = useState<BotHandlers | null>(null);

  useEffect(() => {
    initBot();
  }, [botToken]);

  const initBot = async () => {
    try {
      setBotStatus('connecting');
      
      const api = new BotAPI(botToken);
      setBotAPI(api);

      const data = await api.getBotInfo();
      
      if (data.ok) {
        setBotInfo(data.result);
        setBotStatus('connected');
        
        await api.setupBotCommands();
        
        const handlers = new BotHandlers(api, handleBotUpdate);
        setBotHandlers(handlers);
        
        await startPolling(api, handlers);
      } else {
        setBotStatus('error');
        console.error('Ошибка подключения к боту:', data);
      }
    } catch (error) {
      setBotStatus('error');
      console.error('Ошибка инициализации бота:', error);
    }
  };

  const handleBotUpdate = (update: any) => {
    setRecentMessages(prev => [update, ...prev.slice(0, 9)]);
    onUpdate?.(update);
  };

  const startPolling = async (api: BotAPI, handlers: BotHandlers) => {
    let offset = 0;
    
    const poll = async () => {
      try {
        const data = await api.getUpdates(offset);
        
        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            await handlers.handleUpdate(update);
            offset = update.update_id + 1;
          }
        }
        
        setTimeout(poll, 1000);
      } catch (error) {
        console.error('Ошибка поллинга:', error);
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const handleQuickAction = async (action: string) => {
    if (!botAPI) return;
    
    setIsProcessing(true);
    try {
      console.log(`Выполняю действие: ${action}`);
      
      switch (action) {
        case 'broadcast':
          break;
        case 'analytics':
          break;
        default:
          console.log('Неизвестное действие:', action);
      }
    } catch (error) {
      console.error('Ошибка выполнения действия:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <BotStatus
        botStatus={botStatus}
        botInfo={botInfo}
        botToken={botToken}
        isProcessing={isProcessing}
        onQuickAction={handleQuickAction}
      />
      
      <BotMessages recentMessages={recentMessages} />
    </div>
  );
};

export default TelegramBot;