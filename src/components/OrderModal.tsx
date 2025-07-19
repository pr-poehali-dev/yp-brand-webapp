import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  cartTotal: number;
  user: any;
}

const OrderModal: React.FC<OrderModalProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  cartTotal,
  user 
}) => {
  const [orderForm, setOrderForm] = useState({
    name: user?.firstName || '',
    phone: '',
    email: user?.email || '',
    address: '',
    deliveryMethod: 'courier', // courier, pickup
    paymentMethod: 'card', // card, cash, ypcoins
    comment: ''
  });
  
  const [selectedMessenger, setSelectedMessenger] = useState<'telegram' | 'whatsapp' | null>(null);

  const handleFormChange = (field: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const generateOrderMessage = () => {
    const orderText = `
🛍 НОВЫЙ ЗАКАЗ YP BRAND

👤 Клиент: ${orderForm.name}
📞 Телефон: ${orderForm.phone}
📧 Email: ${orderForm.email}

📦 Товары:
${cartItems.map(item => `• ${item.name} - ${item.quantity}шт - ${item.price * item.quantity}₽`).join('\n')}

💰 Итого: ${cartTotal}₽
${orderForm.paymentMethod === 'ypcoins' ? `💎 Оплата YP-монетами (${user?.ypCoins} доступно)` : ''}

🚛 Доставка: ${orderForm.deliveryMethod === 'courier' ? 'Курьером' : 'Самовывоз'}
📍 Адрес: ${orderForm.address}

💬 Комментарий: ${orderForm.comment}

⏰ Заказ от ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return encodeURIComponent(orderText);
  };

  const handleOrderSubmit = (messenger: 'telegram' | 'whatsapp') => {
    if (!orderForm.name || !orderForm.phone) {
      alert('Заполните имя и телефон!');
      return;
    }

    const message = generateOrderMessage();
    
    if (messenger === 'telegram') {
      // Открываем Telegram с готовым сообщением
      window.open(`https://t.me/ypbrand_bot?start=order&text=${message}`, '_blank');
    } else {
      // Открываем WhatsApp с готовым сообщением
      window.open(`https://wa.me/79001234567?text=${message}`, '_blank');
    }

    // Закрываем модалку и показываем успех
    onClose();
    alert('Заказ отправлен! Администратор свяжется с вами в ближайшее время.');
  };

  const canPayWithCoins = user?.ypCoins >= cartTotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yp-black border-yp-gray/30 text-yp-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-yp-orange text-center text-xl">
            Оформление заказа
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Товары в заказе */}
          <Card className="bg-yp-white/5 border-yp-gray/20">
            <CardContent className="p-4">
              <h3 className="text-yp-orange font-medium mb-3">Ваш заказ</h3>
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-yp-white text-sm">{item.name} × {item.quantity}</span>
                    <span className="text-yp-orange font-medium">{item.price * item.quantity}₽</span>
                  </div>
                ))}
              </div>
              <Separator className="bg-yp-gray/20 my-3" />
              <div className="flex justify-between items-center">
                <span className="text-yp-white font-medium">Итого:</span>
                <span className="text-yp-orange font-bold text-lg">{cartTotal}₽</span>
              </div>
            </CardContent>
          </Card>

          {/* Контактная информация */}
          <div className="space-y-3">
            <h3 className="text-yp-orange font-medium">Контактная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-yp-white">Имя *</Label>
                <Input
                  value={orderForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Ваше имя"
                  className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                />
              </div>
              <div>
                <Label className="text-yp-white">Телефон *</Label>
                <Input
                  value={orderForm.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="+7 900 123-45-67"
                  className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-yp-white">Email</Label>
              <Input
                value={orderForm.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="your@email.com"
                className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
              />
            </div>
          </div>

          {/* Доставка */}
          <div>
            <Label className="text-yp-white mb-2 block">Способ доставки</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderForm.deliveryMethod === 'courier' ? 'default' : 'outline'}
                onClick={() => handleFormChange('deliveryMethod', 'courier')}
                className={orderForm.deliveryMethod === 'courier' 
                  ? 'bg-yp-orange text-white' 
                  : 'border-yp-gray/30 text-yp-white hover:bg-yp-white/10'
                }
              >
                <Icon name="Truck" size={16} className="mr-2" />
                Курьером
              </Button>
              <Button
                variant={orderForm.deliveryMethod === 'pickup' ? 'default' : 'outline'}
                onClick={() => handleFormChange('deliveryMethod', 'pickup')}
                className={orderForm.deliveryMethod === 'pickup' 
                  ? 'bg-yp-orange text-white' 
                  : 'border-yp-gray/30 text-yp-white hover:bg-yp-white/10'
                }
              >
                <Icon name="Store" size={16} className="mr-2" />
                Самовывоз
              </Button>
            </div>
          </div>

          {/* Адрес */}
          <div>
            <Label className="text-yp-white">
              {orderForm.deliveryMethod === 'courier' ? 'Адрес доставки' : 'Адрес самовывоза'}
            </Label>
            <Input
              value={orderForm.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              placeholder={orderForm.deliveryMethod === 'courier' 
                ? 'ул. Пушкина, д. 10, кв. 15' 
                : 'Ближайший пункт выдачи'
              }
              className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
            />
          </div>

          {/* Способ оплаты */}
          <div>
            <Label className="text-yp-white mb-2 block">Способ оплаты</Label>
            <div className="space-y-2">
              <Button
                variant={orderForm.paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => handleFormChange('paymentMethod', 'card')}
                className={`w-full justify-start ${orderForm.paymentMethod === 'card' 
                  ? 'bg-yp-orange text-white' 
                  : 'border-yp-gray/30 text-yp-white hover:bg-yp-white/10'
                }`}
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Банковская карта
              </Button>
              <Button
                variant={orderForm.paymentMethod === 'cash' ? 'default' : 'outline'}
                onClick={() => handleFormChange('paymentMethod', 'cash')}
                className={`w-full justify-start ${orderForm.paymentMethod === 'cash' 
                  ? 'bg-yp-orange text-white' 
                  : 'border-yp-gray/30 text-yp-white hover:bg-yp-white/10'
                }`}
              >
                <Icon name="Banknote" size={16} className="mr-2" />
                Наличные при получении
              </Button>
              {user?.ypCoins > 0 && (
                <Button
                  variant={orderForm.paymentMethod === 'ypcoins' ? 'default' : 'outline'}
                  onClick={() => handleFormChange('paymentMethod', 'ypcoins')}
                  disabled={!canPayWithCoins}
                  className={`w-full justify-start ${orderForm.paymentMethod === 'ypcoins' 
                    ? 'bg-yp-orange text-white' 
                    : 'border-yp-gray/30 text-yp-white hover:bg-yp-white/10'
                  } ${!canPayWithCoins ? 'opacity-50' : ''}`}
                >
                  <Icon name="Coins" size={16} className="mr-2" />
                  YP-монеты ({user.ypCoins} доступно)
                  {!canPayWithCoins && (
                    <Badge className="ml-2 bg-red-500/20 text-red-400 text-xs">
                      Недостаточно
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Комментарий */}
          <div>
            <Label className="text-yp-white">Комментарий к заказу</Label>
            <Textarea
              value={orderForm.comment}
              onChange={(e) => handleFormChange('comment', e.target.value)}
              placeholder="Особые пожелания или инструкции..."
              className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
              rows={3}
            />
          </div>

          {/* Выбор мессенджера */}
          <div>
            <Label className="text-yp-white mb-3 block">Отправить заказ через:</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleOrderSubmit('telegram')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Telegram
              </Button>
              <Button
                onClick={() => handleOrderSubmit('whatsapp')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                WhatsApp
              </Button>
            </div>
            <p className="text-yp-gray text-xs mt-2 text-center">
              Администратор получит заказ и свяжется с вами для подтверждения
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;