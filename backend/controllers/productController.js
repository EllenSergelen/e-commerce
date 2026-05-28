import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js"; // ✨ Swapped Astra with your Mongoose Product Model

// ================= ADD PRODUCT =================
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      // Custom string ID preserved for backward compatibility
      _id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, 
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

    // ✨ Saved to MongoDB using Mongoose model structure
    await productModel.create(productData);
    res.json({ success: true, message: "Product Added Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= LIST PRODUCTS =================
const listProducts = async (req, res) => {
  try {
    // ✨ Fetch all records cleanly via standard find query
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= REMOVE PRODUCT =================
const removeProduct = async (req, res) => {
  try {
    // ✨ Native Mongoose deletion targeting custom string ID
    await productModel.findByIdAndDelete(req.body.id);
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
    // ✨ Target unique matching document
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= UPDATE PRODUCT =================
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const updateData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes)
        };

        const imageFiles = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0],
        ].filter(Boolean);

        if (imageFiles.length > 0) {
            const newImagesUrl = await Promise.all(
                imageFiles.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                })
            );
            updateData.image = newImagesUrl;
        }

        // ✨ Atomically update the product fields using findByIdAndUpdate
        await productModel.findByIdAndUpdate(id, { $set: updateData });

        res.json({ success: true, message: "Product Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };