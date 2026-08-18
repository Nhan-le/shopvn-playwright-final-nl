import type { APIRequestContext } from '@playwright/test';

export type Product = {
  _id: string;
  name: string;
  price: number;
  emoji: string;
  tag: string;
  category: string;
  stock: number;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
};

export type Order = {
  _id: string;
  id: string;
  items: CartItem[];
  recipientName: string;
  recipientPhone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
  paymentIntentId: string | null;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    avatar: string | null;
  };
};

type Profile = LoginResponse['user'];

type CreateOrderInput = {
  items: CartItem[];
  recipientName: string;
  recipientPhone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
  paymentIntentId: string | null;
  totalPrice: number;
};

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private authHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private async ensureSuccess(response: Awaited<ReturnType<APIRequestContext['get']>>, action: string) {
    if (!response.ok()) {
      throw new Error(`${action} failed with ${response.status()}: ${await response.text()}`);
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post('/api/auth/login', {
      data: { username, password },
    });

    await this.ensureSuccess(response, 'API login');
    return response.json();
  }

  async getProducts(token: string): Promise<Product[]> {
    const response = await this.request.get('/api/products', {
      headers: this.authHeaders(token),
    });

    await this.ensureSuccess(response, 'Get products');
    return response.json();
  }

  async getProductByName(token: string, productName: string): Promise<Product> {
    const products = await this.getProducts(token);
    const product = products.find((item) => item.name === productName);

    if (!product) {
      throw new Error(`Product not found: ${productName}`);
    }

    return product;
  }

  async setCart(token: string, items: CartItem[]): Promise<void> {
    const response = await this.request.put('/api/cart', {
      headers: this.authHeaders(token),
      data: { items },
    });

    await this.ensureSuccess(response, 'Update cart');
  }

  async clearCart(token: string): Promise<void> {
    await this.setCart(token, []);
  }

  async createOrder(token: string, order: CreateOrderInput): Promise<Order> {
    const response = await this.request.post('/api/orders', {
      headers: this.authHeaders(token),
      data: order,
    });

    await this.ensureSuccess(response, 'Create order');
    return response.json();
  }

  async deleteOrder(token: string, orderId: string): Promise<void> {
    const response = await this.request.delete(`/api/orders/${orderId}`, {
      headers: this.authHeaders(token),
    });

    if (response.status() !== 404) {
      await this.ensureSuccess(response, 'Delete order');
    }
  }

  async getProfile(token: string): Promise<Profile> {
    const response = await this.request.get('/api/profile', {
      headers: this.authHeaders(token),
    });

    await this.ensureSuccess(response, 'Get profile');
    return response.json();
  }

  async updateProfileName(token: string, name: string): Promise<Profile> {
    const response = await this.request.patch('/api/profile', {
      headers: this.authHeaders(token),
      multipart: { name },
    });

    await this.ensureSuccess(response, 'Update profile');
    return response.json();
  }
}
