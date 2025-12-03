import { Modal, Form, Input, InputNumber, message } from "antd";

export default function CreateProductModal({ open, onClose }) {
  const [form] = Form.useForm();

  const submit = async () => {
    const values = await form.validateFields();

    await fetch("https://course.summitglobal.id/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    message.success("Product created!");
    form.resetFields();
    onClose();
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={submit} title="Add Product">
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="price" label="Price">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="stock" label="Stock">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>

        <Form.Item name="image" label="Image URL">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
