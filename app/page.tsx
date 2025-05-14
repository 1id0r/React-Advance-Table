'use client'

import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ColumnDef, Table } from '@tanstack/react-table'
import { Alert } from '@/lib/makeData'
import { isWithinInterval } from 'date-fns'
import { AdvancedDataTable } from '@/components/data-table'
import { DataTableCheckBox } from '@/components/data-table/data-table-checkbox'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Alert as AlertUi, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { z } from 'zod'

// Static dataset to replace faker-generated data
const staticData: Alert[] = [
  {
    id: '1',
    objectName: 'Server A',
    description: 'Main application server',
    severity: 'Critical',
    hierarchy: 'IT Infrastructure',
    lastUpdated: new Date('2023-11-15'),
    startDate: new Date('2023-01-05'),
    status: 'Open',
    impact: 'High',
    origin: 'System Monitoring',
    snId: 'SN-001',
    environment: 'Production',
  },
  {
    id: '2',
    objectName: 'Database Cluster',
    description: 'Primary database cluster',
    severity: 'Warning',
    hierarchy: 'Database',
    lastUpdated: new Date('2023-10-22'),
    startDate: new Date('2023-02-18'),
    status: 'In Progress',
    impact: 'Medium',
    origin: 'Manual Check',
    snId: 'SN-002',
    environment: 'Production',
  },
  {
    id: '3',
    objectName: 'Load Balancer',
    description: 'Load balancer for web services',
    severity: 'Major',
    hierarchy: 'Network',
    lastUpdated: new Date('2023-12-01'),
    startDate: new Date('2023-03-10'),
    status: 'Resolved',
    impact: 'Low',
    origin: 'Alert System',
    snId: 'SN-003',
    environment: 'Staging',
  },
  {
    id: '4',
    objectName: 'User Authentication',
    description: 'Authentication service issues',
    severity: 'Critical',
    hierarchy: 'Security',
    lastUpdated: new Date('2023-12-10'),
    startDate: new Date('2023-05-22'),
    status: 'Open',
    impact: 'High',
    origin: 'User Reports',
    snId: 'SN-004',
    environment: 'Production',
  },
  {
    id: '5',
    objectName: 'Backup System',
    description: 'Daily backup process',
    severity: 'Warning',
    hierarchy: 'Data Management',
    lastUpdated: new Date('2023-11-28'),
    startDate: new Date('2023-04-15'),
    status: 'Closed',
    impact: 'Medium',
    origin: 'Automated Check',
    snId: 'SN-005',
    environment: 'Development',
  },
  {
    id: '6',
    objectName: 'Test Environment',
    description: 'QA testing infrastructure',
    severity: 'Major',
    hierarchy: 'Testing',
    lastUpdated: new Date('2023-11-05'),
    startDate: new Date('2023-06-01'),
    status: 'In Progress',
    impact: 'Low',
    origin: 'QA Team',
    snId: 'SN-006',
    environment: 'QA',
  },
  {
    id: '7',
    objectName: 'Network Switch',
    description: 'Core network switch',
    severity: 'Critical',
    hierarchy: 'Network',
    lastUpdated: new Date('2023-12-15'),
    startDate: new Date('2023-07-12'),
    status: 'Open',
    impact: 'High',
    origin: 'Network Monitoring',
    snId: 'SN-007',
    environment: 'Production',
  },
  {
    id: '8',
    objectName: 'API Gateway',
    description: 'External API gateway service',
    severity: 'Warning',
    hierarchy: 'API Services',
    lastUpdated: new Date('2023-11-12'),
    startDate: new Date('2023-08-05'),
    status: 'In Progress',
    impact: 'Medium',
    origin: 'System Logs',
    snId: 'SN-008',
    environment: 'Staging',
  },
  {
    id: '9',
    objectName: 'Storage System',
    description: 'Primary storage array',
    severity: 'Major',
    hierarchy: 'Storage',
    lastUpdated: new Date('2023-10-30'),
    startDate: new Date('2023-09-18'),
    status: 'Resolved',
    impact: 'Low',
    origin: 'Monitoring Alert',
    snId: 'SN-009',
    environment: 'Production',
  },
  {
    id: '10',
    objectName: 'Logging Service',
    description: 'Centralized logging system',
    severity: 'Critical',
    hierarchy: 'Monitoring',
    lastUpdated: new Date('2023-12-05'),
    startDate: new Date('2023-10-01'),
    status: 'Open',
    impact: 'High',
    origin: 'DevOps Team',
    snId: 'SN-010',
    environment: 'Development',
  },
]

