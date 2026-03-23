/**
 * Biblioteca de iconos de UniBot
 * Cada variante exporta 3 funciones: Logo (sidebar/header), Avatar (chat), Hero (bienvenida)
 */

// ═══════════════════════════════════════════════════════════
// 1. BOT ESTANDAR - El clasico, con boca segmentada
// ═══════════════════════════════════════════════════════════

function StandardLogo({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="12" x2="28" y2="5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="3.5" r="3" fill={gold} />
      <rect x="10" y="12" width="36" height="32" rx="12" fill={color} />
      <rect x="15" y="18" width="26" height="14" rx="6" fill={dark} opacity="0.6" />
      <rect x="19" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="22" y="37" width="12" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="4" y="22" width="6" height="12" rx="3" fill={color} />
      <rect x="46" y="22" width="6" height="12" rx="3" fill={color} />
    </svg>
  );
}

function StandardAvatar() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="12" x2="28" y2="5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="28" cy="3.5" r="3" fill="#EAAC24" />
      <rect x="10" y="12" width="36" height="32" rx="12" fill="white" opacity="0.95" />
      <rect x="15" y="18" width="26" height="14" rx="6" fill="rgba(25,106,42,0.55)" />
      <rect x="19" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="22" y="37" width="12" height="3" rx="1.5" fill="rgba(25,106,42,0.5)" />
      <rect x="4" y="22" width="6" height="12" rx="3" fill="white" opacity="0.8" />
      <rect x="46" y="22" width="6" height="12" rx="3" fill="white" opacity="0.8" />
    </svg>
  );
}

function StandardHero({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="58" rx="14" ry="2" fill={color} opacity="0.08" />
      <line x1="32" y1="12" x2="32" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="2.5" r="3.5" fill={gold} />
      <circle cx="32" cy="2.5" r="3.5" fill={gold} className="uni-logo__gem-glow" />
      <circle cx="33.2" cy="1.5" r="1" fill="white" opacity="0.4" />
      <rect x="10" y="12" width="44" height="38" rx="14" fill={color} />
      <path d="M18 14C18 14 28 12 42 14C46 15 50 18 50 22" stroke="white" strokeWidth="0.8" opacity="0.1" fill="none" strokeLinecap="round" />
      <rect x="16" y="20" width="32" height="16" rx="8" fill={dark} opacity="0.55" />
      <rect x="21" y="23" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-left" />
      <rect x="36" y="23" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-right" />
      <circle cx="26" cy="25.5" r="1.2" fill="white" opacity="0.35" />
      <circle cx="41" cy="25.5" r="1.2" fill="white" opacity="0.35" />
      <rect x="24" y="42" width="16" height="3.5" rx="1.7" fill="white" opacity="0.65" />
      <line x1="29" y1="42" x2="29" y2="45.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="32" y1="42" x2="32" y2="45.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="35" y1="42" x2="35" y2="45.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <rect x="3" y="24" width="7" height="14" rx="3.5" fill={color} />
      <rect x="54" y="24" width="7" height="14" rx="3.5" fill={color} />
      <line x1="6.5" y1="27" x2="6.5" y2="35" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
      <line x1="57.5" y1="27" x2="57.5" y2="35" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. BOT SONRIENDO - Misma estructura, boca curva amigable
// ═══════════════════════════════════════════════════════════

function SmilingLogo({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="12" x2="28" y2="5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="3.5" r="3" fill={gold} />
      <rect x="10" y="12" width="36" height="32" rx="12" fill={color} />
      <rect x="15" y="18" width="26" height="14" rx="6" fill={dark} opacity="0.6" />
      <rect x="19" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="21" width="6" height="8" rx="3" fill="white" />
      {/* Sonrisa curva */}
      <path d="M23 37C23 37 25.5 39.5 28 39.5C30.5 39.5 33 37 33 37" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      <rect x="4" y="22" width="6" height="12" rx="3" fill={color} />
      <rect x="46" y="22" width="6" height="12" rx="3" fill={color} />
    </svg>
  );
}

function SmilingAvatar() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="12" x2="28" y2="5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="28" cy="3.5" r="3" fill="#EAAC24" />
      <rect x="10" y="12" width="36" height="32" rx="12" fill="white" opacity="0.95" />
      <rect x="15" y="18" width="26" height="14" rx="6" fill="rgba(25,106,42,0.55)" />
      <rect x="19" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="21" width="6" height="8" rx="3" fill="white" />
      <path d="M23 37C23 37 25.5 39.5 28 39.5C30.5 39.5 33 37 33 37" stroke="rgba(25,106,42,0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="4" y="22" width="6" height="12" rx="3" fill="white" opacity="0.8" />
      <rect x="46" y="22" width="6" height="12" rx="3" fill="white" opacity="0.8" />
    </svg>
  );
}

