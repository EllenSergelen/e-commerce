import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "@testing-library/jest-dom/vitest";
import Navbar from "./Navbar";

test("renders navbar", () => {
  // Mock the context values your Navbar destructures
  const mockContextValue = {
    setShowSearch: vi.fn(),
    getCartCount: () => 0,
    navigate: vi.fn(),
    token: "",
    setToken: vi.fn(),
    setCartItems: vi.fn()
  };

  render(
    <MemoryRouter>
      <ShopContext.Provider value={mockContextValue}>
        <Navbar />
      </ShopContext.Provider>
    </MemoryRouter>
  );

 // 1. Get all links pointing to '/'
  const allHomeLinks = screen.getAllByRole('link', { name: (content, element) => element.getAttribute('href') === '/' });

  // 2. Find the one that contains the logo image
  const logoLink = allHomeLinks.find(link => link.querySelector('img'));
  const logoImg = logoLink.querySelector('img');

  // 3. Assertions
  expect(logoImg).toBeInTheDocument();
  // Check that the source includes 'logo' (Vite hashes filenames, so we use a regex)
  expect(logoImg.src).toMatch(/logo/i);
});