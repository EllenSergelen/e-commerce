import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Orders from "./Orders";
import "@testing-library/jest-dom/vitest";

// 1. Mock Axios
vi.mock("axios");

const mockOrdersResponse = {
  data: {
    success: true,
    orders: [
      {
        _id: "order123",
        status: "Order Placed",
        paymentMethod: "COD",
        date: 1711972800000, // April 1, 2024
        items: [
          {
            name: "Casual T-Shirt",
            price: 25,
            quantity: 1,
            size: "M",
            image: ["img1.jpg"]
          },
          {
            name: "Slim Fit Jeans",
            price: 50,
            quantity: 2,
            size: "L",
            image: ["img2.jpg"]
          }
        ]
      }
    ]
  }
};

const mockContext = {
  backendUrl: "http://localhost:4000",
  token: "fake-token",
  currency: "$"
};

beforeEach(() => {
  vi.clearAllMocks();
});

test("fetches and flattens order items for display", async () => {
  // Mock the API call
  axios.post.mockResolvedValue(mockOrdersResponse);

  render(
    <MemoryRouter>
      <ShopContext.Provider value={mockContext}>
        <Orders />
      </ShopContext.Provider>
    </MemoryRouter>
  );

  // 1. Verify API Call
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/order/userorders"),
      {},
      { headers: { token: "fake-token" } }
    );
  });

  // 2. Verify Flattening (1 Order with 2 Items = 2 Rows)
  // We check for product names
  expect(await screen.findByText("Casual T-Shirt")).toBeInTheDocument();
  expect(screen.getByText("Slim Fit Jeans")).toBeInTheDocument();

  // 3. Verify Data Mapping (Price and Currency)
  const prices = screen.getAllByText(/\$25|\$50/);
  expect(prices).toHaveLength(2);

  // 4. Verify Status and Date Formatting
  const statuses = screen.getAllByText("Order Placed");
  expect(statuses).toHaveLength(2); // Both items should show the parent order status

  // Check if date is formatted correctly (April 1 2024 is Mon Apr 01 2024)
  expect(screen.getAllByText(/Mon Apr 01 2024/i)).toHaveLength(2);
});

test("does not fetch orders if token is missing", async () => {
  render(
    <MemoryRouter>
      <ShopContext.Provider value={{ ...mockContext, token: null }}>
        <Orders />
      </ShopContext.Provider>
    </MemoryRouter>
  );

  expect(axios.post).not.toHaveBeenCalled();
});