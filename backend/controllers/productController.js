import { v2 as cloudinary } from "cloudinary";
import { productCollection } from "../config/astra.js";

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

    await productCollection.insertOne(productData);
    res.json({ success: true, message: "Product Added Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= LIST PRODUCTS =================
const listProducts = async (req, res) => {
  try {
    const products = await productCollection.find({}).toArray();
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= REMOVE PRODUCT =================
const removeProduct = async (req, res) => {
  try {
    await productCollection.deleteOne({ _id: req.body.id });
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
    const product = await productCollection.findOne({ _id: productId });
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

        await productCollection.updateOne(
            { _id: id },
            { $set: updateData }
        );

        res.json({ success: true, message: "Product Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };