import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "@testing-library/jest-dom/vitest";
import Cart from "./Cart";

// Mock assets to avoid path errors
vi.mock("../assets/assets", () => ({
    assets: { bin_icon: "bin.png" }
}));

const mockProducts = [
    {
        _id: "p1",
        name: "Cotton Jacket",
        price: 100,
        image: ["jacket.jpg"],
    }
];

const mockCartItems = {
    p1: {
        M: 2
    }
};

const mockContext = {
    products: mockProducts,
    currency: "$",
    cartItems: mockCartItems,
    delivery_fee: 10, // Added this for CartTotal
    updateQuantity: vi.fn(),
    navigate: vi.fn(),
    getCartAmount: vi.fn(() => 200) // Added this to prevent the crash
};

test("renders cart items and handles quantity updates", () => {
    render(
        <MemoryRouter>
            <ShopContext.Provider value={mockContext}>
                <Cart />
            </ShopContext.Provider>
        </MemoryRouter>
    );

    // 1. Verify item renders
    expect(screen.getByText("Cotton Jacket")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();

    // 2. Test Quantity Input Change
    const qtyInput = screen.getByRole("spinbutton");
    fireEvent.change(qtyInput, { target: { value: "5" } });

    expect(mockContext.updateQuantity).toHaveBeenCalledWith("p1", "M", 5);

    // 3. Test Delete (Bin Icon)
    // Since the image has alt="", it's a 'presentation' role or find by the mock src
    const allImages = screen.getAllByRole("presentation", { includeHiddenElements: true });
    const binIcon = allImages.find(img => img.src.includes("bin.png"));

    fireEvent.click(binIcon);

    expect(mockContext.updateQuantity).toHaveBeenCalledWith("p1", "M", 0);
});

test("navigates to place-order when checkout is clicked", () => {
    render(
        <MemoryRouter>
            <ShopContext.Provider value={mockContext}>
                <Cart />
            </ShopContext.Provider>
        </MemoryRouter>
    );

    const checkoutBtn = screen.getByRole("button", { name: /PROCEED TO CHECKOUT/i });
    fireEvent.click(checkoutBtn);

    expect(mockContext.navigate).toHaveBeenCalledWith("/place-order");
});