function SmilingHero({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="58" rx="14" ry="2" fill={color} opacity="0.08" />
      <line x1="32" y1="12" x2="32" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="2.5" r="3.5" fill={gold} />
      <circle cx="32" cy="2.5" r="3.5" fill={gold} className="uni-logo__gem-glow" />
      <circle cx="33.2" cy="1.5" r="1" fill="white" opacity="0.4" />
      <rect x="10" y="12" width="44" height="38" rx="14" fill={color} />
      <path d="M18 14C18 14 28 12 42 14C46 15 50 18 50 22" stroke="white" strokeWidth="0.8" opacity="0.1" fill="none" strokeLinecap="round" />
      <rect x="16" y="20" width="32" height="16" rx="8" fill={dark} opacity="0.55" />
      <rect x="21" y="23" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-left" />
      <rect x="36" y="23" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-right" />
      <circle cx="26" cy="25.5" r="1.2" fill="white" opacity="0.35" />
      <circle cx="41" cy="25.5" r="1.2" fill="white" opacity="0.35" />
      {/* Sonrisa curva */}
      <path d="M26 42C26 42 29 45 32 45C35 45 38 42 38 42" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Mejillas */}
      <circle cx="18" cy="38" r="2.5" fill={gold} opacity="0.2" />
      <circle cx="46" cy="38" r="2.5" fill={gold} opacity="0.2" />
      <rect x="3" y="24" width="7" height="14" rx="3.5" fill={color} />
      <rect x="54" y="24" width="7" height="14" rx="3.5" fill={color} />
      <line x1="6.5" y1="27" x2="6.5" y2="35" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
      <line x1="57.5" y1="27" x2="57.5" y2="35" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. BOT PINO - Bot con pino sobre la cabeza
// ═══════════════════════════════════════════════════════════

function PinoLogo({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pino sobre la cabeza */}
      <path d="M28 1L34 9H31L36 15H20L25 9H22L28 1Z" fill={color} opacity="0.75" />
      <circle cx="28" cy="2" r="1.5" fill={gold} />
      {/* Tronco del pino -> conecta con cabeza */}
      <rect x="26.5" y="15" width="3" height="2" rx="1" fill={color} opacity="0.5" />

      <rect x="10" y="17" width="36" height="32" rx="12" fill={color} />
      <rect x="15" y="23" width="26" height="14" rx="6" fill={dark} opacity="0.6" />
      <rect x="19" y="26" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="26" width="6" height="8" rx="3" fill="white" />
      <rect x="22" y="42" width="12" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="4" y="27" width="6" height="12" rx="3" fill={color} />
      <rect x="46" y="27" width="6" height="12" rx="3" fill={color} />
    </svg>
  );
}

function PinoAvatar() {
  return (
    <svg viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 1L34 9H31L36 15H20L25 9H22L28 1Z" fill="white" opacity="0.65" />
      <circle cx="28" cy="2" r="1.5" fill="#EAAC24" />
      <rect x="26.5" y="15" width="3" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="10" y="17" width="36" height="32" rx="12" fill="white" opacity="0.95" />
      <rect x="15" y="23" width="26" height="14" rx="6" fill="rgba(25,106,42,0.55)" />
      <rect x="19" y="26" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="26" width="6" height="8" rx="3" fill="white" />
      <rect x="22" y="42" width="12" height="3" rx="1.5" fill="rgba(25,106,42,0.5)" />
      <rect x="4" y="27" width="6" height="12" rx="3" fill="white" opacity="0.8" />
      <rect x="46" y="27" width="6" height="12" rx="3" fill="white" opacity="0.8" />
    </svg>
  );
}

