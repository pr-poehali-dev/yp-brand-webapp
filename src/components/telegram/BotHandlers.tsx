import { BotAPI } from './BotAPI';

export class BotHandlers {
  private botAPI: BotAPI;
  private onUpdate?: (data: any) => void;

  constructor(botAPI: BotAPI, onUpdate?: (data: any) => void) {
    this.botAPI = botAPI;
    this.onUpdate = onUpdate;
  }

  async handleUpdate(update: any) {
    this.onUpdate?.(update);
    
    if (update.message) {
      await this.handleMessage(update.message);
    } else if (update.callback_query) {
      await this.handleCallbackQuery(update.callback_query);
    }
  }

  async handleMessage(message: any) {
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    const userName = message.from.first_name || message.from.username || 'Пользователь';

    if (text?.startsWith('/start')) {
      await this.handleStartCommand(chatId, userName);
    } else if (text?.startsWith('/admin')) {
      await this.handleAdminCommand(chatId, userId);
    } else if (text?.startsWith('/catalog')) {
      await this.handleCatalogCommand(chatId);
    } else if (text?.startsWith('/orders')) {
      await this.handleOrdersCommand(chatId, userId);
    } else if (text?.startsWith('/support')) {
      await this.handleSupportCommand(chatId);
    } else {
      await this.handleUnknownCommand(chatId);
    }
  }

  async handleCallbackQuery(callbackQuery: any) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;

    await this.botAPI.answerCallbackQuery(callbackQuery.id);

    if (data === 'open_admin') {
      await this.handleAdminWebApp(chatId);
    } else if (data === 'open_store') {
      await this.handleStoreWebApp(chatId);
    } else if (data.startsWith('add_to_cart_')) {
      const productId = data.replace('add_to_cart_', '');
      await this.handleAddToCart(chatId, userId, productId);
    }
  }

  private async handleStartCommand(chatId: number, userName: string) {
    const message = this.botAPI.createWelcomeMessage(chatId, userName);
    await this.botAPI.sendMessage(message);
  }

  private async handleAdminCommand(chatId: number, userId: number) {
    const adminIds = [123456789, 987654321];
    
    if (!adminIds.includes(userId)) {
      await this.botAPI.sendMessage({
        chat_id: chatId,
        text: '❌ У вас нет прав администратора.',
      });
      return;
    }

    const message = this.botAPI.createAdminMessage(chatId);
    await this.botAPI.sendMessage(message);
  }

  private async handleCatalogCommand(chatId: number) {
    const message = this.botAPI.createCatalogMessage(chatId);
    await this.botAPI.sendMessage(message);
  }

  private async handleOrdersCommand(chatId: number, userId: number) {
    const message = this.botAPI.createOrdersMessage(chatId);
    await this.botAPI.sendMessage(message);
  }

  private async handleSupportCommand(chatId: number) {
    const message = this.botAPI.createSupportMessage(chatId);
    await this.botAPI.sendMessage(message);
  }

  private async handleUnknownCommand(chatId: number) {
    const message = this.botAPI.createUnknownCommandMessage(chatId);
    await this.botAPI.sendMessage(message);
  }

  private async handleAddToCart(chatId: number, userId: number, productId: string) {
    const message = this.botAPI.createCartAddedMessage(chatId);
    await this.botAPI.sendMessage(message);
  }

  private async handleAdminWebApp(chatId: number) {
    const message = this.botAPI.createWebAppMessage(chatId, 'admin');
    await this.botAPI.sendMessage(message);
  }

  private async handleStoreWebApp(chatId: number) {
    const message = this.botAPI.createWebAppMessage(chatId, 'store');
    await this.botAPI.sendMessage(message);
  }
}