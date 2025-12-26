/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Mark pdf-parse as external package for server components
  serverExternalPackages: ["pdf-parse", "openai"],
  // Configure for webpack (needed for pdf-parse CommonJS module)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark pdf-parse as external for server-side only
      config.externals = config.externals || []
      config.externals.push({
        "pdf-parse": "commonjs pdf-parse",
      })
    }
    return config
  },
  // Add empty turbopack config to silence warning
  // We're using webpack explicitly for pdf-parse compatibility
  turbopack: {},
}

export default nextConfig

