import { Link } from 'react-router-dom';

export default function BrandLogo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center whitespace-nowrap leading-none"
      aria-label="Nowshin Fashion House"
    >
      <span className="font-[800] tracking-[-0.03em] text-[#102A56] text-[18px] sm:text-[22px] lg:text-[28px]">
        Nowshin
      </span>
      <span className="ml-2 font-[500] tracking-[0.14em] uppercase text-[#C89A3D] text-[11px] sm:text-[12px] lg:text-[14px]">
        Fashion House
      </span>
    </Link>
  );
}
