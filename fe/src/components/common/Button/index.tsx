import React from 'react';

type Props = {
  variant?: 'blue' | 'outline' | 'white' | 'black' | 'red' | 'yellow' | 'blackOutline';
  size?: 'large' | 'small' | 'responsive';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  'w-full rounded-md flex items-center justify-center whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  large: 'h-[60px] text-[22px] md:h-[46px] md:text-[18px]',
  small: 'h-[36px] text-[16px] md:h-[32px] md:text-[14px]',
  responsive: 'h-[36px] text-[16px] md:h-[32px] md:text-[14px] min-[960px]:h-[60px] min-[960px]:text-[22px]',
};

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  outline: 'bg-transparent text-white shadow-[0_0_0_1px_#ffffff_inset] hover:bg-zinc-900',
  blackOutline: 'bg-transparent text-black shadow-[0_0_0_1px_#000000_inset] hover:bg-[#d5ecec]',
  white: 'bg-white text-black hover:bg-[#959595]',
  black: 'bg-[#212121] text-white hover:bg-black',
  blue: 'bg-[#0D2141] text-white hover:bg-[#040e1f]',
  yellow: 'bg-[#E7C342] text-white hover:bg-[#dcb422]',
  red: 'bg-[#FF0022] text-white hover:bg-[#da001d]',
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export default function Button({ variant = 'blue', size = 'responsive', className, type = 'button', ...props }: Props) {
  return <button type={type} className={cx(base, sizeClass[size], variantClass[variant], className)} {...props} />;
}
