/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

import type { NextConfig } from "next";

const nextConfig = {
  // No need for experimental.appDir in Next.js 13+
  reactStrictMode: true,
  //swcMinify: true,

};

export default nextConfig;
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}
