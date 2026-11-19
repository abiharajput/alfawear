interface AlfaWearLogoProps {
  size?: number;
  className?: string;
}

export const ALFAWEAR_EMBLEM_SRC =
  '/assets/aistudio/AlfaWear_Wolf_Fashion_Emblem_744c0625.png';

export function AlfaWearLogo({ size = 56, className = '' }: AlfaWearLogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-white ring-2 ring-amber-400/70 shadow-xs shrink-0 ${className}`}
    >
      <img
        src={ALFAWEAR_EMBLEM_SRC}
        alt="AlfaWear circular realistic wolf emblem"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover scale-[1.05]"
      />
    </div>
  );
}
