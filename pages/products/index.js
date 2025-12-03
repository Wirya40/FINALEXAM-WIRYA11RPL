import { useEffect, useState } from "react";
import { Table, Button, message, Skeleton, Input, Select, Space } from "antd";
import ProductFormModal from "../../components/ProductFormModal";
import TopBar from "../../components/TopBar";

const { Search } = Input;
const { Option } = Select;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Apply search and category filter
  useEffect(() => {
    let temp = [...products];
    if (searchText) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (categoryFilter) {
      temp = temp.filter((p) => p.category === categoryFilter);
    }
    setFilteredProducts(temp);
  }, [products, searchText, categoryFilter]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      message.success("Product deleted!");
      loadProducts();
    } catch (err) {
      console.error(err);
      message.error("Delete failed!");
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <img
          src={src}
          alt="img"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rp ${price.toLocaleString()}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) =>
        stock === 0 ? <span style={{ color: "red" }}>Out of stock</span> : stock,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <TopBar />

      <div className="flex justify-between my-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button type="primary" onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      {/* Search, Category filter, Refresh */}
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by name"
          onSearch={(value) => setSearchText(value)}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by category"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setCategoryFilter(value)}
        >
          {categories.map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>
        <Button onClick={loadProducts}>Refresh</Button>
      </Space>

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredProducts.map((p) => ({ ...p, key: p.id }))}
          pagination={{ pageSize: 5 }}
        />
      )}

      <ProductFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={loadProducts}
        product={editingProduct}
      />
    </div>
  );
}
