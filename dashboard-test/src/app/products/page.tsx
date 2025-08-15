"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Pagination,
  Typography,
  message,
  Popconfirm,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ProductModal from "@/components/ProductModal";
import type { Product, PaginatedResponse } from "@/types/product";

const { Title, Text } = Typography;

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function ProductsPage() {
  // ===== states
  const [rows, setRows] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // query
  const [page, setPage] = useState(1); // 1-based
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // ===== debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeSearch = (val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(val);
    }, 300);
  };

  // ===== fetch list
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<PaginatedResponse<Product>>(
        "/api/products",
        { params: { page, limit, search } }
      );

      // defensive mapper: some APIs return {data, total}, some just array
      const list = (data as any)?.data ?? (Array.isArray(data) ? data : []);
      const totalFromApi = Number((data as any)?.total ?? list.length) || 0;

      setRows(list);
      setTotal(totalFromApi);
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

  // ===== columns
  const columns = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "product_title",
        key: "title",
        render: (t: string) => <Text strong>{t}</Text>,
      },
      {
        title: "Price",
        dataIndex: "product_price",
        key: "price",
        width: 160,
        render: (v: number) => currency.format(Number(v || 0)),
      },
      {
        title: "Category",
        dataIndex: "product_category",
        key: "category",
        width: 160,
        render: (c: string | undefined) =>
          c ? <Tag color="blue">{c}</Tag> : <Tag>—</Tag>,
      },
      {
        title: "Description",
        dataIndex: "product_description",
        key: "desc",
        ellipsis: true,
      },
      {
        title: "Actions",
        key: "actions",
        width: 180,
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

            {/* Spec PDF nggak define DELETE; keep disabled biar clear */}
            <Popconfirm
              title="Delete product"
              description="Backend spec has no DELETE endpoint in the PDF."
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

  // ===== handlers
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
      fetchList(); // refresh
    } catch (err: any) {
      message.error(err?.response?.data?.error || "Failed to submit");
    }
  };

  const handleRefresh = () => {
    fetchList();
  };

  // ===== render
  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Products
          </Title>
          <Text type="secondary">
            Search, paginate, create & edit products via API proxy.
          </Text>
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
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
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
