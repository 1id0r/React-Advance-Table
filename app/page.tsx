'use client'

import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ColumnDef, Table } from '@tanstack/react-table'
import { makeData, Person } from '@/lib/makeData'
import { isWithinInterval } from 'date-fns'
import { AdvancedDataTable } from '@/components/data-table'
import { DataTableCheckBox } from '@/components/data-table/data-table-checkbox'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

const data = makeData(100_000)
export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const filename = 'exampleExport'
  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: Table<Person> }) => (
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
        cell: (info) => {
          const severity = info.getValue() as string;
          let bg = '', color = '#fff';
          if (severity === 'Critical') bg = '#ef4444'; // red
          else if (severity === 'Warning') bg = '#facc15', color = '#333'; // yellow, dark text for contrast
          else if (severity === 'Major') bg = '#3b82f6'; // blue

          return (
            <span style={{
              display: 'inline-block',
              borderRadius: '999px',
              padding: '0.15em 0.1em',
              background: bg,
              color,
              fontWeight: 500,
              fontSize: '0.95em',
              minWidth: 70,
              textAlign: 'center',
            }}>
              {severity}
            </span>
          );
        },
        meta: {
          filterVariant: 'select',
        },
      },
      {
        header: 'Hierarchy',
        accessorKey: 'hierarchy',
        id: 'hierarchy',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Last Updated',
        accessorKey: 'lastUpdated',
        id: 'lastUpdated',
        cell: (info) => {
          const date = info.getValue() as Date;
          return date.toLocaleDateString();
        },
        meta: {
          filterVariant: 'date',
        },
        filterFn: (row, columnId, filterValue) => {
          const columnDate = row.getValue(columnId) as Date;
          const { from, to } = filterValue;
          return isWithinInterval(columnDate, { start: from, end: to || from });
        },
      },
      {
        header: 'Start Date',
        accessorKey: 'startDate',
        id: 'startDate',
        cell: (info) => {
          const date = info.getValue() as Date;
          return date.toLocaleDateString();
        },
        meta: {
          filterVariant: 'date',
        },
        filterFn: (row, columnId, filterValue) => {
          const columnDate = row.getValue(columnId) as Date;
          const { from, to } = filterValue;
          return isWithinInterval(columnDate, { start: from, end: to || from });
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        id: 'status',
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
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: 'select',
        },
      },
    ],
    []
  )

  useEffect(() => {
    const tmo = setTimeout(() => {
      setLoading(false)
      clearTimeout(tmo)
    }, 5000)
  }, [])

  return (
    <>
      <Alert className={'mb-2'}>
        <AlertTitle>React Advance Table - Using TanStack Table</AlertTitle>
      </Alert>
      <AdvancedDataTable<Person>
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
          title: 'Add a new netizen',
          description: 'Netizens can be rude sometimes. Add them with caution.',
          onSubmitNewData: (netizen) => {
            console.log('onSubmitNewData', netizen)
          },
        }}
        editDataProps={{
          title: 'Amend netizen data',
          description: 'Netizens can be rude sometimes. Edit them with caution.',
          onSubmitEditData: (netizen) => {
            console.log('onSubmitEditData', netizen)
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
