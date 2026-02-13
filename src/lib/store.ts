import { create } from "zustand";

/* ===== Types ===== */
export interface UserProfile {
    id: string;
    full_name: string;
    phone?: string;
    avatar_url?: string;
    preferred_currency: "TND" | "DZD" | "SAR" | "EGP" | "MAD" | "USD";
}

export interface Farm {
    id: string;
    owner_id: string;
    name: string;
    location_text?: string;
    latitude?: number;
    longitude?: number;
    area_hectares?: number;
    currency: string;
    created_at: string;
}

/* ===== App Store ===== */
interface AppState {
    // User
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;

    // Active Farm
    activeFarm: Farm | null;
    setActiveFarm: (farm: Farm | null) => void;

    // Farms list
    farms: Farm[];
    setFarms: (farms: Farm[]) => void;

    // UI State
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    mobileSidebarOpen: boolean;
    setMobileSidebarOpen: (open: boolean) => void;

    // Loading states
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // User
    user: null,
    setUser: (user) => set({ user }),

    // Active Farm
    activeFarm: null,
    setActiveFarm: (activeFarm) => set({ activeFarm }),

    // Farms
    farms: [],
    setFarms: (farms) => set({ farms }),

    // UI
    sidebarCollapsed: false,
    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

    mobileSidebarOpen: false,
    setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),

    // Loading
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
}));
