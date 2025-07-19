import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Данные товаров
  const products = [
    {
      id: 1,
      name: 'USB-C кабель премиум',
      price: 1299,
      oldPrice: 1599,
      image: '/img/88968304-79d1-4a7a-8eac-2279b015a53e.jpg',
      rating: 4.8,
      colors: ['Чёрный', 'Белый']
    },
    {
      id: 2,
      name: 'Беспроводные наушники YP',
      price: 3999,
      oldPrice: 4999,
      image: '/img/3bfefc90-7c0b-40e7-ab5c-27122b1cf8d9.jpg',
      rating: 4.9,
      colors: ['Чёрный', 'Оранжевый']
    },
    {
      id: 3,
      name: 'Power Bank 10000mAh',
      price: 2499,
      image: '/img/c8a7b026-257a-464e-93b8-48a94ba972a7.jpg',
      rating: 4.7,
      colors: ['Чёрный']
    },
    {
      id: 4,
      name: 'Зарядка быстрая 65W',
      price: 1899,
      oldPrice: 2299,
      image: '/img/88968304-79d1-4a7a-8eac-2279b015a53e.jpg',
      rating: 4.6,
      colors: ['Чёрный', 'Белый']
    }
  ];

  const categories = [
    { icon: 'Zap', name: 'Популярное', items: 'USB, зарядки, наушники' },
    { icon: 'Headphones', name: 'Аудио и звук', items: 'Наушники, колонки, микрофоны' },
    { icon: 'Cable', name: 'Кабели', items: 'USB, AUX, HDMI' },
    { icon: 'Car', name: 'Для авто', items: 'Зарядки, держатели' },
    { icon: 'Smartphone', name: 'Гаджеты', items: 'Техника и аксессуары' }
  ];

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-yp-black text-yp-white pb-20">
      {/* Header с поиском */}
      <div className="sticky top-0 bg-yp-black border-b border-yp-gray/20 z-10">
        <div className="flex items-center gap-3 p-4">
          <Button size="sm" variant="ghost" className="p-2">
            <Icon name="Camera" size={20} className="text-yp-orange" />
          </Button>
          <div className="flex-1 relative">
            <Input 
              placeholder="Поиск товаров..."
              className="bg-yp-gray/20 border-none text-yp-white placeholder:text-yp-gray pr-10"
            />
            <Icon name="Search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-yp-gray" />
          </div>
        </div>
      </div>

      {/* Основной контент */}
      {activeTab === 'home' && (
        <div className="p-4">
          {/* Логотип YP BRAND */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-yp-orange">YP BRAND</h1>
            <p className="text-yp-gray text-sm">Премиальные аксессуары</p>
          </div>

          {/* Товары */}
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <Card key={product.id} className="bg-yp-white/5 border-yp-gray/20 hover:bg-yp-white/10 transition-all duration-200">
                <CardContent className="p-3">
                  <div className="relative mb-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg bg-yp-white"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 p-1 bg-yp-black/50 hover:bg-yp-black/70"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Icon 
                        name="Heart" 
                        size={16} 
                        className={favorites.includes(product.id) ? "text-yp-orange fill-yp-orange" : "text-yp-white"} 
                      />
                    </Button>
                  </div>
                  
                  <h3 className="text-sm font-medium mb-2 line-clamp-2 text-yp-white">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Icon name="Star" size={12} className="text-yp-orange fill-yp-orange" />
                    <span className="text-xs text-yp-gray">{product.rating}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-yp-orange">{product.price}₽</span>
                    {product.oldPrice && (
                      <span className="text-xs text-yp-gray line-through">{product.oldPrice}₽</span>
                    )}
                  </div>

                  <div className="flex gap-1 mb-3">
                    {product.colors.map((color, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-yp-gray/30 text-yp-gray">
                        {color}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full bg-yp-orange hover:bg-yp-orange/90 text-white"
                    onClick={addToCart}
                  >
                    В корзину
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Каталог */}
      {activeTab === 'catalog' && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-yp-orange">Каталог</h2>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <Card key={index} className="bg-yp-white/5 border-yp-gray/20 hover:bg-yp-white/10 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yp-orange/20 rounded-lg">
                      <Icon name={category.icon as any} size={20} className="text-yp-orange" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-yp-white">{category.name}</h3>
                      <p className="text-sm text-yp-gray">{category.items}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-yp-gray" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Избранное */}
      {activeTab === 'favorites' && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-yp-orange">Избранное</h2>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Heart" size={48} className="text-yp-gray mx-auto mb-3" />
              <p className="text-yp-gray">Пока нет избранных товаров</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.filter(p => favorites.includes(p.id)).map((product) => (
                <Card key={product.id} className="bg-yp-white/5 border-yp-gray/20">
                  <CardContent className="p-3">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg bg-yp-white mb-3" />
                    <h3 className="text-sm font-medium text-yp-white">{product.name}</h3>
                    <span className="text-lg font-bold text-yp-orange">{product.price}₽</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Корзина */}
      {activeTab === 'cart' && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-yp-orange">Корзина</h2>
          {cartCount === 0 ? (
            <div className="text-center py-8">
              <Icon name="ShoppingCart" size={48} className="text-yp-gray mx-auto mb-3" />
              <p className="text-yp-gray">Корзина пустая</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="bg-yp-white/5 border-yp-gray/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-yp-white">Товаров в корзине:</span>
                    <span className="text-yp-orange font-bold">{cartCount}</span>
                  </div>
                  <Button className="w-full bg-yp-orange hover:bg-yp-orange/90 text-white">
                    Оформить заказ
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Профиль */}
      {activeTab === 'profile' && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-yp-orange">Профиль</h2>
          <div className="space-y-3">
            <Card className="bg-yp-white/5 border-yp-gray/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yp-orange/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={24} className="text-yp-orange" />
                  </div>
                  <div>
                    <h3 className="font-medium text-yp-white">Пользователь</h3>
                    <p className="text-sm text-yp-gray">Telegram User</p>
                  </div>
                </div>
                
                <div className="bg-yp-orange/10 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Coins" size={16} className="text-yp-orange" />
                    <span className="text-sm font-medium text-yp-orange">YP-монеты</span>
                  </div>
                  <span className="text-lg font-bold text-yp-orange">1,247</span>
                  <p className="text-xs text-yp-gray mt-1">1.2% кэшбэк с покупок</p>
                </div>

                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-yp-white hover:bg-yp-white/10">
                    <Icon name="Package" size={16} className="mr-3" />
                    Мои заказы
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-yp-white hover:bg-yp-white/10">
                    <Icon name="MapPin" size={16} className="mr-3" />
                    Адреса доставки
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-yp-white hover:bg-yp-white/10">
                    <Icon name="Settings" size={16} className="mr-3" />
                    Настройки
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Нижнее меню навигации */}
      <div className="fixed bottom-0 left-0 right-0 bg-yp-black border-t border-yp-gray/20">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'home', icon: 'Home', label: 'Главная' },
            { id: 'catalog', icon: 'Grid3X3', label: 'Каталог' },
            { id: 'favorites', icon: 'Heart', label: 'Избранное', badge: favorites.length },
            { id: 'cart', icon: 'ShoppingCart', label: 'Корзина', badge: cartCount },
            { id: 'profile', icon: 'User', label: 'Профиль' }
          ].map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 p-2 h-auto ${
                activeTab === item.id ? 'text-yp-orange' : 'text-yp-gray hover:text-yp-white'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="relative">
                <Icon name={item.icon as any} size={20} />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-yp-orange text-white border-0 p-0 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;