// Example of how to fetch data from an API
async function fetchTableData(): Promise<Alert[]> {
  // In a real implementation, this would be:
  // const response = await fetch('https://api.example.com/data');
  // const data = await response.json();
  // return data;

  // For demonstration, we'll use a timeout to simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(staticData)
    }, 1500)
  })
}

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState<Alert[]>([])
  const filename = 'exampleExport'

  // Simulate data fetching when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTableData()
        setData(result)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns = useMemo<ColumnDef<Alert>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: Table<Alert> }) => (
          <div className={'pt-1'}>
            <DataTableCheckBox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className={'pt-1'}>
            <DataTableCheckBox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 50,
      },
      {
        header: 'Object Name',
        accessorKey: 'objectName',
        id: 'objectName',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Description',
        accessorKey: 'description',
        id: 'description',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Severity',
        accessorKey: 'severity',
        id: 'severity',
        enableGrouping: true,
        cell: (info) => {
          const severity = info.getValue() as string
          let bg = '',
            color = '#fff'
          if (severity === 'Critical') bg = '#ef4444' // red
          else if (severity === 'Warning') (bg = '#facc15'), (color = '#333') // yellow, dark text for contrast
          else if (severity === 'Major') bg = '#3b82f6' // blue

          return (
            <span
              style={{
                display: 'inline-block',
                borderRadius: '999px',
                padding: '0.15em 0.1em',
                background: bg,
                color,
                fontWeight: 500,
                fontSize: '0.95em',
                minWidth: 70,
                textAlign: 'center',
              }}
            >
              {severity}
            </span>
          )
        },
        meta: {
          filterVariant: 'select',
        },
      },
      {
        header: 'Hierarchy',
        accessorKey: 'hierarchy',
        id: 'hierarchy',
        enableGrouping: true,
        cell: (info) => info.getValue(),
      },
      {
        header: 'Last Updated',
        accessorKey: 'lastUpdated',
        id: 'lastUpdated',
        enableGrouping: true,
        cell: (info) => {
          const value = info.getValue()
          if (!value) return ''
          if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
            const date = value instanceof Date ? value : new Date(value)
            return isNaN(date.getTime()) ? '' : date.toLocaleDateString()
          }
          return ''
        },
        // Custom cell renderer for grouped cells
        getGroupingValue: (row) => {
          const value = row.lastUpdated
          if (!value) return ''
          const date = value instanceof Date ? value : new Date(value)
          if (isNaN(date.getTime())) return ''

          // Return a formatted string instead of a Date object
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        },
        aggregatedCell: (info) => {
          return 'Multiple dates'
        },
        meta: {
          filterVariant: 'date',
        },
        filterFn: (row, columnId, filterValue) => {
          const columnDate = row.getValue(columnId) as Date
          const { from, to } = filterValue
          return isWithinInterval(columnDate, { start: from, end: to || from })
        },
      },
      {
        header: 'Start Date',
        accessorKey: 'startDate',
        id: 'startDate',
        enableGrouping: true,
        cell: (info) => {
          const value = info.getValue()
          if (!value) return ''
          if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
            const date = value instanceof Date ? value : new Date(value)
            return isNaN(date.getTime()) ? '' : date.toLocaleDateString()
          }
          return ''
        },
        // Custom cell renderer for grouped cells
        getGroupingValue: (row) => {
          const value = row.startDate
          if (!value) return ''
          const date = value instanceof Date ? value : new Date(value)
          if (isNaN(date.getTime())) return ''

          // Return a formatted string instead of a Date object
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        },
        aggregatedCell: (info) => {
          return 'Multiple dates'
        },
        meta: {
          filterVariant: 'date',
        },
        filterFn: (row, columnId, filterValue) => {
          const columnDate = row.getValue(columnId) as Date
          const { from, to } = filterValue
          return isWithinInterval(columnDate, { start: from, end: to || from })
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        id: 'status',
        enableGrouping: true,
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: 'select',
        },
      },
      {
        header: 'Impact',
        accessorKey: 'impact',
        id: 'impact',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Origin',
        accessorKey: 'origin',
        id: 'origin',
        enableGrouping: true,
        cell: (info) => info.getValue(),
      },
      {
        header: 'SN ID',
        accessorKey: 'snId',
        id: 'snId',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Environment',
        accessorKey: 'environment',
        id: 'environment',
        enableGrouping: true,
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: 'select',
        },
      },
    ],
    []
  )

  return (
    <>
      <AlertUi className={'mb-2'}>
        <AlertTitle>React Advance Table - Using TanStack Table</AlertTitle>
      </AlertUi>
      <AdvancedDataTable<Alert>
        id={'example-advance-table'}
        columns={columns}
        data={data}
        exportProps={{
          exportFileName: filename,
        }}
        actionProps={{
          onDelete: (props) => {
            console.log('actionProps', props)
          },
        }}
        onRowClick={(prop) => {
          console.log('onRowClick', prop)
        }}
        contextMenuProps={{
          enableEdit: true,
          enableDelete: true,
          onDelete: (prop) => {
            console.log('contextMenuProps:onDelete', prop)
          },
          extra: {
            'Copy to clipboard': (data) => {
              console.log('contextMenuProps:onClipboard', data)
            },
          },
        }}
        addDataProps={{
          enable: true,
          title: 'Add a new item',
          description: 'Add a new item to the table.',
          onSubmitNewData: (item) => {
            console.log('onSubmitNewData', item)
            // In a real app, you would call your API to add the new item
            // Then refresh your data
          },
        }}
        editDataProps={{
          title: 'Edit item',
          description: 'Edit the selected item.',
          onSubmitEditData: (item) => {
            console.log('onSubmitEditData', item)
            // In a real app, you would call your API to update the item
            // Then refresh your data
          },
        }}
        isLoading={isLoading}
        dataValidationProps={[
          {
            id: 'objectName',
            component: 'input',
            label: 'Object Name',
            schema: z.string().min(3, 'Object Name must be at least 3 characters'),
          },
          {
            id: 'description',
            component: 'input',
            label: 'Description',
            schema: z.string().min(3, 'Description must be at least 3 characters'),
          },
          {
            id: 'severity',
            component: 'select',
            label: 'Severity',
            schema: z.enum(['Critical', 'Warning', 'Major']),
          },
          {
            id: 'hierarchy',
            component: 'input',
            label: 'Hierarchy',
            schema: z.string().min(2, 'Hierarchy must be at least 2 characters'),
          },
          {
            id: 'lastUpdated',
            component: 'date',
            label: 'Last Updated',
            schema: z.date(),
          },
          {
            id: 'startDate',
            component: 'date',
            label: 'Start Date',
            schema: z.date(),
          },
          {
            id: 'status',
            component: 'select',
            label: 'Status',
            schema: z.enum(['Open', 'Closed', 'In Progress', 'Resolved']),
          },
          {
            id: 'impact',
            component: 'input',
            label: 'Impact',
            schema: z.string().min(3, 'Impact must be at least 3 characters'),
          },
          {
            id: 'origin',
            component: 'input',
            label: 'Origin',
            schema: z.string().min(2, 'Origin must be at least 2 characters'),
          },
          {
            id: 'snId',
            component: 'input',
            label: 'SN ID',
            schema: z.string().min(3, 'SN ID must be at least 3 characters'),
          },
          {
            id: 'environment',
            component: 'select',
            label: 'Environment',
            schema: z.enum(['Production', 'Staging', 'Development', 'QA']),
          },
        ]}
      />
    </>
  )
}
