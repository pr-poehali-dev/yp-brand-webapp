import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import TelegramAdmin from './TelegramAdmin';
import TelegramBot from './TelegramBot';

interface AdminPanelProps {
  onClose: () => void;
  onUpdateStore: (updates: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onUpdateStore }) => {
  const [activeSection, setActiveSection] = useState('telegram');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: '',
    colors: '',
    image: ''
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'YP BRAND',
    logoText: 'YP BRAND',
    description: 'Премиальные аксессуары',
    telegramBot: '@ypbrand_bot',
    whatsappNumber: '+7 900 123-45-67'
  });

  const [giveaway, setGiveaway] = useState({
    title: '',
    description: '',
    prize: '',
    endDate: '',
    isActive: false
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Заполните название и цену товара!');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseInt(newProduct.oldPrice) : null,
      description: newProduct.description,
      category: newProduct.category,
      colors: newProduct.colors.split(',').map(c => c.trim()),
      image: newProduct.image || '/img/placeholder.svg',
      rating: 4.5 + Math.random() * 0.5
    };

    onUpdateStore({ type: 'ADD_PRODUCT', product });
    
    // Очистка формы
    setNewProduct({
      name: '', price: '', oldPrice: '', description: '', 
      category: '', colors: '', image: ''
    });

    alert('Товар добавлен! Уведомление отправлено в Telegram-бот.');
  };

  const handleUpdateStore = () => {
    onUpdateStore({ type: 'UPDATE_SETTINGS', settings: storeSettings });
    alert('Настройки магазина обновлены!');
  };

  const handleStartGiveaway = () => {
    if (!giveaway.title || !giveaway.prize) {
      alert('Заполните название и приз розыгрыша!');
      return;
    }

    onUpdateStore({ 
      type: 'START_GIVEAWAY', 
      giveaway: { ...giveaway, isActive: true, id: Date.now() }
    });
    
    alert('Розыгрыш запущен! Уведомления отправлены пользователям.');
  };

  const adminSections = [
    { id: 'telegram', icon: 'Bot', label: 'Telegram' },
    { id: 'products', icon: 'Package', label: 'Товары' },
    { id: 'store', icon: 'Store', label: 'Магазин' },
    { id: 'giveaways', icon: 'Gift', label: 'Розыгрыши' },
    { id: 'orders', icon: 'ShoppingCart', label: 'Заказы' },
    { id: 'analytics', icon: 'BarChart3', label: 'Аналитика' }
  ];

  return (
    <div className="fixed inset-0 bg-yp-black/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-yp-orange">Админ-панель</h1>
              <p className="text-yp-gray">Управление магазином YP BRAND</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-yp-gray hover:text-yp-white"
            >
              <Icon name="X" size={24} />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {adminSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeSection === section.id 
                    ? 'bg-yp-orange text-white' 
                    : 'text-yp-gray hover:text-yp-white'
                }`}
              >
                <Icon name={section.icon as any} size={16} />
                {section.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Управление товарами */}
            {activeSection === 'products' && (
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardHeader>
                  <CardTitle className="text-yp-orange flex items-center gap-2">
                    <Icon name="Package" size={20} />
                    Добавить товар
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-yp-white">Название товара</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="USB-C кабель премиум"
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                    <div>
                      <Label className="text-yp-white">Категория</Label>
                      <Input
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Кабели и подключения"
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                    <div>
                      <Label className="text-yp-white">Цена (₽)</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="1299"
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                    <div>
                      <Label className="text-yp-white">Старая цена (₽)</Label>
                      <Input
                        type="number"
                        value={newProduct.oldPrice}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, oldPrice: e.target.value }))}
                        placeholder="1599"
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-yp-white">Описание</Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Высококачественный USB-C кабель..."
                      className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                    />
                  </div>

                  <div>
                    <Label className="text-yp-white">Цвета (через запятую)</Label>
                    <Input
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, colors: e.target.value }))}
                      placeholder="Чёрный, Белый, Оранжевый"
                      className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                    />
                  </div>

                  <div>
                    <Label className="text-yp-white">URL изображения</Label>
                    <Input
                      value={newProduct.image}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="/img/product.jpg"
                      className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                    />
                  </div>

                  <Button 
                    onClick={handleAddProduct}
                    className="w-full bg-yp-orange hover:bg-yp-orange/90 text-white"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар через Telegram-бот
                  </Button>

                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      💡 Товары также можно добавлять через Telegram-бот: {storeSettings.telegramBot}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Настройки магазина */}
            {activeSection === 'store' && (
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardHeader>
                  <CardTitle className="text-yp-orange flex items-center gap-2">
                    <Icon name="Store" size={20} />
                    Настройки магазина
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-yp-white">Название магазина</Label>
                      <Input
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                    <div>
                      <Label className="text-yp-white">Текст логотипа</Label>
                      <Input
                        value={storeSettings.logoText}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, logoText: e.target.value }))}
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-yp-white">Описание</Label>
                    <Input
                      value={storeSettings.description}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                    />
                  </div>

                  <Separator className="bg-yp-gray/20" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-yp-white">Telegram-бот</Label>
                      <Input
                        value={storeSettings.telegramBot}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, telegramBot: e.target.value }))}
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                    <div>
                      <Label className="text-yp-white">WhatsApp номер</Label>
                      <Input
                        value={storeSettings.whatsappNumber}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleUpdateStore}
                    className="w-full bg-yp-orange hover:bg-yp-orange/90 text-white"
                  >
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить настройки
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Telegram управление */}
            {activeSection === 'telegram' && (
              <div className="space-y-4">
                <TelegramAdmin onClose={() => setActiveSection('products')} />
                <TelegramBot 
                  botToken="7846630115:AAH2uGX6Hdv-ImcEMiM6UvdxRWynHCcQnjA"
                  onUpdate={(data) => console.log('Bot update:', data)}
                />
              </div>
            )}

            {/* Розыгрыши */}
            {activeSection === 'giveaways' && (
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardHeader>
                  <CardTitle className="text-yp-orange flex items-center gap-2">
                    <Icon name="Gift" size={20} />
                    Создать розыгрыш
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-yp-white">Название розыгрыша</Label>
                    <Input
                      value={giveaway.title}
                      onChange={(e) => setGiveaway(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Розыгрыш iPhone 15 Pro"
                      className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                    />
                  </div>

                  <div>
                    <Label className="text-yp-white">Описание</Label>
                    <Textarea
                      value={giveaway.description}
                      onChange={(e) => setGiveaway(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Участвуйте в розыгрыше и выигрывайте призы..."
                      className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-yp-white">Приз</Label>
                      <Input
                        value={giveaway.prize}
                        onChange={(e) => setGiveaway(prev => ({ ...prev, prize: e.target.value }))}
                        placeholder="iPhone 15 Pro 256GB"
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                    <div>
                      <Label className="text-yp-white">Дата окончания</Label>
                      <Input
                        type="date"
                        value={giveaway.endDate}
                        onChange={(e) => setGiveaway(prev => ({ ...prev, endDate: e.target.value }))}
                        className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleStartGiveaway}
                    className="w-full bg-yp-orange hover:bg-yp-orange/90 text-white"
                  >
                    <Icon name="Zap" size={16} className="mr-2" />
                    Запустить розыгрыш
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Заказы */}
            {activeSection === 'orders' && (
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardHeader>
                  <CardTitle className="text-yp-orange flex items-center gap-2">
                    <Icon name="ShoppingCart" size={20} />
                    Управление заказами
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Icon name="MessageSquare" size={48} className="text-yp-gray mx-auto mb-3" />
                    <h3 className="text-yp-white font-medium mb-2">Заказы через мессенджеры</h3>
                    <p className="text-yp-gray text-sm mb-4">
                      Все заказы поступают в Telegram-бот и WhatsApp
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Telegram: {storeSettings.telegramBot}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        WhatsApp: {storeSettings.whatsappNumber}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Аналитика */}
            {activeSection === 'analytics' && (
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardHeader>
                  <CardTitle className="text-yp-orange flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Аналитика магазина
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yp-orange/10 p-4 rounded-lg text-center">
                      <Icon name="Users" size={24} className="text-yp-orange mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yp-orange">1,247</div>
                      <div className="text-yp-gray text-sm">Пользователей</div>
                    </div>
                    <div className="bg-blue-500/10 p-4 rounded-lg text-center">
                      <Icon name="ShoppingBag" size={24} className="text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400">89</div>
                      <div className="text-yp-gray text-sm">Заказов</div>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg text-center">
                      <Icon name="TrendingUp" size={24} className="text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">₽127,890</div>
                      <div className="text-yp-gray text-sm">Выручка</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;