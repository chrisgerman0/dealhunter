/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // R2R's live RentCast photos can come from whatever CDN host that
    // listing's MLS syndicates through — not knowable ahead of a real key.
    // `unoptimized` skips Vercel's image loader (and its host allowlist)
    // entirely; images still render at the same sizes via CSS, just without
    // server-side resizing. BMV's Unsplash images are unaffected in output.
    unoptimized: true,
  },
};

export default nextConfig;
