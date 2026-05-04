'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';
import { animateLogin } from '@/lib/anime-utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    animateLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al iniciar sesion');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Error de conexion');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0B1120]">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#1e40af] opacity-30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#7c3aed] opacity-20 blur-[120px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full bg-[#0ea5e9] opacity-15 blur-[100px] animate-pulse [animation-delay:4s]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="login-logo flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-white/90 text-lg font-bold tracking-tight">IASSAT PayFlow</span>
          </div>

          {/* Hero text */}
          <div className="space-y-6 max-w-lg">
            <h1 className="login-hero-title text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Gestion de cobranzas
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                inteligente
              </span>
            </h1>
            <p className="login-hero-subtitle text-white/50 text-lg leading-relaxed">
              Controla hitos, automatiza recordatorios y concilia pagos en una sola plataforma.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="login-feature-pill flex items-center gap-3 text-white/60">
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">Maquina de estados con 12 etapas financieras</span>
              </div>
              <div className="login-feature-pill flex items-center gap-3 text-white/60">
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-violet-400" />
                </div>
                <span className="text-sm">Automatizacion de mensajes por WhatsApp y email</span>
              </div>
              <div className="login-feature-pill flex items-center gap-3 text-white/60">
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm">Conciliacion de pagos en tiempo real</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="login-footer text-white/20 text-xs">
            &copy; 2026 IASSAT. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-foreground text-lg font-bold tracking-tight">IASSAT PayFlow</span>
          </div>

          <div className="login-form-field space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Bienvenido de vuelta
            </h2>
            <p className="text-muted-foreground text-sm">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="login-form-field space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                required
                autoComplete="email"
                className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all duration-200 placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="login-form-field space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contrasena
                </label>
                <button type="button" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">
                  Olvidaste tu contrasena?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contrasena"
                  required
                  autoComplete="current-password"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all duration-200 placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="login-form-field w-full h-11 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200"
             
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar Sesion
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="login-form-field relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">Credenciales de demo</span>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="login-form-field grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setEmail('admin@payflow.com'); setPassword('admin123'); }}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/30 px-3 py-3 text-center hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-xs font-semibold text-foreground">Admin</span>
              <span className="text-[11px] text-muted-foreground">admin@payflow.com</span>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('maria@iassat.com'); setPassword('maria123'); }}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/30 px-3 py-3 text-center hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-xs font-semibold text-foreground">Analista</span>
              <span className="text-[11px] text-muted-foreground">maria@iassat.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
