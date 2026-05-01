import { createMDX } from "fumadocs-mdx/next";

/** @type {import("next").NextConfig} */
const nextConfig = {
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
          destination: "/r/stepper.json",
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
          destination: "/r/stepper.json",
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
