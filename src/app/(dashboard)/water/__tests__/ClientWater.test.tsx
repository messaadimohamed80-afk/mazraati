import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ClientWater from "../ClientWater";
import type { Well, WaterTank, IrrigationNetwork } from "@/lib/types";

/* ---- Mocks ---- */
vi.mock("@/hooks/useWater", () => ({
    useWater: (wells: Well[], tanks: WaterTank[], irrigation: IrrigationNetwork[]) => ({
        wells, tanks, irrigation, isLoading: false,
        createWell: vi.fn(), isCreatingWell: false,
        createTank: vi.fn(), isCreatingTank: false,
        createIrrigation: vi.fn(), isCreatingIrrigation: false,
    }),
}));

vi.mock("../components/WellsTab", () => ({
    WellsTab: ({ wells }: { wells: Well[] }) => (
        <div data-testid="wells-tab">{wells.map(w => <div key={w.id}>{w.name}</div>)}</div>
    ),
}));

vi.mock("../components/TanksTab", () => ({
    TanksTab: ({ tanks }: { tanks: WaterTank[] }) => (
        <div data-testid="tanks-tab">{tanks.map(t => <div key={t.id}>{t.name}</div>)}</div>
    ),
}));

vi.mock("../components/IrrigationTab", () => ({
    IrrigationTab: ({ irrigation }: { irrigation: IrrigationNetwork[] }) => (
        <div data-testid="irrigation-tab">{irrigation.map(i => <div key={i.id}>{i.name}</div>)}</div>
    ),
}));

vi.mock("@/lib/utils", () => ({
    formatCurrency: (amount: number) => `${amount} د.ت`,
}));

/* ---- Test data ---- */
const MOCK_WELLS: Well[] = [
    {
        id: "00000000-0000-4000-8000-00000000e001", farm_id: "f1",
        name: "البئر الرئيسي", depth_meters: 120, water_level_meters: 40,
        water_quality: "fresh", status: "active", total_cost: 35000,
        created_at: "2025-01-01T10:00:00Z",
    },
    {
        id: "00000000-0000-4000-8000-00000000e002", farm_id: "f1",
        name: "بئر الحديقة", depth_meters: 60, water_level_meters: 20,
        water_quality: "brackish", status: "inactive", total_cost: 12000,
        created_at: "2025-01-02T10:00:00Z",
    },
];

const MOCK_TANKS: WaterTank[] = [
    {
        id: "00000000-0000-4000-8000-00000000e101", farm_id: "f1",
        name: "خزان رئيسي", type: "ground", capacity_liters: 10000,
        current_level_percent: 75, source: "البئر", status: "active",
        created_at: "2025-01-01T10:00:00Z",
    },
];

const MOCK_IRRIGATION: IrrigationNetwork[] = [
    {
        id: "00000000-0000-4000-8000-00000000e201", farm_id: "f1",
        name: "شبكة الزيتون", type: "drip", coverage_hectares: 3.5,
        source_name: "البئر", status: "active",
        created_at: "2025-01-01T10:00:00Z",
    },
];

describe("ClientWater", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders page title and stats", () => {
        render(
            <ClientWater
                initialWells={MOCK_WELLS}
                initialTanks={MOCK_TANKS}
                initialIrrigation={MOCK_IRRIGATION}
            />
        );

        expect(screen.getByText("💧 إدارة المياه")).toBeInTheDocument();
        // Total water sources = 2 wells + 1 tank = 3
        expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
        // Active wells = 1
        expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    });

    it("renders tab navigation with correct counts", () => {
        render(
            <ClientWater
                initialWells={MOCK_WELLS}
                initialTanks={MOCK_TANKS}
                initialIrrigation={MOCK_IRRIGATION}
            />
        );

        expect(screen.getByText("الآبار")).toBeInTheDocument();
        expect(screen.getByText("الصهاريج والخزانات")).toBeInTheDocument();
        expect(screen.getByText("شبكة الري")).toBeInTheDocument();
        expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1); // wells count
    });

    it("shows wells tab by default", () => {
        render(
            <ClientWater
                initialWells={MOCK_WELLS}
                initialTanks={MOCK_TANKS}
                initialIrrigation={MOCK_IRRIGATION}
            />
        );

        expect(screen.getByTestId("wells-tab")).toBeInTheDocument();
        expect(screen.queryByTestId("tanks-tab")).not.toBeInTheDocument();
    });

    it("switches to tanks tab on click", () => {
        render(
            <ClientWater
                initialWells={MOCK_WELLS}
                initialTanks={MOCK_TANKS}
                initialIrrigation={MOCK_IRRIGATION}
            />
        );

        fireEvent.click(screen.getByText("الصهاريج والخزانات"));

        expect(screen.getByTestId("tanks-tab")).toBeInTheDocument();
        expect(screen.queryByTestId("wells-tab")).not.toBeInTheDocument();
    });

    it("switches to irrigation tab on click", () => {
        render(
            <ClientWater
                initialWells={MOCK_WELLS}
                initialTanks={MOCK_TANKS}
                initialIrrigation={MOCK_IRRIGATION}
            />
        );

        fireEvent.click(screen.getByText("شبكة الري"));

        expect(screen.getByTestId("irrigation-tab")).toBeInTheDocument();
        expect(screen.queryByTestId("wells-tab")).not.toBeInTheDocument();
    });

    it("renders with empty data without crashing", () => {
        render(
            <ClientWater
                initialWells={[]}
                initialTanks={[]}
                initialIrrigation={[]}
            />
        );

        expect(screen.getByText("💧 إدارة المياه")).toBeInTheDocument();
        expect(screen.getByText("0%")).toBeInTheDocument(); // avg tank level
    });
});
