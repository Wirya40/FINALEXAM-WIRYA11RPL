import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";

export default function ProductFormModal({
  visible,
  onClose,
  onSuccess,
  product,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? 0,
        stock: product.stock ?? 0,
        category: product.category || "",
        image: product.image || "",
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!values.image) {
        values.image = "/placeholder.png"; // file harus ada di public/
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
      <Form key={product?.id || "new"} form={form} layout="vertical">
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
