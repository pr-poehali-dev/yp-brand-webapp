import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
        sendData: (data: string) => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
      };
    };
  }
}

interface TelegramAdminProps {
  onClose: () => void;
}

const TelegramAdmin: React.FC<TelegramAdminProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'YP BRAND',
    description: 'Премиальные аксессуары',
    botToken: '7846630115:AAH2uGX6Hdv-ImcEMiM6UvdxRWynHCcQnjA',
    welcomeMessage: 'Добро пожаловать в YP BRAND! 🚀',
    deliveryInfo: 'Доставка по всей России',
    supportChat: '@ypbrand_support'
  });
  
  const [giveaway, setGiveaway] = useState({
    title: '🎁 Розыгрыш iPhone 15 Pro',
    description: 'Сделайте заказ от 5000₽ и участвуйте!',
    prize: 'iPhone 15 Pro 256GB',
    endDate: '2025-07-30',
    isActive: true,
    conditions: 'Минимальная сумма заказа 5000₽'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: '',
    image: '',
    colors: '',
    inStock: true
  });

  const [stats, setStats] = useState({
    totalOrders: 142,
    revenue: 256800,
    activeUsers: 89,
    conversionRate: 12.5
  });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Настройка кнопок
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        tg.HapticFeedback?.impactOccurred('light');
        onClose();
      });
    }
  }, [onClose]);

  const sendToTelegram = async (action: string, data: any) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback?.notificationOccurred('success');
      
      // Здесь будет отправка данных в бот
      const payload = {
        action,
        data,
        timestamp: Date.now(),
        adminId: window.Telegram.WebApp.initDataUnsafe?.user?.id
      };
      
      console.log('Отправка в Telegram бот:', payload);
      
      // Симуляция отправки (в реальности здесь будет API вызов к боту)
      return new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Заполните обязательные поля');
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseInt(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseInt(newProduct.oldPrice) : null,
      colors: newProduct.colors.split(',').map(c => c.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };

    await sendToTelegram('ADD_PRODUCT', product);
    setProducts(prev => [...prev, product]);
    
    setNewProduct({
      name: '',
      price: '',
      oldPrice: '',
      description: '',
      category: '',
      image: '',
      colors: '',
      inStock: true
    });

    alert('Товар добавлен!');
  };

  const handleUpdateSettings = async () => {
    await sendToTelegram('UPDATE_SETTINGS', storeSettings);
    alert('Настройки обновлены!');
  };

  const handleUpdateGiveaway = async () => {
    await sendToTelegram('UPDATE_GIVEAWAY', giveaway);
    alert('Розыгрыш обновлен!');
  };

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Удалить товар?')) {
      await sendToTelegram('DELETE_PRODUCT', { productId });
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const sections = [
    { id: 'dashboard', icon: 'BarChart3', label: 'Статистика' },
    { id: 'products', icon: 'Package', label: 'Товары' },
    { id: 'orders', icon: 'ShoppingCart', label: 'Заказы' },
    { id: 'giveaway', icon: 'Gift', label: 'Розыгрыши' },
    { id: 'settings', icon: 'Settings', label: 'Настройки' }
  ];

  return (
    <div className="min-h-screen bg-yp-black text-yp-white">
      {/* Заголовок */}
      <div className="sticky top-0 bg-yp-black border-b border-yp-gray/20 z-10">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-yp-orange/20 rounded-full flex items-center justify-center">
            <Icon name="Crown" size={20} className="text-yp-orange" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-yp-orange">Админ-панель</h1>
            <p className="text-xs text-yp-gray">Управление через Telegram</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            🟢 LIVE
          </Badge>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex overflow-x-auto border-b border-yp-gray/20 bg-yp-black/80 backdrop-blur">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            size="sm"
            className={`flex-shrink-0 px-4 py-3 ${
              activeSection === section.id
                ? 'text-yp-orange border-b-2 border-yp-orange'
                : 'text-yp-gray hover:text-yp-white'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <Icon name={section.icon as any} size={16} className="mr-2" />
            {section.label}
          </Button>
        ))}
      </div>

      <div className="p-4 pb-20">
        {/* Статистика */}
        {activeSection === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yp-orange/20 rounded-lg">
                      <Icon name="ShoppingCart" size={20} className="text-yp-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-yp-gray">Заказы</p>
                      <p className="text-xl font-bold text-yp-orange">{stats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Icon name="TrendingUp" size={20} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-yp-gray">Выручка</p>
                      <p className="text-xl font-bold text-green-400">{stats.revenue.toLocaleString()}₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Icon name="Users" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-yp-gray">Пользователи</p>
                      <p className="text-xl font-bold text-blue-400">{stats.activeUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Icon name="Target" size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-yp-gray">Конверсия</p>
                      <p className="text-xl font-bold text-purple-400">{stats.conversionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-yp-orange/20 to-purple-500/20 border-yp-orange/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon name="Zap" size={24} className="text-yp-orange" />
                  <div>
                    <h3 className="font-bold text-yp-orange">Быстрые действия</h3>
                    <p className="text-sm text-yp-gray">Управляйте магазином одним касанием</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button size="sm" className="bg-yp-orange hover:bg-yp-orange/90">
                    <Icon name="Plus" size={16} className="mr-1" />
                    Товар
                  </Button>
                  <Button size="sm" variant="outline" className="border-yp-orange/30">
                    <Icon name="Gift" size={16} className="mr-1" />
                    Розыгрыш
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Товары */}
        {activeSection === 'products' && (
          <div className="space-y-4">
            <Card className="bg-yp-white/5 border-yp-gray/20">
              <CardHeader>
                <CardTitle className="text-yp-orange flex items-center gap-2">
                  <Icon name="Plus" size={20} />
                  Добавить товар
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-yp-gray">Название*</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Название товара"
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-yp-gray">Цена*</Label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="1999"
                      className="bg-yp-gray/20 border-none text-yp-white"
                    />
                  </div>
                  <div>
                    <Label className="text-yp-gray">Старая цена</Label>
                    <Input
                      type="number"
                      value={newProduct.oldPrice}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, oldPrice: e.target.value }))}
                      placeholder="2499"
                      className="bg-yp-gray/20 border-none text-yp-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-yp-gray">Описание</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Описание товара..."
                    className="bg-yp-gray/20 border-none text-yp-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Цвета (через запятую)</Label>
                  <Input
                    value={newProduct.colors}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, colors: e.target.value }))}
                    placeholder="Чёрный, Белый, Оранжевый"
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <Button onClick={handleAddProduct} className="w-full bg-yp-orange hover:bg-yp-orange/90">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить товар
                </Button>
              </CardContent>
            </Card>

            {/* Список товаров */}
            <div className="space-y-3">
              {products.map((product) => (
                <Card key={product.id} className="bg-yp-white/5 border-yp-gray/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-yp-white">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yp-orange font-bold">{product.price}₽</span>
                          {product.oldPrice && (
                            <span className="text-yp-gray line-through text-sm">{product.oldPrice}₽</span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {product.colors?.map((color: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs border-yp-gray/30 text-yp-gray">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Заказы */}
        {activeSection === 'orders' && (
          <div className="space-y-4">
            <Card className="bg-yp-white/5 border-yp-gray/20">
              <CardHeader>
                <CardTitle className="text-yp-orange flex items-center gap-2">
                  <Icon name="ShoppingCart" size={20} />
                  Последние заказы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 1, user: 'Алексей М.', amount: 3299, status: 'new', items: 2 },
                    { id: 2, user: 'Мария К.', amount: 1899, status: 'processing', items: 1 },
                    { id: 3, user: 'Дмитрий Р.', amount: 5999, status: 'completed', items: 3 }
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-yp-gray/10 rounded-lg">
                      <div>
                        <p className="text-yp-white font-medium">#{order.id} - {order.user}</p>
                        <p className="text-sm text-yp-gray">{order.items} товар(а) • {order.amount}₽</p>
                      </div>
                      <Badge 
                        className={
                          order.status === 'new' ? 'bg-yp-orange/20 text-yp-orange' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }
                      >
                        {order.status === 'new' ? 'Новый' :
                         order.status === 'processing' ? 'В работе' : 'Выполнен'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Розыгрыши */}
        {activeSection === 'giveaway' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-yp-orange/20 to-purple-500/20 border-yp-orange/30">
              <CardHeader>
                <CardTitle className="text-yp-orange flex items-center gap-2">
                  <Icon name="Gift" size={20} />
                  Управление розыгрышами
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-yp-gray">Заголовок</Label>
                  <Input
                    value={giveaway.title}
                    onChange={(e) => setGiveaway(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Описание</Label>
                  <Input
                    value={giveaway.description}
                    onChange={(e) => setGiveaway(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Приз</Label>
                  <Input
                    value={giveaway.prize}
                    onChange={(e) => setGiveaway(prev => ({ ...prev, prize: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Дата окончания</Label>
                  <Input
                    type="date"
                    value={giveaway.endDate}
                    onChange={(e) => setGiveaway(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Условия участия</Label>
                  <Textarea
                    value={giveaway.conditions}
                    onChange={(e) => setGiveaway(prev => ({ ...prev, conditions: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-yp-gray cursor-pointer">
                    <input
                      type="checkbox"
                      checked={giveaway.isActive}
                      onChange={(e) => setGiveaway(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-yp-orange bg-yp-gray/20 border-yp-gray/30 rounded focus:ring-yp-orange"
                    />
                    Активный розыгрыш
                  </label>
                </div>

                <Button onClick={handleUpdateGiveaway} className="w-full bg-yp-orange hover:bg-yp-orange/90">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить розыгрыш
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Настройки */}
        {activeSection === 'settings' && (
          <div className="space-y-4">
            <Card className="bg-yp-white/5 border-yp-gray/20">
              <CardHeader>
                <CardTitle className="text-yp-orange flex items-center gap-2">
                  <Icon name="Settings" size={20} />
                  Настройки магазина
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-yp-gray">Название магазина</Label>
                  <Input
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Описание</Label>
                  <Input
                    value={storeSettings.description}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Токен бота</Label>
                  <Input
                    value={storeSettings.botToken}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, botToken: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white font-mono text-sm"
                    placeholder="123456789:ABC-DEF..."
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Приветственное сообщение</Label>
                  <Textarea
                    value={storeSettings.welcomeMessage}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Информация о доставке</Label>
                  <Input
                    value={storeSettings.deliveryInfo}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, deliveryInfo: e.target.value }))}
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <div>
                  <Label className="text-yp-gray">Поддержка (чат)</Label>
                  <Input
                    value={storeSettings.supportChat}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, supportChat: e.target.value }))}
                    placeholder="@ypbrand_support"
                    className="bg-yp-gray/20 border-none text-yp-white"
                  />
                </div>

                <Button onClick={handleUpdateSettings} className="w-full bg-yp-orange hover:bg-yp-orange/90">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="AlertTriangle" size={20} className="text-red-400" />
                  <h3 className="font-medium text-red-400">Опасная зона</h3>
                </div>
                <p className="text-sm text-yp-gray mb-3">
                  Действия в этой секции необратимы. Будьте осторожны.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20">
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт данных
                  </Button>
                  <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20">
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Сброс статистики
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramAdmin;