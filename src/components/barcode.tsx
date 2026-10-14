import { BARCODE_MODULES, barcodeBars } from "@/lib/barcode";

export function Barcode({ value, className }: { value: string; className?: string }) {
  return (
    <svg viewBox={`0 0 ${BARCODE_MODULES} 40`} preserveAspectRatio="none" aria-hidden="true" className={className}>
      {barcodeBars(value).map((bar) => (
        <rect key={bar.x} x={bar.x} width={bar.width} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}
