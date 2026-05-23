export function mapProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    desc: row.description || "",
    price: Number(row.price),
    cost: Number(row.cost),
    stock: row.stock,
    minStock: row.min_stock,
    category: row.category,
    image: row.image_url || undefined,
  };
}

export function mapSaleItem(row) {
  return {
    productId: row.product_id ? String(row.product_id) : null,
    productName: row.product_name,
    category: row.category,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    unitCost: Number(row.unit_cost),
  };
}

export function mapSale(row, items) {
  return {
    id: String(row.id),
    date: row.sale_date,
    paymentMethod: row.payment_method,
    total: Number(row.total),
    profit: Number(row.profit),
    note: row.note || "",
    items: items.map(mapSaleItem),
  };
}

export function mapUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
  };
}
