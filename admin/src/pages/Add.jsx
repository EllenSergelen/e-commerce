import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {

  // Images (cleaner than 4 separate states)
  const [images, setImages] = useState([null, null, null, null]);

  // Product data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Handle image change
  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  // Toggle sizes
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  // Submit form
const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory); // ✅ fixed
    formData.append("bestseller", bestSeller); // ✅ fixed
    formData.append("sizes", JSON.stringify(sizes));

    images.forEach((img, i) => {
      if (img) formData.append(`image${i + 1}`, img);
    });

    const response = await axios.post(
      backendUrl + "/api/product/add",
      formData,
      { headers: { token } }
    );

    if (response.data.success) {
      toast.success(response.data.message);

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Men");
      setSubCategory("Topwear");
      setBestseller(false);
      setSizes([]);
      setImages([null, null, null, null]);

    } else {
      toast.error(response.data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-4"
    >
      {/* Image Upload */}
      <div>
        <p className="mb-2 font-medium">Upload Images</p>

        <div className="flex gap-3">
          {images.map((img, index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img
                className="w-20 h-20 object-cover border cursor-pointer"
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt=""
              />
              <input
                type="file"
                id={`image${index}`}
                hidden
                onChange={(e) =>
                  handleImageChange(index, e.target.files[0])
                }
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          placeholder="Type here"
          required
        />
      </div>

      {/* Category + Subcategory + Price */}
      <div className="flex gap-6 flex-wrap">

        <div>
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="px-3 py-2 border"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-3 py-2 border"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2">Product Sizes</p>

        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <p
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 cursor-pointer rounded ${
                sizes.includes(size)
                  ? "bg-violet-700 text-white"
                  : "bg-slate-200"
              }`}
            >
              {size}
            </p>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          id="bestseller"
          type="checkbox"
          checked={bestSeller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-violet-700 text-white rounded-lg"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;