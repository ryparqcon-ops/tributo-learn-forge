import { motion } from 'framer-motion';

interface CompanyLogoProps {
  name: string;
  className?: string;
}

const CompanyLogo = ({ name, className = "" }: CompanyLogoProps) => {
  const logos: Record<string, JSX.Element> = {
    "Grupo Romero": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="10" y="15" width="80" height="10" rx="2" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">
          GRUPO ROMERO
        </text>
      </svg>
    ),
    "Backus": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <circle cx="20" cy="20" r="15" fill="#FF6B35" />
        <text x="50" y="25" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">
          BACKUS
        </text>
      </svg>
    ),
    "Interbank": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="10" width="90" height="20" rx="3" fill="#1E40AF" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
          INTERBANK
        </text>
      </svg>
    ),
    "Ripley": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="10" y="12" width="80" height="16" rx="2" fill="#E11D48" />
        <text x="50" y="25" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
          RIPLEY
        </text>
      </svg>
    ),
    "Falabella": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="8" width="90" height="24" rx="4" fill="#059669" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
          FALABELLA
        </text>
      </svg>
    ),
    "Credicorp": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <circle cx="20" cy="20" r="12" fill="#7C3AED" />
        <rect x="35" y="12" width="50" height="16" rx="2" fill="#7C3AED" />
        <text x="60" y="25" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
          CREDICORP
        </text>
      </svg>
    ),
    "Alicorp": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="10" y="10" width="80" height="20" rx="3" fill="#DC2626" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
          ALICORP
        </text>
      </svg>
    ),
    "Gloria": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <circle cx="20" cy="20" r="15" fill="#F59E0B" />
        <text x="50" y="25" textAnchor="middle" fontSize="9" fill="currentColor" fontWeight="bold">
          GLORIA
        </text>
      </svg>
    ),
    "Volkswagen": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <circle cx="20" cy="20" r="12" fill="#1F2937" />
        <text x="50" y="25" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">
          VOLKSWAGEN
        </text>
      </svg>
    ),
    "Samsung": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="8" width="90" height="24" rx="2" fill="#1E40AF" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
          SAMSUNG
        </text>
      </svg>
    ),
    "Microsoft": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="5" width="20" height="20" fill="#F25022" />
        <rect x="30" y="5" width="20" height="20" fill="#7FBA00" />
        <rect x="5" y="30" width="20" height="5" fill="#00A4EF" />
        <rect x="30" y="30" width="20" height="5" fill="#FFB900" />
        <text x="70" y="25" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">
          MICROSOFT
        </text>
      </svg>
    ),
    "Google": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <text x="50" y="25" textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">
          Google
        </text>
      </svg>
    ),
    "BCP": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="8" width="90" height="24" rx="4" fill="#1E40AF" />
        <text x="50" y="25" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
          BCP
        </text>
      </svg>
    ),
    "Scotiabank": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="10" y="10" width="80" height="20" rx="3" fill="#DC2626" />
        <text x="50" y="25" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
          SCOTIABANK
        </text>
      </svg>
    ),
    "Movistar": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <circle cx="20" cy="20" r="12" fill="#059669" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">
          MOVISTAR
        </text>
      </svg>
    ),
    "Claro": (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="8" width="90" height="24" rx="4" fill="#7C3AED" />
        <text x="50" y="25" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
          CLARO
        </text>
      </svg>
    )
  };

  return logos[name] || (
    <div className={`w-16 h-8 bg-gray-200 rounded flex items-center justify-center ${className}`}>
      <span className="text-xs text-gray-500">{name}</span>
    </div>
  );
};

export default CompanyLogo;
