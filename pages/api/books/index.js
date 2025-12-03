// pages/api/books/index.js
export default async function handler(req, res) {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    return res.status(200).json(data.products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}
