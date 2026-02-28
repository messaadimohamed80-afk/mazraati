import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ClientCrops from "../ClientCrops";
import type { Crop } from "@/lib/types";

// Mock the useCrops hook
const mockCreateCrop = vi.fn();
const mockUpdateCrop = vi.fn();

vi.mock("@/hooks/useCrops", () => ({
    useCrops: (initialData: Crop[]) => ({
        crops: initialData,
        isLoading: false,
        createCrop: mockCreateCrop,
        isCreating: false,
        updateCrop: mockUpdateCrop,
        isUpdating: false,
    }),
}));

// Mock CropModal
vi.mock("@/components/CropModal", () => ({
    default: ({ onClose, onSave }: { onClose: () => void; onSave: (d: Record<string, string>) => void }) => (
        <div data-testid="crop-modal">
            <button onClick={onClose}>إغلاق</button>
            <button onClick={() => onSave({ crop_type: "طماطم", status: "planned" })}>حفظ</button>
        </div>
    ),
}));

// Mock next/link
vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string; className?: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

// Mock crops-tasks-data helpers
vi.mock("@/lib/mock/mock-crops-tasks-data", () => ({
    CROP_STATUS_MAP: {
        planned: { label: "مخطط", icon: "📋", color: "#3b82f6" },
        planted: { label: "مزروع", icon: "🌱", color: "#10b981" },
        growing: { label: "ينمو", icon: "🌿", color: "#22c55e" },
        harvested: { label: "تم الحصاد", icon: "🌾", color: "#f59e0b" },
    },
    getCropIcon: () => "🌾",
    getCropColor: () => "#10b981",
    getDaysUntil: () => 30,
}));

const MOCK_CROPS: Crop[] = [
    {
        id: "crop-1",
        farm_id: "f1",
        crop_type: "زيتون",
        variety: "شملالي",
        field_name: "القطعة A",
        area_hectares: 2.5,
        status: "growing",
        planting_date: "2024-11-01",
        expected_harvest: "2025-06-01",
        created_at: "2024-11-01T10:00:00Z",
    },
    {
        id: "crop-2",
        farm_id: "f1",
        crop_type: "قمح",
        field_name: "القطعة B",
        area_hectares: 1.0,
        status: "planted",
        planting_date: "2025-01-10",
        created_at: "2025-01-10T10:00:00Z",
    },
    {
        id: "crop-3",
        farm_id: "f1",
        crop_type: "طماطم",
        status: "harvested",
        yield_kg: 5000,
        area_hectares: 0.5,
        created_at: "2024-06-01T10:00:00Z",
    },
];

describe("ClientCrops", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders crop cards from initial data", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        expect(screen.getByText("زيتون")).toBeInTheDocument();
        expect(screen.getByText("قمح")).toBeInTheDocument();
        expect(screen.getByText("طماطم")).toBeInTheDocument();
    });

    it("renders stats (active crops count, total area)", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        // Active = growing + planted = 2 (appears in stat card)
        expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
        // Total area = 2.5 + 1.0 + 0.5 = 4 (appears in stat area)
        expect(screen.getAllByText(/4/).length).toBeGreaterThanOrEqual(1);
    });

    it("filters crops by status", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        // Click the "harvested" filter — find the button specifically
        const harvestedBtns = screen.getAllByText(/تم الحصاد/);
        const filterBtn = harvestedBtns.find(el => el.closest(".crops-filter-btn"));
        fireEvent.click(filterBtn!);

        // Only طماطم should be visible
        expect(screen.getByText("طماطم")).toBeInTheDocument();
        expect(screen.queryByText("زيتون")).not.toBeInTheDocument();
    });

    it("filters crops by search text", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        const searchInput = screen.getByPlaceholderText("ابحث عن محصول...");
        fireEvent.change(searchInput, { target: { value: "زيتون" } });

        expect(screen.getByText("زيتون")).toBeInTheDocument();
        expect(screen.queryByText("قمح")).not.toBeInTheDocument();
    });

    it("shows empty state when no crops match", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        const searchInput = screen.getByPlaceholderText("ابحث عن محصول...");
        fireEvent.change(searchInput, { target: { value: "xxx" } });

        expect(screen.getByText("لا توجد محاصيل مطابقة")).toBeInTheDocument();
    });

    it("opens add crop modal", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        fireEvent.click(screen.getByText("+ إضافة محصول"));
        expect(screen.getByTestId("crop-modal")).toBeInTheDocument();
    });

    it("calls createCrop when saving from modal", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        fireEvent.click(screen.getByText("+ إضافة محصول"));
        fireEvent.click(screen.getByText("حفظ"));

        expect(mockCreateCrop).toHaveBeenCalledTimes(1);
        expect(mockCreateCrop).toHaveBeenCalledWith(
            expect.objectContaining({ crop_type: "طماطم" })
        );
    });

    it("shows variety when provided", () => {
        render(<ClientCrops initialCrops={MOCK_CROPS} serverNow={Date.now()} />);

        expect(screen.getByText("شملالي")).toBeInTheDocument();
    });
});
