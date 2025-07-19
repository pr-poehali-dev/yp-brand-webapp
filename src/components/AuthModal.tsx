import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ a: 0, b: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Генерация безопасного пароля
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  // Генерация капчи
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
    setCaptchaInput('');
  };

  useEffect(() => {
    if (isOpen) {
      generatePassword();
      generateCaptcha();
    }
  }, [isOpen, mode]);

  const handleAuth = async () => {
    setIsLoading(true);
    
    // Проверка капчи
    if (parseInt(captchaInput) !== captchaQuestion.answer) {
      alert('Неверное решение капчи!');
      generateCaptcha();
      setIsLoading(false);
      return;
    }

    // Проверка заполнения полей
    if (!email && !telegramUsername) {
      alert('Заполните Email или Telegram username!');
      setIsLoading(false);
      return;
    }

    // Симуляция авторизации
    setTimeout(() => {
      const user = {
        id: Date.now(),
        email: email || null,
        telegram: telegramUsername || null,
        password: generatedPassword,
        isAdmin: email === 'admin@ypbrand.com', // Админ-доступ
        ypCoins: mode === 'register' ? 100 : Math.floor(Math.random() * 2000)
      };
      
      onAuth(user);
      onClose();
      setIsLoading(false);
    }, 1500);
  };

  const handleTelegramLogin = () => {
    // Симуляция Telegram WebApp авторизации
    const telegramUser = {
      id: Date.now(),
      telegram: '@telegram_user',
      firstName: 'Telegram',
      lastName: 'User',
      ypCoins: 247,
      isAdmin: false
    };
    onAuth(telegramUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yp-black border-yp-gray/30 text-yp-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-yp-orange text-center text-xl">
            {mode === 'login' ? 'Вход в YP BRAND' : 'Регистрация'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Telegram WebApp Login */}
          <Button
            onClick={handleTelegramLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Icon name="MessageCircle" size={16} className="mr-2" />
            Войти через Telegram
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-yp-gray/30"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-yp-black px-2 text-yp-gray">или</span>
            </div>
          </div>

          {/* Email/Telegram Form */}
          <div className="space-y-3">
            <div>
              <Label className="text-yp-white">Email (опционально)</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
              />
            </div>

            <div>
              <Label className="text-yp-white">Telegram username (опционально)</Label>
              <Input
                placeholder="@username"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="bg-yp-gray/20 border-yp-gray/30 text-yp-white"
              />
            </div>

            {mode === 'register' && (
              <Card className="bg-yp-orange/10 border-yp-orange/30">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-yp-orange text-sm">Сгенерированный пароль:</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={generatePassword}
                      className="text-yp-orange p-1"
                    >
                      <Icon name="RefreshCw" size={14} />
                    </Button>
                  </div>
                  <div className="bg-yp-black/50 p-2 rounded font-mono text-sm text-yp-white break-all">
                    {generatedPassword}
                  </div>
                  <p className="text-xs text-yp-orange mt-1">
                    Сохраните этот пароль в безопасном месте!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Капча */}
            <div>
              <Label className="text-yp-white">Защита от ботов</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-yp-orange text-yp-orange">
                  {captchaQuestion.a} + {captchaQuestion.b} = ?
                </Badge>
                <Input
                  type="number"
                  placeholder="Ответ"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="bg-yp-gray/20 border-yp-gray/30 text-yp-white w-20"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateCaptcha}
                  className="text-yp-gray p-1"
                >
                  <Icon name="RefreshCw" size={14} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="flex-1 border-yp-gray/30 text-yp-white hover:bg-yp-white/10"
            >
              {mode === 'login' ? 'Регистрация' : 'Вход'}
            </Button>
            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="flex-1 bg-yp-orange hover:bg-yp-orange/90 text-white"
            >
              {isLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                mode === 'login' ? 'Войти' : 'Создать'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;