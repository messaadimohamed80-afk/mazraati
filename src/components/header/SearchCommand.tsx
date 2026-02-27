"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Expense, Category, Crop, Task, Animal, InventoryItem } from "@/lib/types";
import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { getCrops, getTasks } from "@/lib/actions/crops";
import { getAnimals } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";

interface SearchItem {
    type: "expense" | "crop" | "task" | "animal" | "inventory";
    icon: string;
    label: string;
    sub: string;
    href: string;
}

function buildSearchIndex(
    expenses: Expense[], categories: Category[], crops: Crop[],
    tasks: Task[], animals: Animal[], inventory: InventoryItem[],
): SearchItem[] {
    const items: SearchItem[] = [];
    expenses.forEach((e) => {
        const cat = categories.find((c) => c.id === e.category_id);
        items.push({ type: "expense", icon: "💰", label: e.description, sub: cat?.name || "", href: "/expenses" });
    });
    crops.forEach((c) => {
        items.push({ type: "crop", icon: "🌾", label: `${c.crop_type} — ${c.variety || ""}`, sub: c.field_name || "", href: `/crops/${c.id}` });
    });
    tasks.forEach((t) => {
        items.push({ type: "task", icon: "✅", label: t.title, sub: t.assigned_to || "", href: "/tasks" });
    });
    animals.forEach((a) => {
        items.push({ type: "animal", icon: "🐑", label: `${a.tag_number} — ${a.name}`, sub: a.breed, href: "/livestock" });
    });
    inventory.forEach((i) => {
        items.push({ type: "inventory", icon: "📦", label: i.name, sub: i.location, href: "/inventory" });
    });
    return items;
}

export default function SearchCommand({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const dataLoadedRef = useRef(false);

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [crops, setCrops] = useState<Crop[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    const loadData = useCallback(() => {
        if (dataLoadedRef.current) return;
        dataLoadedRef.current = true;
        Promise.all([
            getExpenses().then((res) => { if (res.ok) setExpenses(res.data); }).catch(() => { }),
            getCategories().then((res) => { if (res.ok) setCategories(res.data); }).catch(() => { }),
            getCrops().then((res) => { if (res.ok) setCrops(res.data); }).catch(() => { }),
            getTasks().then((res) => { if (res.ok) setTasks(res.data); }).catch(() => { }),
            getAnimals().then((res) => { if (res.ok) setAnimals(res.data); }).catch(() => { }),
            getInventory().then((res) => { if (res.ok) setInventory(res.data); }).catch(() => { }),
        ]);
    }, []);

    // Focus on open — no setState, just DOM interaction + data trigger
    useEffect(() => {
        if (open) {
            loadData();
            // Use requestAnimationFrame to defer focus after render
            requestAnimationFrame(() => {
                searchRef.current?.focus();
            });
        }
    }, [open, loadData]);

    const allItems = useMemo(
        () => buildSearchIndex(expenses, categories, crops, tasks, animals, inventory),
        [expenses, categories, crops, tasks, animals, inventory]
    );

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return allItems.filter((item) =>
            item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
        ).slice(0, 8);
    }, [searchQuery, allItems]);

    if (!open) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="search-modal-input-row">
                    <span className="search-modal-icon">🔍</span>
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="ابحث عن مصروف، محصول، حيوان، مهمة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-modal-input"
                        autoFocus
                        aria-label="البحث في المزرعة"
                    />
                    <kbd className="search-modal-esc" onClick={onClose}>Esc</kbd>
                </div>
                {searchQuery.trim() && (
                    <div className="search-modal-results">
                        {searchResults.length === 0 ? (
                            <div className="search-modal-empty">لا توجد نتائج لـ &quot;{searchQuery}&quot;</div>
                        ) : (
                            searchResults.map((item, i) => (
                                <button
                                    key={`${item.type}-${i}`}
                                    className="search-modal-result"
                                    onClick={() => { router.push(item.href); onClose(); setSearchQuery(""); }}
                                >
                                    <span className="search-result-icon">{item.icon}</span>
                                    <div className="search-result-info">
                                        <span className="search-result-label">{item.label}</span>
                                        <span className="search-result-sub">{item.sub}</span>
                                    </div>
                                    <span className="search-result-arrow">←</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
