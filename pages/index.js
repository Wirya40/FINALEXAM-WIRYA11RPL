import { useEffect, useState } from "react";
import { Table, Button, message, Skeleton, Input, Select, Space, Modal } from "antd";
import ProductFormModal from "../components/ProductFormModal";
import TopBar from "../components/TopBar";

const { Search } = Input;
const { Option } = Select;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Load products from API
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Fetch failed");
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

  // Filter products
 useEffect(() => {
  let temp = [...products];

  if (searchText) {
    temp = temp.filter(p =>
      (p.name || "").toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (categoryFilter) {
    temp = temp.filter(p => (p.category || "") === categoryFilter);
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

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Delete failed");
          setProducts(prev => prev.filter(p => p.id !== id));
          message.success("Product deleted successfully!");
        } catch (err) {
          console.error(err);
          message.error("Failed to delete product");
        }
      },
    });
  };

  // Add/Edit product
 const handleModalSuccess = async (newOrUpdatedProduct) => {
  try {
    let res;
    if (editingProduct) {
      // EDIT: PUT to API
      res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrUpdatedProduct),
      });
    } else {
      // ADD: POST to API
      res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrUpdatedProduct),
      });
    }

    if (!res.ok) throw new Error("Failed to save product to API");

    const savedProduct = await res.json();

    // Ensure it has an id
    if (!savedProduct.id) savedProduct.id = Date.now();

    if (editingProduct) {
      // Update product in both products and filteredProducts
      setProducts(prev =>
        prev.map(p => (p.id === savedProduct.id ? savedProduct : p))
      );
      setFilteredProducts(prev =>
        prev.map(p => (p.id === savedProduct.id ? savedProduct : p))
      );
      message.success("Product updated successfully!");
    } else {
      // Add new product to top
      setProducts(prev => [savedProduct, ...prev]);
      setFilteredProducts(prev => [savedProduct, ...prev]);
      message.success("Product added successfully!");
    }

    setModalVisible(false);
    setEditingProduct(null);
  } catch (err) {
    console.error(err);
    message.error("Failed to save product. Try again.");
  }
};



  const categories = Array.from(new Set(products.map(p => p.category)));

  const columns = [
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (src) => (
      <img
        src={src || "/placeholder.png"} // fallback image if missing
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
    render: (p) => `Rp ${p != null ? p.toLocaleString() : "0"}`,
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    render: (s) =>
      s != null ? (s === 0 ? <span style={{ color: "red" }}>Out of stock</span> : s) : 0,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button onClick={() => handleEdit(record)}>Edit</Button>
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      </Space>
    ),
  },
];


  return (
    <div className="p-5">
      <TopBar />

      <div className="flex justify-between my-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button type="primary" onClick={handleAdd}>Add Product</Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
  <Search
    placeholder="Search by name"
    allowClear
    style={{ width: 200 }}
    value={searchText}
    // Update searchText on every change, not only on Enter
    onChange={(e) => setSearchText(e.target.value)}
  />
  <Select
    placeholder="Filter by category"
    allowClear
    onChange={setCategoryFilter}
    style={{ width: 200 }}
  >
    {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
  </Select>
  <Button onClick={loadProducts}>Refresh</Button>
</Space>


      {loading ? <Skeleton active paragraph={{rows:5}} /> :
        <Table columns={columns} dataSource={filteredProducts.map(p => ({...p, key:p.id}))} pagination={{pageSize:5}} />
      }

      <ProductFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleModalSuccess}
        product={editingProduct}
      />
    </div>
  );
}
