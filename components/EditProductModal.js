import { Modal, Form, Input, InputNumber, message } from "antd";

export default function EditProductModal({ open, onClose, data }) {
  const [form] = Form.useForm();

  const submit = async () => {
    const val = await form.validateFields();

    await fetch(`https://course.summitglobal.id/products?id=${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(val),
    });

    message.success("Updated");
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={submit}
      afterOpenChange={() => data && form.setFieldsValue(data)}
      title="Edit Product"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="price" label="Price">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="stock" label="Stock">
          <InputNumber style={{ width: "100%" }} />
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
