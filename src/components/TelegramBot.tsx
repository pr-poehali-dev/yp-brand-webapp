import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TelegramBotProps {
  botToken: string;
  onUpdate?: (data: any) => void;
}

interface BotMessage {
  chat_id: number;
  text: string;
  reply_markup?: {
    inline_keyboard: Array<Array<{
      text: string;
      callback_data?: string;
      url?: string;
      web_app?: { url: string };
    }>>;
  };
  parse_mode?: 'HTML' | 'Markdown';
}

const TelegramBot: React.FC<TelegramBotProps> = ({ botToken, onUpdate }) => {
  const [botStatus, setBotStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [botInfo, setBotInfo] = useState<any>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE = `https://api.telegram.org/bot${botToken}`;

  useEffect(() => {
    initBot();
  }, [botToken]);

  const initBot = async () => {
    try {
      setBotStatus('connecting');
      
      // Получаем информацию о боте
      const response = await fetch(`${API_BASE}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setBotInfo(data.result);
        setBotStatus('connected');
        
        // Устанавливаем вебхук или команды
        await setupBotCommands();
        await startPolling();
      } else {
        setBotStatus('error');
        console.error('Ошибка подключения к боту:', data);
      }
    } catch (error) {
      setBotStatus('error');
      console.error('Ошибка инициализации бота:', error);
    }
  };

  const setupBotCommands = async () => {
    const commands = [
      { command: 'start', description: '🚀 Запустить магазин' },
      { command: 'catalog', description: '📦 Каталог товаров' },
      { command: 'admin', description: '⚙️ Админ-панель' },
      { command: 'orders', description: '🛒 Мои заказы' },
      { command: 'support', description: '💬 Поддержка' }
    ];

    try {
      await fetch(`${API_BASE}/setMyCommands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      });
    } catch (error) {
      console.error('Ошибка установки команд:', error);
    }
  };

  const startPolling = async () => {
    let offset = 0;
    
    const poll = async () => {
      try {
        const response = await fetch(`${API_BASE}/getUpdates?offset=${offset}&timeout=30`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            await handleUpdate(update);
            offset = update.update_id + 1;
          }
        }
        
        // Продолжаем поллинг
        setTimeout(poll, 1000);
      } catch (error) {
        console.error('Ошибка поллинга:', error);
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const handleUpdate = async (update: any) => {
    setRecentMessages(prev => [update, ...prev.slice(0, 9)]);
    
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
    
    onUpdate?.(update);
  };

  const handleMessage = async (message: any) => {
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    const userName = message.from.first_name || message.from.username || 'Пользователь';

    if (text?.startsWith('/start')) {
      await sendWelcomeMessage(chatId, userName);
    } else if (text?.startsWith('/admin')) {
      await sendAdminPanel(chatId, userId);
    } else if (text?.startsWith('/catalog')) {
      await sendCatalog(chatId);
    } else if (text?.startsWith('/orders')) {
      await sendUserOrders(chatId, userId);
    } else if (text?.startsWith('/support')) {
      await sendSupport(chatId);
    } else {
      await sendUnknownCommand(chatId);
    }
  };

  const handleCallbackQuery = async (callbackQuery: any) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;

    // Отвечаем на callback query
    await fetch(`${API_BASE}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
        text: 'Обрабатываем...',
        show_alert: false
      })
    });

    if (data === 'open_admin') {
      await sendAdminWebApp(chatId);
    } else if (data === 'open_store') {
      await sendStoreWebApp(chatId);
    } else if (data.startsWith('add_to_cart_')) {
      const productId = data.replace('add_to_cart_', '');
      await handleAddToCart(chatId, userId, productId);
    }
  };

  const sendMessage = async (message: BotMessage) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${API_BASE}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      
      const data = await response.json();
      if (!data.ok) {
        console.error('Ошибка отправки сообщения:', data);
      }
      return data;
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendWelcomeMessage = async (chatId: number, userName: string) => {
    const message: BotMessage = {
      chat_id: chatId,
      text: `🚀 Добро пожаловать в <b>YP BRAND</b>, ${userName}!

Премиальные аксессуары и техника по лучшим ценам.

🎁 <b>Актуальные предложения:</b>
• Розыгрыш iPhone 15 Pro до 30 июля
• Кэшбэк YP-монетами 1.2% с каждой покупки
• Бесплатная доставка от 3000₽

Выберите действие:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Открыть магазин', web_app: { url: window.location.origin } },
          ],
          [
            { text: '📦 Каталог', callback_data: 'open_store' },
            { text: '🎁 Розыгрыш', callback_data: 'giveaway_info' }
          ],
          [
            { text: '💬 Поддержка', url: 'https://t.me/ypbrand_support' }
          ]
        ]
      }
    };

    await sendMessage(message);
  };

  const sendAdminPanel = async (chatId: number, userId: number) => {
    // Проверяем права администратора (здесь простая проверка по ID)
    const adminIds = [123456789, 987654321]; // Замените на реальные ID админов
    
    if (!adminIds.includes(userId)) {
      await sendMessage({
        chat_id: chatId,
        text: '❌ У вас нет прав администратора.',
      });
      return;
    }

    const message: BotMessage = {
      chat_id: chatId,
      text: `👑 <b>Админ-панель YP BRAND</b>

Управляйте своим магазином прямо из Telegram!

📊 <b>Доступные функции:</b>
• Добавление и редактирование товаров
• Управление заказами и статистикой
• Настройка розыгрышей и акций
• Конфигурация магазина

Откройте веб-приложение для полного управления:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⚙️ Открыть админ-панель', web_app: { url: `${window.location.origin}?admin=true` } }
          ],
          [
            { text: '📊 Статистика', callback_data: 'admin_stats' },
            { text: '📦 Товары', callback_data: 'admin_products' }
          ],
          [
            { text: '🛒 Заказы', callback_data: 'admin_orders' },
            { text: '🎁 Розыгрыши', callback_data: 'admin_giveaways' }
          ]
        ]
      }
    };

    await sendMessage(message);
  };

  const sendCatalog = async (chatId: number) => {
    const message: BotMessage = {
      chat_id: chatId,
      text: `📦 <b>Каталог YP BRAND</b>

🔥 <b>Популярные категории:</b>

🎧 <b>Аудио и звук</b>
• Беспроводные наушники от 3999₽
• Портативные колонки от 2499₽

🔌 <b>Кабели и зарядки</b>
• USB-C кабели премиум от 1299₽
• Быстрые зарядки 65W от 1899₽

🔋 <b>Power Bank</b>
• 10000mAh от 2499₽
• Беспроводная зарядка от 3299₽

Откройте полный каталог в приложении:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Открыть каталог', web_app: { url: `${window.location.origin}?tab=catalog` } }
          ],
          [
            { text: '🎧 Аудио', callback_data: 'category_audio' },
            { text: '🔌 Кабели', callback_data: 'category_cables' }
          ],
          [
            { text: '🔋 Power Bank', callback_data: 'category_powerbank' },
            { text: '📱 Аксессуары', callback_data: 'category_accessories' }
          ]
        ]
      }
    };

    await sendMessage(message);
  };

  const sendUserOrders = async (chatId: number, userId: number) => {
    const message: BotMessage = {
      chat_id: chatId,
      text: `🛒 <b>Ваши заказы</b>

📋 <b>Последние заказы:</b>

• Заказ #1234 - 3299₽ (В доставке)
• Заказ #1223 - 1899₽ (Выполнен)

💰 <b>YP-монеты:</b> 156 ₽
🎯 <b>Кэшбэк:</b> 1.2% с каждой покупки

Откройте приложение для детального просмотра:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 Открыть заказы', web_app: { url: `${window.location.origin}?tab=profile` } }
          ],
          [
            { text: '🛒 В корзину', web_app: { url: `${window.location.origin}?tab=cart` } },
            { text: '❤️ Избранное', web_app: { url: `${window.location.origin}?tab=favorites` } }
          ]
        ]
      }
    };

    await sendMessage(message);
  };

  const sendSupport = async (chatId: number) => {
    const message: BotMessage = {
      chat_id: chatId,
      text: `💬 <b>Поддержка YP BRAND</b>

Мы всегда готовы помочь!

🕐 <b>Время работы:</b> 9:00 - 21:00 (МСК)
📞 <b>Ответ в течение:</b> 5-15 минут

❓ <b>Частые вопросы:</b>
• Доставка 1-3 дня по России
• Оплата картой, наличными, YP-монетами
• Возврат в течение 14 дней

Свяжитесь с нами:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💬 Написать в поддержку', url: 'https://t.me/ypbrand_support' }
          ],
          [
            { text: '📞 Заказать звонок', callback_data: 'request_call' },
            { text: '❓ FAQ', callback_data: 'show_faq' }
          ]
        ]
      }
    };

    await sendMessage(message);
  };

  const sendUnknownCommand = async (chatId: number) => {
    const message: BotMessage = {
      chat_id: chatId,
      text: `🤖 Не понимаю эту команду.

Используйте:
/start - Главное меню
/catalog - Каталог товаров  
/orders - Мои заказы
/support - Поддержка

Или просто откройте магазин:`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Открыть магазин', web_app: { url: window.location.origin } }
          ]
        ]
      }
    };

    await sendMessage(message);
  };

  const handleAddToCart = async (chatId: number, userId: number, productId: string) => {
    await sendMessage({
      chat_id: chatId,
      text: `✅ Товар добавлен в корзину!

Откройте приложение для оформления заказа:`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 Оформить заказ', web_app: { url: `${window.location.origin}?tab=cart` } }
          ]
        ]
      }
    });
  };

  const sendAdminWebApp = async (chatId: number) => {
    await sendMessage({
      chat_id: chatId,
      text: 'Открываю админ-панель...',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⚙️ Админ-панель', web_app: { url: `${window.location.origin}?admin=true` } }
          ]
        ]
      }
    });
  };

  const sendStoreWebApp = async (chatId: number) => {
    await sendMessage({
      chat_id: chatId,
      text: 'Открываю магазин...',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Магазин', web_app: { url: window.location.origin } }
          ]
        ]
      }
    });
  };

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
            >
              <Icon name="Send" size={14} className="mr-1" />
              Рассылка
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-yp-gray/30 text-yp-gray hover:bg-yp-gray/10"
              disabled={botStatus !== 'connected'}
            >
              <Icon name="BarChart3" size={14} className="mr-1" />
              Аналитика
            </Button>
          </div>
        </div>

        {recentMessages.length > 0 && (
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
        )}

        <div className="text-xs text-yp-gray">
          <p>Token: {botToken.slice(0, 20)}...</p>
          <p>API: api.telegram.org</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramBot;