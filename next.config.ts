import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */ images: {
    domains: [
      'static.nike.com',
      'assets.adidas.com',
      'reebok.ugc.bazaarvoice.com',
      'www.converse.com',
      'www.asics.com',
      'images.vans.com'
    ],
  },
};

export default withFlowbiteReact(nextConfig);