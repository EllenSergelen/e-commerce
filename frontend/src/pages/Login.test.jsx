import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Login from "./Login";

// 1. Mock Axios
vi.mock("axios");

test("successful login updates token and localStorage", async () => {
    const mockSetToken = vi.fn();
    const mockNavigate = vi.fn();
    const mockBackendUrl = "http://localhost:4000";

    // Mock successful API response
    axios.post.mockResolvedValue({
        data: { success: true, token: "fake-jwt-token" }
    });

    // Mock localStorage
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
        <MemoryRouter>
            <ShopContext.Provider value={{ 
                setToken: mockSetToken, 
                navigate: mockNavigate, 
                backendUrl: mockBackendUrl,
                token: null 
            }}>
                <Login />
            </ShopContext.Provider>
        </MemoryRouter>
    );

    // 2. Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password123" } });

    // 3. Submit
    const loginBtn = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(loginBtn);

    // 4. Assertions
    await waitFor(() => {
        // Verify API was called with correct data
        expect(axios.post).toHaveBeenCalledWith(
            `${mockBackendUrl}/api/user/login`,
            { email: "test@example.com", password: "password123" }
        );
        
        // Verify context and localStorage were updated
        expect(mockSetToken).toHaveBeenCalledWith("fake-jwt-token");
        expect(setItemSpy).toHaveBeenCalledWith("token", "fake-jwt-token");
    });
});