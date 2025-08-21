'use client';

import { CreditTransactionsTable } from '@/components/settings/credits/credit-transactions-table';
import { useCreditTransactions } from '@/hooks/use-credits';
import type { SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/**
 * Credit transactions component
 */
export function CreditTransactions() {
  const t = useTranslations('Dashboard.settings.credits.transactions');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const { data, isLoading } = useCreditTransactions(
    pageIndex,
    pageSize,
    search,
    sorting
  );

  return (
    <CreditTransactionsTable
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
