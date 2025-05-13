"use client";

import {TableBody, TableCell, TableRow} from "@/components/ui/table";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {DataTableCell} from "@/components/data-table/data-table-cell";
import * as React from "react";
import {IDataTableBody} from "@/interface/IDataTable";
import {Row} from "@tanstack/table-core";
import { ChevronDown, ChevronRight } from "lucide-react";
import { flexRender } from "@tanstack/react-table";

export function DataTableBody<T>(props: IDataTableBody<T>) {
    const {table, virtualColumns, columnOrder, rowVirtualizer, virtualPaddingRight, virtualPaddingLeft} = props;
    const virtualRows = rowVirtualizer.getVirtualItems();
    const {rows} = table.getRowModel();
    return (
        <TableBody
            style={{
                display: "grid",
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
            }}>
            {virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index] as Row<T>;
                const visibleCells = row.getVisibleCells();
                const isGroupRow = row.getIsGrouped();

                return (
                    <TableRow 
                        onClick={() => {
                            if (isGroupRow) {
                                row.toggleExpanded();
                            } else if (props.onClick) {
                                props.onClick(row.original);
                            }
                        }} 
                        key={row.id}
                        className={`${isGroupRow ? 'font-medium bg-muted/50' : (props.onClick ? 'cursor-pointer' : '')}`}
                        data-index={virtualRow.index} //needed for dynamic row height measurement
                        ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                        style={{
                            display: "flex",
                            position: "absolute",
                            transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                            width: "100%",
                        }}
                    >
                        {virtualPaddingLeft ? (
                            <TableCell
                                style={{display: "flex", width: virtualPaddingLeft}}
                            />
                        ) : null}
                        {virtualColumns.map(vc => {
                            const cell = visibleCells[vc.index];
                            
                            if (cell.getIsGrouped()) {
                                // If it's a grouped cell, add an expander
                                return (
                                    <SortableContext
                                        key={cell.id}
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}>
                                        <TableCell 
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                                display: "flex", 
                                                alignItems: "center",
                                                cursor: "pointer"
                                            }}>
                                            <div className="flex items-center gap-1">
                                                {row.getIsExpanded() ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                                <span>
                                                    {formatGroupValue(cell.getValue())} ({row.subRows.length})
                                                </span>
                                            </div>
                                        </TableCell>
                                    </SortableContext>
                                )
                            }
                            
                            if (cell.getIsAggregated()) {
                                // If it's an aggregated cell
                                return (
                                    <SortableContext
                                        key={cell.id}
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}>
                                        <TableCell 
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                                display: "flex", 
                                                justifyContent: "flex-end"
                                            }}>
                                            {flexRender(
                                                cell.column.columnDef.aggregatedCell || cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    </SortableContext>
                                )
                            }
                            
                            if (cell.getIsPlaceholder()) {
                                // If it's a placeholder cell (for cells in grouped rows that aren't being grouped by)
                                return (
                                    <SortableContext
                                        key={cell.id}
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}>
                                        <TableCell 
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                                display: "flex"
                                            }}>
                                        </TableCell>
                                    </SortableContext>
                                )
                            }
                            
                            // For regular cells
                            return (
                                <SortableContext
                                    key={cell.id}
                                    items={columnOrder}
                                    strategy={horizontalListSortingStrategy}>
                                    <DataTableCell cell={cell} key={cell.id} />
                                </SortableContext>
                            );
                        })}
                        {virtualPaddingRight ? (
                            <TableCell
                                style={{display: "flex", width: virtualPaddingRight}}
                            />
                        ) : null}
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

function formatGroupValue(value: any): string {
    if (value === null || value === undefined) return '';
    
    // Format Date objects
    if (value instanceof Date) {
        return value.toLocaleDateString();
    }
    
    // Handle arrays by joining elements
    if (Array.isArray(value)) {
        return value.map(item => formatGroupValue(item)).join(', ');
    }
    
    // Handle objects by converting to JSON string
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return '[Complex Object]';
        }
    }
    
    // Convert any other types to string
    return String(value);
}
