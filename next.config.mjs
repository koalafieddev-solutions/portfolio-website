/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Webpack's persistent filesystem cache has been repeatedly corrupting
    // itself on this machine ("too many length or distance symbols" / bad
    // gzip in the pack file), forcing a `.next` wipe every few edits.
    // Memory-only cache in dev trades a bit of cold-start speed for not
    // hitting that again.
    if (dev) {
      config.cache = { type: "memory" }
    }
    return config
  },
}

export default nextConfig
