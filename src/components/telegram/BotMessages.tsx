import React from 'react';

interface BotMessagesProps {
  recentMessages: any[];
}

const BotMessages: React.FC<BotMessagesProps> = ({ recentMessages }) => {
  if (recentMessages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-yp-gray">Последние сообщения:</h4>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {recentMessages.slice(0, 3).map((msg, idx) => (
          <div key={idx} className="text-xs bg-yp-gray/5 p-2 rounded text-yp-gray">
            {msg.message?.from?.first_name || 'Пользователь'}: {msg.message?.text || 'Действие'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BotMessages;