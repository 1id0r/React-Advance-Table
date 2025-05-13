# React Advanced Table Integration Guide

This guide walks through the steps to integrate the Advanced Data Table component into your own React project.

## Prerequisites

Your project should have the following dependencies:

- React 18 or later
- TanStack Table v8 (`@tanstack/react-table`)
- date-fns
- Zod (for validation)
- Lucide React (for icons)
- Radix UI components

## Step 1: Copy Required Components

These are the core files you need to copy:

- `components/data-table/` directory (all files)
- `components/ui/` directory (for UI components)
- `lib/columns.ts` (column utilities)
- `lib/utils.ts` (utility functions)
- `interface/IDataTable.ts` (interfaces)
- `store/dataTableStore.ts` (state management)

## Step 2: Set Up Your Data Types

Define your data types similar to how `Person` is defined in our example:

```typescript
export type YourDataType = {
  id?: string;
  // Your properties here
};
```

## Step 3: Create Column Definitions

Define your column definitions following this pattern:

```typescript
const columns = useMemo<ColumnDef<YourDataType>[]>(
  () => [
    {
      header: 'Column Name',
      accessorKey: 'propertyName',
      id: 'propertyName',
      enableGrouping: true, // Enable if you want grouping for this column
      cell: (info) => info.getValue(),
      // Optional: Add custom rendering
    },
    // More columns...
  ],
  []
);
```

## Step 4: Set Up API Integration

Create functions to fetch, add, update, and delete data:

```typescript
async function fetchData(): Promise<YourDataType[]> {
  const response = await fetch('your-api-endpoint');
  return await response.json();
}

async function addItem(item: YourDataType): Promise<void> {
  await fetch('your-api-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
}

// Similar functions for update and delete
```

## Step 5: Use the Component

In your page or component:

```tsx
import { AdvancedDataTable } from '@/components/data-table';
import { z } from 'zod';

export default function YourComponent() {
  const [data, setData] = useState<YourDataType[]>([]);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <AdvancedDataTable<YourDataType>
      id="your-table-id"
      columns={columns}
      data={data}
      isLoading={isLoading}
      // Configure other props as needed
      dataValidationProps={[
        // Define validation rules for your data fields
      ]}
    />
  );
}
```

## Step 6: Add Data Validation

Define validation rules for your data:

```typescript
dataValidationProps={[
  {
    id: 'fieldName',
    component: 'input', // or 'select', 'date', etc.
    label: 'Field Label',
    schema: z.string().min(3, 'Error message'),
  },
  // More fields...
]}
```

## Advanced Features

### Grouping

The table supports grouping by columns. To enable:

1. Add `enableGrouping: true` to your column definitions.
2. Right-click on column headers to access the grouping option.

### Filtering

Add filter support to columns with:

```typescript
meta: {
  filterVariant: 'select', // or 'date' for date columns
},
```

### Custom Cell Rendering

For special formatting:

```typescript
cell: (info) => {
  const value = info.getValue();
  // Custom rendering logic
  return <CustomComponent value={value} />;
}
```

## Troubleshooting

- **Date Handling**: Ensure date values are properly formatted
- **Object Rendering**: Make sure all values rendered in cells are primitives, not objects
- **Type Errors**: Check that your data types match the column definitions

## Example

See `app/page.tsx` for a complete example of how to use the table with static data and API integration. 