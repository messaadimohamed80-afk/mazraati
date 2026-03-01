import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ClientEnergy from "../ClientEnergy";
import type { SolarPanel, ElectricityMeter, Generator } from "@/lib/types";

/* ---- Mocks ---- */
vi.mock("@/hooks/useEnergy", () => ({
    useEnergy: (solar: SolarPanel[], meters: ElectricityMeter[], generators: Generator[]) => ({
        solarPanels: solar, meters, generators, isLoading: false,
        createSolarPanel: vi.fn(), isCreatingSolar: false,
        createElectricityMeter: vi.fn(), isCreatingMeter: false,
        createGenerator: vi.fn(), isCreatingGenerator: false,
    }),
}));

vi.mock("../components/SolarTab", () => ({
    SolarTab: ({ solar }: { solar: SolarPanel[] }) => (
        <div data-testid="solar-tab">{solar.map(s => <div key={s.id}>{s.name}</div>)}</div>
    ),
}));

vi.mock("../components/ElectricityTab", () => ({
    ElectricityTab: ({ electricity }: { electricity: ElectricityMeter[] }) => (
        <div data-testid="electricity-tab">{electricity.map(e => <div key={e.id}>{e.name}</div>)}</div>
    ),
}));

vi.mock("../components/GeneratorsTab", () => ({
    GeneratorsTab: ({ generators }: { generators: Generator[] }) => (
        <div data-testid="generators-tab">{generators.map(g => <div key={g.id}>{g.name}</div>)}</div>
    ),
}));

vi.mock("@/lib/utils", () => ({
    formatCurrency: (amount: number) => `${amount} د.ت`,
}));

/* ---- Test data ---- */
const MOCK_SOLAR: SolarPanel[] = [
    {
        id: "00000000-0000-4000-8000-00000000f001", farm_id: "f1",
        name: "المنظومة الشمسية", capacity_kw: 5.5, panel_count: 12,
        daily_production_kwh: 22, efficiency_percent: 82,
        installation_date: "2024-08-15", inverter_type: "Huawei",
        status: "active", total_cost: 8500, created_at: "2024-08-15T10:00:00Z",
    },
];

const MOCK_METERS: ElectricityMeter[] = [
    {
        id: "00000000-0000-4000-8000-00000000f101", farm_id: "f1",
        name: "العداد الرئيسي", meter_number: "TN-2024-889145",
        provider: "الستاغ", monthly_consumption_kwh: 450, monthly_cost: 85,
        currency: "TND", tariff_type: "agricultural", status: "active",
        last_reading_date: "2025-02-01", created_at: "2024-01-01T10:00:00Z",
    },
];

const MOCK_GENERATORS: Generator[] = [
    {
        id: "00000000-0000-4000-8000-00000000f201", farm_id: "f1",
        name: "المولد الرئيسي", fuel_type: "diesel", capacity_kva: 15,
        runtime_hours: 1240, fuel_consumption_lph: 3.5,
        last_maintenance: "2025-01-20", next_maintenance_hours: 1500,
        status: "standby", total_cost: 4800, created_at: "2024-03-10T10:00:00Z",
    },
];

describe("ClientEnergy", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders page title and stats", () => {
        render(
            <ClientEnergy
                initialSolar={MOCK_SOLAR}
                initialElectricity={MOCK_METERS}
                initialGenerators={MOCK_GENERATORS}
            />
        );

        expect(screen.getByText("⚡ إدارة الطاقة")).toBeInTheDocument();
    });

    it("renders tab navigation with correct labels", () => {
        render(
            <ClientEnergy
                initialSolar={MOCK_SOLAR}
                initialElectricity={MOCK_METERS}
                initialGenerators={MOCK_GENERATORS}
            />
        );

        expect(screen.getByText("الطاقة الشمسية")).toBeInTheDocument();
        expect(screen.getByText("الكهرباء")).toBeInTheDocument();
        expect(screen.getByText("المولدات")).toBeInTheDocument();
    });

    it("shows solar tab by default", () => {
        render(
            <ClientEnergy
                initialSolar={MOCK_SOLAR}
                initialElectricity={MOCK_METERS}
                initialGenerators={MOCK_GENERATORS}
            />
        );

        expect(screen.getByTestId("solar-tab")).toBeInTheDocument();
        expect(screen.queryByTestId("electricity-tab")).not.toBeInTheDocument();
    });

    it("switches to electricity tab on click", () => {
        render(
            <ClientEnergy
                initialSolar={MOCK_SOLAR}
                initialElectricity={MOCK_METERS}
                initialGenerators={MOCK_GENERATORS}
            />
        );

        fireEvent.click(screen.getByText("الكهرباء"));

        expect(screen.getByTestId("electricity-tab")).toBeInTheDocument();
        expect(screen.queryByTestId("solar-tab")).not.toBeInTheDocument();
    });

    it("switches to generators tab on click", () => {
        render(
            <ClientEnergy
                initialSolar={MOCK_SOLAR}
                initialElectricity={MOCK_METERS}
                initialGenerators={MOCK_GENERATORS}
            />
        );

        fireEvent.click(screen.getByText("المولدات"));

        expect(screen.getByTestId("generators-tab")).toBeInTheDocument();
        expect(screen.queryByTestId("solar-tab")).not.toBeInTheDocument();
    });

    it("renders with empty data without crashing", () => {
        render(
            <ClientEnergy
                initialSolar={[]}
                initialElectricity={[]}
                initialGenerators={[]}
            />
        );

        expect(screen.getByText("⚡ إدارة الطاقة")).toBeInTheDocument();
    });
});
