import { Link } from 'react-router-dom';

export default function BrandLogo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center whitespace-nowrap leading-none"
      aria-label="Nowshin Fashion House"
    >
      <span className="font-['Plus_Jakarta_Sans'] text-[18px] font-[800] tracking-[-0.03em] text-[#1D4ED8] sm:text-[22px] lg:text-[28px]">
        Nowshin
      </span>
      <span className="ml-2 font-['Plus_Jakarta_Sans'] text-[18px] font-[600] tracking-[-0.01em] text-[#DB2777] sm:text-[22px] lg:text-[28px]">
        Fashion
      </span>
      <span className="ml-2 font-['Plus_Jakarta_Sans'] text-[18px] font-[600] tracking-[-0.01em] text-[#0F172A] sm:text-[22px] lg:text-[28px]">
        House
      </span>
    </Link>
  );
}
