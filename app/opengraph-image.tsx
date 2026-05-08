import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const alt =
  "Stepper, a shadcn registry component for guided multi-step flows";
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return createSocialImage();
}
