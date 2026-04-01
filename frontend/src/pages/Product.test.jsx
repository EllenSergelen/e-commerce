import { test, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "@testing-library/jest-dom/vitest";
import Product from "./Product";

test("renders product details and handles image/size selection", async () => {
    const mockProducts = [
        {
            _id: "p1",
            name: "Casual T-Shirt",
            description: "A comfortable cotton t-shirt",
            price: 25,
            image: ["img1.jpg", "img2.jpg"],
            sizes: ["S", "M", "L"],
            category: "Men",
            subCategory: "Topwear"
        }
    ];

    const mockContext = {
        products: mockProducts,
        currency: "$",
        addToCart: vi.fn()
    };

    render(
        <MemoryRouter initialEntries={["/product/p1"]}>
            <ShopContext.Provider value={mockContext}>
                <Routes>
                    <Route path="/product/:productId" element={<Product />} />
                </Routes>
            </ShopContext.Provider>
        </MemoryRouter>
    );

    // 1. Verify Product Data Renders
    const productTitle = await screen.findByRole("heading", { level: 1, name: /Casual T-Shirt/i });
    expect(productTitle).toBeInTheDocument();

    // Find the main info section
    const mainInfoSection = productTitle.closest('div.flex-1');
    
    // Improved Price Matcher: Looks for the specific <p> tag with the price
    expect(within(mainInfoSection).getByText((content, element) => {
        const hasText = element.textContent.replace(/\s/g, '').includes("$25");
        const isParagraph = element.tagName.toLowerCase() === 'p';
        return hasText && isParagraph && element.classList.contains('text-3xl');
    })).toBeInTheDocument();

    expect(screen.getByText("A comfortable cotton t-shirt")).toBeInTheDocument();

    // 2. Test Image Switching
    // We use { queryFallbacks: true } or query by role with hidden: true 
    // because alt="" puts images in the "presentation" role.
    const allImages = screen.getAllByRole("presentation", { includeHiddenElements: true });
    
    const mainImage = allImages.find(img => img.className.includes("w-full h-auto"));
    const thumbImages = allImages.filter(img => img.className.includes('cursor-pointer'));

    // Click second thumbnail
    fireEvent.click(thumbImages[1]);
    
    // Verify the src changed
    expect(mainImage).toHaveAttribute('src', 'img2.jpg');

    // 3. Test Size Selection
    const sizeButton = screen.getByText("M");
    fireEvent.click(sizeButton);
    
    // 4. Test Add to Cart call
    const addToCartBtn = screen.getByText(/ADD TO CART/i);
    fireEvent.click(addToCartBtn);

    expect(mockContext.addToCart).toHaveBeenCalledWith("p1", "M");
});