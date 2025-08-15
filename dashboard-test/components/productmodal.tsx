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
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialValues?.product_id ? "Edit Product" : "Create Product"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={initialValues?.product_id ? "Save" : "Create"}
      onOk={handleOk}
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
          rules={[
            { required: true, message: "Please enter price" },
            { type: 'number', min: 0, message: "Price must be greater than 0" }
          ]}
        >
          <InputNumber 
            min={0} 
            precision={0} 
            style={{ width: "100%" }} 
            placeholder="e.g. 1599000"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
          />
        </Form.Item>

        <Form.Item 
          name="product_category" 
          label="Category"
          rules={[{ required: true, message: "Please enter product category" }]}
        >
          <Input placeholder="e.g. Electronics" />
        </Form.Item>

        <Form.Item name="product_description" label="Description">
          <Input.TextArea rows={3} placeholder="Short description..." />
        </Form.Item>

        <Form.Item 
          name="product_image" 
          label="Image URL"
          rules={[
            { type: 'url', message: "Please enter a valid URL" }
          ]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
