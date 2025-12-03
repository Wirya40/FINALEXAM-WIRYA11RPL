import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const apiBase = "https://course.summitglobal.id/products";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(apiBase)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id == id);
        setProduct(found);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${apiBase}?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        price: Number(product.price),
      }),
    });

    if (!res.ok) return alert("Update failed");

    router.push("/");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Edit Product</h1>

      <form onSubmit={handleUpdate}>
        <input
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
        />

        <input
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
        />

        <button type="submit">Update</button>
      </form>

      <button onClick={() => router.push("/")}>Back to Home</button>
    </div>
  );
}
