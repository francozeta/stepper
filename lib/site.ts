const siteConfig = {
  name: "Stepper",
  description:
    "A shadcn registry component for guided multi-step flows in React, Next.js, and Tailwind CSS projects.",
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
