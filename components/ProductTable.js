import { useState } from "react";
import { Table, Button, Input, Select, Space, message, Modal, Image, Descriptions } from "antd";
import CreateProductModal from "@/components/CreateProductModal";
import EditProductModal from "@/components/EditProductModal";
import { useGlobal } from "@/context/GlobalContext";

export default function ProductTable({ initialProducts, data, setData }) {
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedCategory, setSelectedCategory } = useGlobal();

  const refresh = async () => {
    setLoading(true);
    const res = await fetch("/api/refresh-products");
    const json = await res.json();

    if (Array.isArray(json)) {
      setData(json);
    } else {
      message.error("Invalid product data");
      setData([]);
    }

    setLoading(false);
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete product?",
      onOk: async () => {
        const payload = {
          name: item.name,
          description: item.description,
          price: item.price,
          stock: 0,
          category: item.category,
          image: item.image,
        };

        await fetch(`https://course.summitglobal.id/products?id=${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        message.success("Item set to inactive");
        refresh();
      },
    });
  };

  const safeData = Array.isArray(data) ? data : [];
 const safeInitial = Array.isArray(initialProducts) ? initialProducts : [];
  const filtered = safeData.filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => <Image width={60} src={img} />,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Price", dataIndex: "price" },
    { title: "Stock", dataIndex: "stock" },
    {
      title: "Action",
      render: (item) => (
        <Space>
          <Button onClick={() => { setSelectedItem(item); setViewOpen(true); }}>
            View
          </Button>
          <Button onClick={() => { setSelectedItem(item); setEditOpen(true); }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(item)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search..."
          onChange={(e) => {
            const q = e.target.value.toLowerCase();
            setData(
              initialProducts.filter((p) =>
                p.name.toLowerCase().includes(q)
              )
            );
          }}
        />

      

<Select
  value={selectedCategory}
  onChange={setSelectedCategory}
  style={{ width: 150 }}
  options={[
    { value: "all", label: "All" },
    ...Array.from(new Set(safeInitial.map((p) => p.category))).map((c) => ({
      value: c,
      label: c
    }))
  ]}
/>


        <Button onClick={refresh}>Refresh</Button>
        <Button type="primary" onClick={() => setCreateOpen(true)}>
          Add Product
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filtered}
        rowClassName={(record) => (record.stock === 0 ? "inactive-row" : "")}
      />

      <CreateProductModal open={createOpen} onClose={() => { setCreateOpen(false); refresh(); }} />
      <EditProductModal open={editOpen} onClose={() => { setEditOpen(false); refresh(); }} data={selectedItem} />

      {/* VIEW PRODUCT MODAL */}
      <Modal
        open={viewOpen}
        title="Product Details"
        footer={null}
        onCancel={() => setViewOpen(false)}
      >
        {selectedItem && (
          <>
            <Image
              src={selectedItem.image}
              width={200}
              style={{ marginBottom: 16 }}
            />

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">{selectedItem.name}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedItem.category}</Descriptions.Item>
              <Descriptions.Item label="Price">{selectedItem.price}</Descriptions.Item>
              <Descriptions.Item label="Stock">{selectedItem.stock}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedItem.description}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
}
