import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";


// ================= ADD PRODUCT =================
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Get uploaded images safely
    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    // Upload only existing images
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ================= LIST PRODUCTS =================
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}); // ✅ FIXED (missing await)
    res.json({ success: true, products });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ================= REMOVE PRODUCT =================
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id); // ✅ FIXED (rew → req)
    res.json({ success: true, message: "Product Removed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ================= SINGLE PRODUCT =================
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    res.json({ success: true, product });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { listProducts, addProduct, removeProduct, singleProduct };