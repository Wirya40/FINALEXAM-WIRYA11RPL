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

      // Count unique categories
      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);

      // Pick a random product
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
    <div className="p-5">
      {/* Top navigation */}
      <TopBar />

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="Total Products" bordered>
                <h2>{products.length}</h2>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Categories" bordered>
                {categories.length === 0 ? (
                  <p>No categories</p>
                ) : (
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat}>{cat}</li>
                    ))}
                  </ul>
                )}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Random Product" bordered>
                {randomProduct ? (
                  <>
                    <img
                      src={randomProduct.image}
                      alt={randomProduct.name}
                      style={{ width: "100%", height: 150, objectFit: "cover" }}
                    />
                    <h3>{randomProduct.name}</h3>
                    <p>Price: Rp {randomProduct.price.toLocaleString()}</p>
                    <p>
                      Stock:{" "}
                      {randomProduct.stock === 0 ? (
                        <span style={{ color: "red" }}>Out of stock</span>
                      ) : (
                        randomProduct.stock
                      )}
                    </p>
                  </>
                ) : (
                  <p>No products</p>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
