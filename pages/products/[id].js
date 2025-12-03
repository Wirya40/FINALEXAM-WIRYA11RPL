import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading product...</p>;
  if (!product) return <p className="text-red-500">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-5 rounded shadow">
        <Link href="/" className="text-blue-600 underline mb-4 inline-block">
          &larr; Back
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 h-80 relative rounded overflow-hidden bg-gray-200">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="mb-2">{product.description}</p>
            <p className="mb-2">Category: {product.category}</p>
            <p className="mb-2">
              Price: Rp {product.price?.toLocaleString() ?? "-"}
            </p>
            <p className="mb-2">Stock: {product.stock ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
