import { useEffect, useState } from "react";
import { Card, Skeleton, Row, Col, message } from "antd";
import TopBar from "../components/TopBar";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [randomProduct, setRandomProduct] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();
      const data = json.data || [];
      setProducts(data);

      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);

      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomProduct(data[randomIndex]);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* TopBar */}
     

      {/* Dashboard Content */}
      <div className="p-5 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {/* Total Products */}
            <Col span={8}>
              <Card
                title="Total Products"
                bordered
                className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300"
              >
                <h2>{products.length}</h2>
              </Card>
            </Col>

            {/* Categories */}
            <Col span={8}>
              <Card
                title="Categories"
                bordered
                className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300"
              >
                {categories.length === 0 ? (
                  <p>No categories</p>
                ) : (
                  <ul className="list-disc pl-5">
                    {categories.map((cat) => (
                      <li key={cat}>{cat}</li>
                    ))}
                  </ul>
                )}
              </Card>
            </Col>

            {/* Random Product */}
            <Col span={8}>
              <Card
                title="Random Product"
                bordered
                className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300"
              >
                {randomProduct ? (
                  <>
                    <img
                      src={randomProduct?.image || "/no-image.png"}
                      alt={randomProduct?.name || "Product"}
                      className="w-full h-36 object-cover rounded-md mb-2"
                    />
                    <h3 className="font-semibold">{randomProduct?.name}</h3>
                    <p>
                      Price: Rp{" "}
                      {randomProduct?.price
                        ? randomProduct.price.toLocaleString()
                        : "0"}
                    </p>
                    <p>
                      Stock:{" "}
                      {randomProduct?.stock === 0 ? (
                        <span className="text-red-500">Out of stock</span>
                      ) : (
                        randomProduct?.stock ?? "Unknown"
                      )}
                    </p>
                  </>
                ) : (
                  <p>No products</p>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
