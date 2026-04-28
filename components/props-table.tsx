import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type PropRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

function PropsTable({
  rows,
  className,
}: {
  rows: PropRow[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-mono text-xs text-foreground">
                {row.name}
              </TableCell>
              <TableCell className="max-w-72 whitespace-normal font-mono text-xs leading-5 text-muted-foreground">
                {row.type}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {row.defaultValue ?? "-"}
              </TableCell>
              <TableCell className="min-w-72 whitespace-normal leading-6 text-muted-foreground">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { PropsTable };
export type { PropRow };
