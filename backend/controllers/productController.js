import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js"; 

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
      // Custom string ID preserved cleanly for ecosystem matching
      _id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, 
      name,
      description,
      category,
      price: Number(price), // Numeric Base value stored seamlessly for ₮ currency calculations
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    await productModel.create(productData);
    res.json({ success: true, message: "Бүтээгдэхүүн амжилттай нэмэгдлээ" }); // Localized notification message

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= LIST PRODUCTS =================
const listProducts = async (req, res) => {
  try {
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
    const { id } = req.body;
    // Uses deleteOne to safely capture custom string IDs without triggering ObjectId cast errors
    await productModel.deleteOne({ _id: id });
    res.json({ success: true, message: "Бүтээгдэхүүн устгагдлаа" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= SINGLE PRODUCT =================
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    // Explicit query matching for custom string token structures
    const product = await productModel.findOne({ _id: productId });
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

    // Atomically updates documentation fields via direct query filtering
    await productModel.findOneAndUpdate({ _id: id }, { $set: updateData });

    res.json({ success: true, message: "Бүтээгдэхүүний мэдээлэл амжилттай шинэчлэгдлээ" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };