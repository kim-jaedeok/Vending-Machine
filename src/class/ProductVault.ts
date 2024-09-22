import { Product } from "../types/product";
import autoBind from "auto-bind";

export class ProductVault {
  #items: Product[];
  #itemStock = new Map<Product["name"], number>();

  constructor(items: (Product & { stock: number })[]) {
    autoBind(this);
    this.#items = items.map(({ name, price }) => ({ name, price }) as Product);
    items.forEach(({ name, stock }) => this.#itemStock.set(name, stock));
  }

  get list() {
    return this.#items.map((item) => ({
      name: item.name,
      price: `${item.price.value}${item.price.currency}`,
      stock: this.#getStockOf(item.name),
    }));
  }

  getProductPrice(product: Product["name"]) {
    return this.#items.find((item) => item.name === product)?.price;
  }
  hasStockOf(product: Product["name"]) {
    return this.#getStockOf(product) > 0;
  }
  addItem(product: Product["name"], quantity: number) {
    if (quantity < 0) {
      throw new Error("수량은 0보다 작을 수 없습니다.");
    }

    this.#itemStock.set(product, this.#getStockOf(product) + quantity);
  }
  subtractItem(productName: Product["name"], quantity: number): Product {
    const product = this.#items.find((item) => item.name === productName);

    if (!product) {
      throw new Error("존재하지 않는 상품입니다.");
    }
    if (quantity < 0) {
      throw new Error("수량은 0보다 작을 수 없습니다.");
    }
    if (this.#getStockOf(productName) < quantity) {
      throw new Error("재고가 부족합니다.");
    }

    this.#itemStock.set(productName, this.#getStockOf(productName) - quantity);

    return {
      ...product,
      price: {
        ...product.price,
      },
    } as Product;
  }

  #getStockOf(product: Product["name"]) {
    return this.#itemStock.get(product) ?? 0;
  }
}
