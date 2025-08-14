export interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_image?: string;
  product_category?: string;
  created_timestamp?: string;
  updated_timestamp?: string;
}

export interface ProductListParams {
  page: number;   // 1-based
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;     // total items (fallback to length if backend not sending)
  page?: number;
  limit?: number;
}
