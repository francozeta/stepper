const siteConfig = {
  name: "Stepper",
  description:
    "A lightweight Stepper component for React, Next.js, Tailwind CSS, and shadcn/ui-style projects.",
  url: "https://francozeta-stepper.vercel.app",
  repository: "https://github.com/francozeta/stepper",
  registryItem: "/stepper.json",
  registryDemoItem: "/stepper-demo.json",
};

function absoluteUrl(pathname: string) {
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  return `${siteConfig.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export { absoluteUrl, siteConfig };
