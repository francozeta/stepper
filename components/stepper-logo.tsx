import type { SVGProps } from "react";

function StepperLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M139 32a7 7 0 0 1 14 0v104.6c0 18.3-8.8 35.4-23.7 46L55.8 235H22l93.4-66.6A30.2 30.2 0 0 0 128 143.8V32h11Z" />
      <path d="M160 42c14.2-5.8 27.9 11.3 50 6.6-8.6 12.4-21.8 18-36.2 16.1-5.8-.8-10-2.5-13.8-4.2V42Z" />
      <path d="M163 82.8 210 99v105c0 18.2-14.8 33-33 33h-74.7l43.7-31.2c15.6-11.1 24.9-29.1 24.9-48.2V103.8L163 101V82.8Zm20 59.2a7 7 0 0 1 14 0v24h-14v-24Z" />
      <path d="M84 87.5 122 77v50H66V99.8l18-4.9v-7.4Zm-31 43.5h71v22H53a7 7 0 0 1-7-7v-8a7 7 0 0 1 7-7Zm-32 33h77v22H21a7 7 0 0 1-7-7v-8a7 7 0 0 1 7-7Zm-10 33h62v22H11a7 7 0 0 1-7-7v-8a7 7 0 0 1 7-7Z" />
      <circle cx="42" cy="116" r="13" />
    </svg>
  );
}

export { StepperLogo };
