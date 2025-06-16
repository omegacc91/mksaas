import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { changelogSource } from '@/lib/docs/source';
import { formatDate } from '@/lib/formatter';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { getMDXComponents } from '../custom/mdx-components';

type ChangelogPage = ReturnType<typeof changelogSource.getPages>[number];

interface ReleaseCardProps {
  releaseItem: ChangelogPage;
}

export function ReleaseCard({ releaseItem }: ReleaseCardProps) {
  const { title, description, date, version } = releaseItem.data;
  const MDX = releaseItem.data.body;
  const formattedDate = formatDate(new Date(date));

  return (
    <Card className="mb-8">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Badge variant="default" className="w-fit">
            <TagIcon className="mr-1 size-3" />
            {version}
          </Badge>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="max-w-none prose prose-neutral dark:prose-invert prose-img:rounded-lg">
          <MDX components={getMDXComponents()} />
        </div>
      </CardContent>
    </Card>
  );
}
