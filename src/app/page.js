import Hero from "@/components/Home/Hero";
import PromoStrip from "@/components/Home/PromoStrip";
import ShopByCategory from "@/components/Home/ShopByCategory";
import ProductGrid from "@/components/Home/ProductGrid";
import SecondarySlider from "@/components/Home/SecondarySlider";
import TrendingPopular from "@/components/Home/TrendingPopular";
import SplitFeature from "@/components/Home/SplitFeature";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <PromoStrip />
      <ShopByCategory />
      <ProductGrid />
      <SecondarySlider />
      <TrendingPopular />
      <SplitFeature />
      <WhyChooseUs />
    </>
  );
}
