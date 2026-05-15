import { createMDX } from "fumadocs-mdx/next";

/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/getting-started",
        destination: "/docs/installation",
        permanent: true,
      },
      {
        source: "/docs/getting-started",
        destination: "/docs/installation",
        permanent: true,
      },
      {
        source: "/api",
        destination: "/docs/api",
        permanent: true,
      },
      {
        source: "/examples",
        destination: "/docs/examples",
        permanent: true,
      },
      {
        source: "/forms",
        destination: "/docs/forms",
        permanent: true,
      },
      {
        source: "/patterns",
        destination: "/docs/patterns",
        permanent: true,
      },
      {
        source: "/styling",
        destination: "/docs/styling",
        permanent: true,
      },
      {
        source: "/changelog",
        destination: "/docs/changelog",
        permanent: true,
      },
      {
        source: "/temporary-overview",
        destination: "/docs",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(.*)application/vnd\\.shadcn\\.v1\\+json(.*)",
            },
          ],
          destination: "/stepper.json",
        },
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "user-agent",
              value: "shadcn",
            },
          ],
          destination: "/stepper.json",
        },
        {
          source: "/r/:path*",
          destination: "/:path*",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Vary", value: "Accept, User-Agent" }],
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
