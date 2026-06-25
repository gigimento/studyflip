'use client';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
};

export function Button({ children, onClick, variant = 'primary', className = '', disabled }: ButtonProps) {
  const base = 'px-6 py-3 font-bold rounded-2xl transition-all duration-150 text-base tracking-wide';
  const styles = {
    primary: 'bg-[#58cc02] text-white border-b-[4px] border-[#58a700] hover:bg-[#89e219] hover:border-[#58a700] active:translate-y-[4px] active:border-b-0',
    secondary: 'bg-white text-[#777777] border-2 border-[#e5e5e5] border-b-[4px] hover:text-[#3c3c3c] hover:border-[#afafaf] active:translate-y-[2px] active:border-b-[2px]',
    danger: 'bg-[#ff4b4b] text-white border-b-[4px] border-[#cc3b3b] hover:bg-[#ff6b6b]',
  };
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${disabledStyle} ${className}`}>
      {children}
    </button>
  );
}
