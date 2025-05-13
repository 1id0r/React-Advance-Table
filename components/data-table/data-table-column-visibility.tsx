"use client";

import React, { useState } from "react";
import {MixerHorizontalIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {DataTableViewOptionsProps} from "@/interface/IDataTable";

export function DataTableColumnVisibility<TData>({table}: DataTableViewOptionsProps<TData>) {
    const columns = table
        .getAllColumns()
        .filter(
            (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
        );

    // Local state for visibility
    const [localVisibility, setLocalVisibility] = useState(() =>
        columns.reduce(
            (acc, col) => ({ ...acc, [col.id]: col.getIsVisible() }),
            {} as Record<string, boolean>
        )
    );
    // Track open state to sync local state
    const [open, setOpen] = useState(false);

    // Sync local state with current visibility when opening
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            setLocalVisibility(
                columns.reduce(
                    (acc, col) => ({ ...acc, [col.id]: col.getIsVisible() }),
                    {} as Record<string, boolean>
                )
            );
        }
    };

    // Handle checkbox change
    const handleCheck = (id: string, checked: boolean) => {
        setLocalVisibility((prev) => ({ ...prev, [id]: checked }));
    };

    // Confirm changes
    const handleConfirm = () => {
        columns.forEach((col) => {
            col.toggleVisibility(!!localVisibility[col.id]);
        });
        setOpen(false);
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Toggle columns"
                    variant="ghost"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex text-slate-500">
                    <MixerHorizontalIcon className="mr-2 size-4"/>
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={localVisibility[column.id]}
                        onCheckedChange={(value) => handleCheck(column.id, !!value)}
                        // Prevent dropdown from closing on click
                        onSelect={e => e.preventDefault()}
                    >
                        <span className="truncate">{String(column.columnDef.header)}</span>
                    </DropdownMenuCheckboxItem>
                ))}
                <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
