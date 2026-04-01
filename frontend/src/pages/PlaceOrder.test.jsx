import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "@testing-library/jest-dom/vitest";
import PlaceOrder from "./PlaceOrder";

vi.mock("axios");

test("renders delivery information and updates payment method", () => {
    const mockContext = {
        navigate: vi.fn(),
        backendUrl: "http://localhost:4000",
        token: "mock-token",
        cartItems: {},
        getCartAmount: () => 100,
        delivery_fee: 10,
        products: []
    };

    render(
        <MemoryRouter>
            <ShopContext.Provider value={mockContext}>
                <PlaceOrder />
            </ShopContext.Provider>
        </MemoryRouter>
    );

    // 1. Verify Title Renders (using your excellent matcher function)
    expect(screen.getByText((content, element) => {
        const hasText = (node) => node.textContent.replace(/\s+/g, ' ').trim() === "DELIVERY INFORMATION";
        return hasText(element) && Array.from(element.children).every(child => !hasText(child));
    })).toBeInTheDocument();

    // 2. Test Form Input
    const firstNameInput = screen.getByPlaceholderText(/First name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');

    // 3. Test Payment Method Selection (Stripe)
    // We find the Stripe logo specifically by its src path to avoid the "multiple alt" error
    const allImages = document.querySelectorAll('img');
    const stripeImg = Array.from(allImages).find(img => img.src.includes('stripe_logo'));

    // If for some reason the image isn't found, this will provide a helpful error
    if (!stripeImg) throw new Error("Could not find Stripe logo image");

    const stripeDiv = stripeImg.closest('.cursor-pointer');
    fireEvent.click(stripeDiv);

    // Find the radio-style circle inside the clicked div
    const stripeRadio = stripeDiv.querySelector('.rounded-full');
    expect(stripeRadio).toHaveClass('bg-violet-700');
});