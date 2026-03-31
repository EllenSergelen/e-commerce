import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // ================= ADD TO CART =================
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // 1. Update Local State (UI)
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId]) {
        updatedCart[itemId] = { ...updatedCart[itemId] };
        updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
      } else {
        updatedCart[itemId] = { [size]: 1 };
      }
      return updatedCart;
    });

    toast.success("Added to cart!");

    // 2. Sync with Backend
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error(error.message);
      }
    }
  };

  // ================= CART LOGIC =================
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        totalAmount += itemInfo.price * cartItems[items][item];
      }
    }
    return totalAmount;
  };

  // ================= API CALLS =================
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
      if (response.data && response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!token && localToken) {
      setToken(localToken);
      getUserCart(localToken);
    }
  }, []);

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, getCartCount,
    updateQuantity, getCartAmount,
    navigate, backendUrl, setToken, token, setCartItems
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;