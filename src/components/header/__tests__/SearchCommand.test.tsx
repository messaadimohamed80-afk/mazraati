import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import SearchCommand from "../SearchCommand";

// Mock next/navigation
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}));

// Mock all action modules to prevent server-side imports
vi.mock("@/lib/actions/expenses", () => ({
    getExpenses: vi.fn().mockResolvedValue({ ok: true, data: [] }),
    getCategories: vi.fn().mockResolvedValue({ ok: true, data: [] }),
}));
vi.mock("@/lib/actions/crops", () => ({
    getCrops: vi.fn().mockResolvedValue({ ok: true, data: [] }),
    getTasks: vi.fn().mockResolvedValue({ ok: true, data: [] }),
}));
vi.mock("@/lib/actions/livestock", () => ({
    getAnimals: vi.fn().mockResolvedValue({ ok: true, data: [] }),
}));
vi.mock("@/lib/actions/inventory", () => ({
    getInventory: vi.fn().mockResolvedValue({ ok: true, data: [] }),
}));

describe("SearchCommand", () => {
    const mockClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders nothing when closed", () => {
        const { container } = render(<SearchCommand open={false} onClose={mockClose} />);
        expect(container.innerHTML).toBe("");
    });

    it("renders dialog with correct ARIA attributes when open", () => {
        render(<SearchCommand open={true} onClose={mockClose} />);

        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAttribute("aria-label", "البحث في المزرعة");
    });

    it("renders search input when open", () => {
        render(<SearchCommand open={true} onClose={mockClose} />);

        const input = screen.getByPlaceholderText("ابحث عن مصروف، محصول، حيوان، مهمة...");
        expect(input).toBeInTheDocument();
    });

    it("calls onClose when Escape is pressed", () => {
        render(<SearchCommand open={true} onClose={mockClose} />);

        fireEvent.keyDown(window, { key: "Escape" });
        expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when overlay is clicked", () => {
        render(<SearchCommand open={true} onClose={mockClose} />);

        const dialog = screen.getByRole("dialog");
        fireEvent.click(dialog);
        expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it("shows empty state when searching with no results", () => {
        render(<SearchCommand open={true} onClose={mockClose} />);

        const input = screen.getByPlaceholderText("ابحث عن مصروف، محصول، حيوان، مهمة...");
        fireEvent.change(input, { target: { value: "xxxxxx" } });

        expect(screen.getByText(/لا توجد نتائج/)).toBeInTheDocument();
    });
});
