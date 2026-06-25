'use client';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
};

export function Button({ children, onClick, variant = 'primary', className = '', disabled }: ButtonProps) {
  const base = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200';
  const styles = {
    primary: 'bg-[#E19C63] text-[#27262E] hover:bg-[#c98a52]',
    secondary: 'bg-[#8BA5BE] text-white hover:bg-[#7a94ad]',
  };
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${disabledStyle} ${className}`}>
      {children}
    </button>
  );
}
