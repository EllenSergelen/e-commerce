import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "@testing-library/jest-dom/vitest";
import SearchBar from "./SearchBar";

test("does not render SearchBar on home page", () => {
  const mockContext = { showSearch: true, search: "", setSearch: vi.fn() };

  render(
    <MemoryRouter initialEntries={['/']}>
      <ShopContext.Provider value={mockContext}>
        <SearchBar />
      </ShopContext.Provider>
    </MemoryRouter>
  );

  // queryBy returns null if not found (getBy would throw an error)
  expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
});

test("renders SearchBar on collection page when showSearch is true", () => {
  const mockContext = { 
    showSearch: true, 
    search: "", 
    setSearch: vi.fn(), 
    setShowSearch: vi.fn() 
  };

  render(
    <MemoryRouter initialEntries={['/collection']}>
      <ShopContext.Provider value={mockContext}>
        <SearchBar />
      </ShopContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
});

test("updates search value on input change", () => {
  const mockSetSearch = vi.fn();
  const mockContext = { 
    showSearch: true, 
    search: "", 
    setSearch: mockSetSearch, 
    setShowSearch: vi.fn() 
  };

  render(
    <MemoryRouter initialEntries={['/collection']}>
      <ShopContext.Provider value={mockContext}>
        <SearchBar />
      </ShopContext.Provider>
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'blue shirt' } });

  expect(mockSetSearch).toHaveBeenCalledWith('blue shirt');
});