import { BOT_ICONS } from './BotIcons';
import './UniLogo.css';

/**
 * UniBot Logo - Wrapper dinamico que renderiza el icono seleccionado
 *
 * Usa el registro BOT_ICONS para mostrar la variante elegida en admin.
 * Props: size, iconId (default: 'standard')
 */

export default function UniLogo({ size = 36, iconId = 'standard' }) {
  const icon = BOT_ICONS[iconId] || BOT_ICONS.standard;
  const LogoComponent = icon.Logo;

  return (
    <div className="uni-logo" style={{ width: size, height: size }}>
      <LogoComponent />
    </div>
  );
}

export function UniBotAvatar({ size = 34, iconId = 'standard' }) {
  const icon = BOT_ICONS[iconId] || BOT_ICONS.standard;
  const AvatarComponent = icon.Avatar;

  return (
    <div className="uni-bot-avatar" style={{ width: size, height: size, minWidth: size }}>
      <div style={{ width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AvatarComponent />
      </div>
    </div>
  );
}

export function UniBotHero({ size = 120, iconId = 'standard' }) {
  const icon = BOT_ICONS[iconId] || BOT_ICONS.standard;
  const HeroComponent = icon.Hero;

  return (
    <div className="uni-bot-hero" style={{ width: size, height: size }}>
      <div className="uni-bot-hero__glow" />
      <HeroComponent />
    </div>
  );
}
