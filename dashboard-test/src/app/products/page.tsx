"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table, Input, Button, Space, Pagination, Typography, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import ProductModal from "@/components/ProductModal";
import type { Product, PaginatedResponse } from "@/types/product";

const { Title, Text } = Typography;

const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function ProductsPage() {
  // data state
  const [rows, setRows] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // query state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // debounce search (300ms)
  const debounceTimer = useRef<any>(null);
  const onChangeSearch = (val: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setSearch(val);
    }, 300);
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<PaginatedResponse<Product>>("/api/products", {
        params: { page, limit, search },
      });

      const list = (data as any)?.data ?? [];
      const totalFromApi = (data as any)?.total ?? list.length;

      setRows(list);
      setTotal(Number(totalFromApi) || 0);
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.error || "Failed to load products");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const columns = useMemo(
    () => [
      { title: "Product Title", dataIndex: "product_title", key: "title" },
      {
        title: "Price",
        dataIndex: "product_price",
        key: "price",
        render: (v: number) => <Text>{currency.format(Number(v || 0))}</Text>,
        width: 160,
      },
      { title: "Category", dataIndex: "product_category", key: "category", width: 160 },
      {
        title: "Description",
        dataIndex: "product_description",
        key: "desc",
        ellipsis: true,
      },
      {
        title: "Actions",
        key: "actions",
        width: 160,
        render: (_: unknown, record: Product) => (
          <Space>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                setOpenModal(true);
              }}
            >
              Edit
            </Button>

            {/* PDF nggak define DELETE endpoint; tombol di-keep tapi disabled */}
            <Popconfirm
              title="Delete product"
              description="Spec doesn't include DELETE endpoint. Implement on BE first."
              okText="OK"
              cancelText="Close"
            >
              <Button size="small" icon={<DeleteOutlined />} disabled>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  const handleCreateOrEdit = async (values: Partial<Product>) => {
    try {
      if (editing?.product_id) {
        await axios.put("/api/product", {
          ...editing,
          ...values,
          product_id: editing.product_id,
        });
        message.success("Product updated");
      } else {
        await axios.post("/api/product", values);
        message.success("Product created");
      }
      setOpenModal(false);
      setEditing(null);
      fetchList();
    } catch (err: any) {
      message.error(err?.response?.data?.error || "Failed to submit");
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Products
          </Title>
          <Text type="secondary">Search across title, description, and category.</Text>
        </div>

        <Space>
          <Input.Search
            allowClear
            placeholder="Search products..."
            onChange={(e) => onChangeSearch(e.target.value)}
            style={{ width: 320 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
          >
            Create
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => fetchList()} />
        </Space>
      </Space>

      <Table<Product>
        rowKey="product_id"
        loading={loading}
        dataSource={rows}
        columns={columns as any}
        pagination={false}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>

      <ProductModal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
        }}
        onSubmit={handleCreateOrEdit}
        initialValues={editing ?? undefined}
      />
    </Space>
  );
}
