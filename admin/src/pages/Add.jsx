import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token, selectedProduct, isEdit, setShowEditModal, fetchList }) => {

  // Images state
  const [images, setImages] = useState([null, null, null, null]);
  
  // Product data states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // 1. Fill data if in Edit Mode
  useEffect(() => {
    if (isEdit && selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setPrice(selectedProduct.price);
      setCategory(selectedProduct.category);
      setSubCategory(selectedProduct.subCategory);
      setBestseller(selectedProduct.bestseller);
      setSizes(selectedProduct.sizes);
      // Note: We don't set 'images' state with URLs because 
      // URL.createObjectURL only works on File objects.
    }
  }, [isEdit, selectedProduct]);

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      // 2. Logic for adding/editing ID
      if (isEdit) {
        formData.append("id", selectedProduct._id);
      }

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      // 3. Dynamic API endpoint
      const endpoint = isEdit ? "/api/product/edit" : "/api/product/add";
      const response = await axios.post(backendUrl + endpoint, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        
        if (isEdit) {
            // Close modal and refresh list if editing
            setShowEditModal(false);
            fetchList();
        } else {
            // Clear form if adding new
            setName("");
            setDescription("");
            setPrice("");
            setSizes([]);
            setImages([null, null, null, null]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4 p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h2>
      
      {/* Image Upload */}
      <div>
        <p className="mb-2 font-medium">Upload New Images {isEdit && "(Optional)"}</p>
        <div className="flex gap-3">
          {images.map((img, index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img
                className="w-20 h-20 object-cover border cursor-pointer"
                src={img ? URL.createObjectURL(img) : (isEdit && selectedProduct.image[index] ? selectedProduct.image[index] : assets.upload_area)}
                alt=""
              />
              <input type="file" id={`image${index}`} hidden onChange={(e) => handleImageChange(index, e.target.files[0])} />
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full max-w-[500px] px-3 py-2 border" type="text" required />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full max-w-[500px] px-3 py-2 border" required />
      </div>

      {/* Category/Price Row */}
      <div className="flex gap-6 flex-wrap">
        <div>
          <p className="mb-2">Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="px-3 py-2 border">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Price</p>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="px-3 py-2 border" type="number" required />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <p key={size} onClick={() => toggleSize(size)} className={`px-3 py-1 cursor-pointer rounded ${sizes.includes(size) ? "bg-violet-700 text-white" : "bg-slate-200"}`}>
              {size}
            </p>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input id="bestseller" type="checkbox" checked={bestSeller} onChange={() => setBestseller((prev) => !prev)} />
        <label htmlFor="bestseller" className="cursor-pointer">Add to bestseller</label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button type="submit" className="w-32 py-3 bg-violet-700 text-white rounded-lg">
          {isEdit ? "UPDATE" : "ADD"}
        </button>
        
        {isEdit && (
            <button type="button" onClick={() => setShowEditModal(false)} className="w-32 py-3 bg-gray-500 text-white rounded-lg">
                CANCEL
            </button>
        )}
      </div>
    </form>
  );
};

export default Add;