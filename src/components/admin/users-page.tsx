'use client';

import { UsersTable } from '@/components/admin/users-table';
import { useUsers } from '@/hooks/use-users';
import type { SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function UsersPageClient() {
  const t = useTranslations('Dashboard.admin.users');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const { data, isLoading } = useUsers(pageIndex, pageSize, search, sorting);

  return (
    <UsersTable
      data={data?.items || []}
      total={data?.total || 0}
      pageIndex={pageIndex}
      pageSize={pageSize}
      search={search}
      loading={isLoading}
      onSearch={setSearch}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
      onSortingChange={setSorting}
    />
  );
}
