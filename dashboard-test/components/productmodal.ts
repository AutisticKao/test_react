"use client";
import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";
import type { Product } from "@/types/product";

type Values = Partial<Product>;

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Values) => Promise<void> | void;
  initialValues?: Values | null;
}

export default function ProductModal({ open, onCancel, onSubmit, initialValues }: Props) {
  const [form] = Form.useForm<Values>();

  useEffect(() => {
    if (open) {
      if (initialValues) form.setFieldsValue(initialValues);
      else form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={initialValues?.product_id ? "Edit Product" : "Create Product"}
      open={open}
      onCancel={onCancel}
      okText={initialValues?.product_id ? "Save" : "Create"}
      onOk={async () => {
        const values = await form.validateFields();
        await onSubmit(values);
      }}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="product_title"
          label="Product Title"
          rules={[{ required: true, message: "Please enter product title" }]}
        >
          <Input placeholder="e.g. Mechanical Keyboard" />
        </Form.Item>

        <Form.Item
          name="product_price"
          label="Price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber min={0} precision={0} style={{ width: "100%" }} placeholder="e.g. 1599000" />
        </Form.Item>

        <Form.Item name="product_category" label="Category">
          <Input placeholder="e.g. Electronics" />
        </Form.Item>

        <Form.Item name="product_description" label="Description">
          <Input.TextArea rows={3} placeholder="Short description..." />
        </Form.Item>

        <Form.Item name="product_image" label="Image URL">
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
