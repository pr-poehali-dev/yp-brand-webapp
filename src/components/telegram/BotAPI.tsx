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

export class BotAPI {
  private botToken: string;
  private apiBase: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.apiBase = `https://api.telegram.org/bot${botToken}`;
  }

  async getBotInfo() {
    try {
      const response = await fetch(`${this.apiBase}/getMe`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка получения информации о боте:', error);
      throw error;
    }
  }

  async setupBotCommands() {
    const commands = [
      { command: 'start', description: '🚀 Запустить магазин' },
      { command: 'catalog', description: '📦 Каталог товаров' },
      { command: 'admin', description: '⚙️ Админ-панель' },
      { command: 'orders', description: '🛒 Мои заказы' },
      { command: 'support', description: '💬 Поддержка' }
    ];

    try {
      await fetch(`${this.apiBase}/setMyCommands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      });
    } catch (error) {
      console.error('Ошибка установки команд:', error);
      throw error;
    }
  }

  async getUpdates(offset: number = 0) {
    try {
      const response = await fetch(`${this.apiBase}/getUpdates?offset=${offset}&timeout=30`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка поллинга:', error);
      throw error;
    }
  }

  async sendMessage(message: BotMessage) {
    try {
      const response = await fetch(`${this.apiBase}/sendMessage`, {
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
      throw error;
    }
  }

  async answerCallbackQuery(callbackQueryId: string, text: string = 'Обрабатываем...') {
    try {
      await fetch(`${this.apiBase}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: text,
          show_alert: false
        })
      });
    } catch (error) {
      console.error('Ошибка ответа на callback query:', error);
      throw error;
    }
  }

  // Готовые сообщения
  createWelcomeMessage(chatId: number, userName: string): BotMessage {
    return {
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
  }

  createAdminMessage(chatId: number): BotMessage {
    return {
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
  }

  createCatalogMessage(chatId: number): BotMessage {
    return {
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
  }

  createOrdersMessage(chatId: number): BotMessage {
    return {
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
  }

  createSupportMessage(chatId: number): BotMessage {
    return {
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
  }

  createUnknownCommandMessage(chatId: number): BotMessage {
    return {
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
  }

  createCartAddedMessage(chatId: number): BotMessage {
    return {
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
    };
  }

  createWebAppMessage(chatId: number, type: 'admin' | 'store'): BotMessage {
    const isAdmin = type === 'admin';
    return {
      chat_id: chatId,
      text: isAdmin ? 'Открываю админ-панель...' : 'Открываю магазин...',
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: isAdmin ? '⚙️ Админ-панель' : '🛍 Магазин', 
              web_app: { url: isAdmin ? `${window.location.origin}?admin=true` : window.location.origin } 
            }
          ]
        ]
      }
    };
  }
}

export type { BotMessage };