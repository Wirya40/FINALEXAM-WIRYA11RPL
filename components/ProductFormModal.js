import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";

export default function ProductFormModal({ visible, onClose, onSuccess, product }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      // prefill form for editing
      form.setFieldsValue({
        name: product.name || "",
        description: product.description || "",
        price: product.price != null ? product.price : 0,
        stock: product.stock != null ? product.stock : 0,
        category: product.category || "",
        image: product.image || "",
      });
    } else {
      // reset form for adding
      form.resetFields();
    }
  }, [product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // If image is empty, assign a default placeholder
      if (!values.image) {
        values.image = "/placeholder.png"; // put a placeholder image in public folder
      }

      const result = product ? { ...values, id: product.id } : values;
      onSuccess(result);
      form.resetFields();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      title={product ? "Edit Product" : "Add Product"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {product ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Please enter stock" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter category" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Image URL"
          name="image"
          tooltip="Leave empty to use default placeholder"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
