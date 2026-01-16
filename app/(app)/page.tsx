import Image from "next/image";
import  {sanityFetch} from "@/sanity/lib/live";

export default async function Home() {
  const categories = await sanityFetch({
    query: `*[_type == "category"]
  `});

  console.log(categories);

  return (
    <div className="">
     {/* Feature Product Carousel */}

     {/* Page Banner */}

     {/* Category Tiles */}
    </div>
  );
}
