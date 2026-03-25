import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "nez3hko8fm.ufs.sh" },
      { protocol: "https", hostname: "portal.airfi.aero" },
      { protocol: "https", hostname: "sandbox.picasso.juspay.in" },
      { protocol: "https", hostname: "cdn.cutshort.io" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "companieslogo.com" },
      { protocol: "https", hostname: "www.shubhkumar.in" },
    ],
  },
};

export default nextConfig;
