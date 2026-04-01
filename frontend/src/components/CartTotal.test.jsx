import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShopContext } from "../context/ShopContext";
import "@testing-library/jest-dom/vitest";
import CartTotal from "./CartTotal";

test("renders cart totals with correct math", () => {
  // 1. Setup mock data
  const mockContextValue = {
    currency: "$",
    delivery_fee: 10,
    getCartAmount: () => 100, // Subtotal is 100
  };

  // 2. Render with the Provider
  render(
    <ShopContext.Provider value={mockContextValue}>
      <CartTotal />
    </ShopContext.Provider>
  );

  // 3. Assertions
  // Check Subtotal
  expect(screen.getByText(/\$ 100.00/i)).toBeInTheDocument();
  
  // Check Shipping Fee
  expect(screen.getByText(/\$ 10.00/i)).toBeInTheDocument();
  
  // Check Total (100 + 10 = 110)
  // We use a regex to find the bold total
  expect(screen.getByText(/\$ 110/i)).toBeInTheDocument();
});

test("displays 0 total when cart is empty", () => {
  const mockContextValue = {
    currency: "$",
    delivery_fee: 10,
    getCartAmount: () => 0, // Empty cart
  };

  render(
    <ShopContext.Provider value={mockContextValue}>
      <CartTotal />
    </ShopContext.Provider>
  );

  // According to your logic: getCartAmount() === 0 ? 0 : ...
  // So the total should be 0, not 10.
  expect(screen.getByText("$ 0")).toBeInTheDocument();
});