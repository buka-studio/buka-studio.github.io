import { cn } from "../util";

export default function CrossBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg
        className="absolute -left-[6.5px] -top-[5.5px] z-[1]"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M6 0V12M0 6H12" stroke="currentColor"></path>
      </svg>
      <svg
        className="absolute -left-[6.5px] -bottom-[5.5px] z-[1]"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M6 0V12M0 6H12" stroke="currentColor"></path>
      </svg>
      <svg
        className="absolute -right-[6.5px] -top-[5.5px] z-[1]"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M6 0V12M0 6H12" stroke="currentColor"></path>
      </svg>
      <svg
        className="absolute -right-[6.5px] -bottom-[5.5px] z-[1]"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M6 0V12M0 6H12" stroke="currentColor"></path>
      </svg>
    </div>
  );
}
