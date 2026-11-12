import React, { useState } from 'react';
import { X, Lock, User, KeyRound, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { crmService } from '../services/crmService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const CrmLoginModal: React.FC<Props> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('Rustam');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = crmService.login(username, password);
      setIsLoading(false);
      if (ok) {
        setPassword('');
        setError(null);
        onLoginSuccess();
      } else {
        setError('Неверный логин или пароль. Доступ разрешён только администратору.');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0b3d66] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#e6a417]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Вход в панель управления</h3>
              <p className="text-xs text-slate-300">Hubei Onearth CRM & Аналитика</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Логин пользователя
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Rustam"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0b3d66] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0b3d66] focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0b3d66] hover:bg-navy-dark text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isLoading ? (
                <span>Проверка доступа...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#e6a417]" />
                  <span>Войти в систему</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Конфиденциальный служебный раздел сайта · Hubei Onearth
          </div>
        </form>
      </div>
    </div>
  );
};