function PinoHero({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="66" rx="14" ry="2" fill={color} opacity="0.08" />
      {/* Pino grande */}
      <path d="M32 0L40 10H36L43 19H21L28 10H24L32 0Z" fill={color} opacity="0.7" />
      <path d="M32 2L37 9H34L40 16H24L30 9H27L32 2Z" fill={gold} opacity="0.15" />
      <circle cx="32" cy="2" r="2" fill={gold} />
      <circle cx="32" cy="2" r="2" fill={gold} className="uni-logo__gem-glow" />
      <rect x="30.5" y="19" width="3" height="3" rx="1" fill={color} opacity="0.45" />

      <rect x="10" y="22" width="44" height="38" rx="14" fill={color} />
      <path d="M18 24C18 24 28 22 42 24C46 25 50 28 50 32" stroke="white" strokeWidth="0.8" opacity="0.1" fill="none" strokeLinecap="round" />
      <rect x="16" y="30" width="32" height="16" rx="8" fill={dark} opacity="0.55" />
      <rect x="21" y="33" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-left" />
      <rect x="36" y="33" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-right" />
      <circle cx="26" cy="35.5" r="1.2" fill="white" opacity="0.35" />
      <circle cx="41" cy="35.5" r="1.2" fill="white" opacity="0.35" />
      <rect x="24" y="52" width="16" height="3.5" rx="1.7" fill="white" opacity="0.65" />
      <line x1="29" y1="52" x2="29" y2="55.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="32" y1="52" x2="32" y2="55.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="35" y1="52" x2="35" y2="55.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <rect x="3" y="34" width="7" height="14" rx="3.5" fill={color} />
      <rect x="54" y="34" width="7" height="14" rx="3.5" fill={color} />
      <line x1="6.5" y1="37" x2="6.5" y2="45" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
      <line x1="57.5" y1="37" x2="57.5" y2="45" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. BOT SHIELD - Bot con forma de escudo, estilo protector
// ═══════════════════════════════════════════════════════════

function ShieldLogo({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="10" x2="28" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="2.5" r="2.5" fill={gold} />
      {/* Cabeza shield */}
      <path d="M10 16C10 12 13 10 17 10H39C43 10 46 12 46 16V30C46 38 38 46 28 48C18 46 10 38 10 30V16Z" fill={color} />
      <rect x="15" y="18" width="26" height="14" rx="6" fill={dark} opacity="0.6" />
      <rect x="19" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="22" y="37" width="12" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="4" y="22" width="6" height="12" rx="3" fill={color} />
      <rect x="46" y="22" width="6" height="12" rx="3" fill={color} />
    </svg>
  );
}

function ShieldAvatar() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="10" x2="28" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="28" cy="2.5" r="2.5" fill="#EAAC24" />
      <path d="M10 16C10 12 13 10 17 10H39C43 10 46 12 46 16V30C46 38 38 46 28 48C18 46 10 38 10 30V16Z" fill="white" opacity="0.95" />
      <rect x="15" y="18" width="26" height="14" rx="6" fill="rgba(25,106,42,0.55)" />
      <rect x="19" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="31" y="21" width="6" height="8" rx="3" fill="white" />
      <rect x="22" y="37" width="12" height="3" rx="1.5" fill="rgba(25,106,42,0.5)" />
      <rect x="4" y="22" width="6" height="12" rx="3" fill="white" opacity="0.8" />
      <rect x="46" y="22" width="6" height="12" rx="3" fill="white" opacity="0.8" />
    </svg>
  );
}

function ShieldHero({ color = 'var(--accent)', dark = 'var(--green-dark)', gold = 'var(--gold-accent)' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="60" rx="14" ry="2" fill={color} opacity="0.08" />
      <line x1="32" y1="10" x2="32" y2="3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="1.5" r="3" fill={gold} />
      <circle cx="32" cy="1.5" r="3" fill={gold} className="uni-logo__gem-glow" />
      <circle cx="33" cy="0.5" r="0.9" fill="white" opacity="0.4" />
      <path d="M10 16C10 11 14 8 19 8H45C50 8 54 11 54 16V34C54 44 44 54 32 56C20 54 10 44 10 34V16Z" fill={color} />
      <path d="M18 10C18 10 28 8 42 10C47 11 52 14 52 18" stroke="white" strokeWidth="0.8" opacity="0.1" fill="none" strokeLinecap="round" />
      <rect x="16" y="20" width="32" height="16" rx="8" fill={dark} opacity="0.55" />
      <rect x="21" y="23" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-left" />
      <rect x="36" y="23" width="7" height="10" rx="3.5" fill="white" className="uni-logo__eye-right" />
      <circle cx="26" cy="25.5" r="1.2" fill="white" opacity="0.35" />
      <circle cx="41" cy="25.5" r="1.2" fill="white" opacity="0.35" />
      <rect x="24" y="42" width="16" height="3.5" rx="1.7" fill="white" opacity="0.65" />
      <line x1="29" y1="42" x2="29" y2="45.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="32" y1="42" x2="32" y2="45.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="35" y1="42" x2="35" y2="45.5" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <rect x="3" y="24" width="7" height="14" rx="3.5" fill={color} />
      <rect x="54" y="24" width="7" height="14" rx="3.5" fill={color} />
      <line x1="6.5" y1="27" x2="6.5" y2="35" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
      <line x1="57.5" y1="27" x2="57.5" y2="35" stroke={dark} strokeWidth="1" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// REGISTRO DE ICONOS
// ═══════════════════════════════════════════════════════════

export const BOT_ICONS = {
  standard: {
    id: 'standard',
    name: 'Bot Estandar',
    description: 'Clasico bot tecnologico con boca segmentada',
    Logo: StandardLogo,
    Avatar: StandardAvatar,
    Hero: StandardHero,
  },
  smiling: {
    id: 'smiling',
    name: 'Bot Sonriendo',
    description: 'Bot amigable con sonrisa curva y mejillas',
    Logo: SmilingLogo,
    Avatar: SmilingAvatar,
    Hero: SmilingHero,
  },
  pino: {
    id: 'pino',
    name: 'Bot Pino',
    description: 'Bot con pino de Universitaria sobre la cabeza',
    Logo: PinoLogo,
    Avatar: PinoAvatar,
    Hero: PinoHero,
  },
  shield: {
    id: 'shield',
    name: 'Bot Guardian',
    description: 'Bot con forma de escudo protector',
    Logo: ShieldLogo,
    Avatar: ShieldAvatar,
    Hero: ShieldHero,
  },
};

export const ICON_IDS = Object.keys(BOT_ICONS);
