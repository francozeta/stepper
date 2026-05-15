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
    <div
      className={cn(
        "docs-code-scroll overflow-x-auto border border-white/10 bg-[#040404]",
        className
      )}
    >
      <Table className="min-w-[720px]">
        <TableHeader className="bg-white/[0.025]">
          <TableRow>
            <TableHead className="text-zinc-500">Prop</TableHead>
            <TableHead className="text-zinc-500">Type</TableHead>
            <TableHead className="text-zinc-500">Default</TableHead>
            <TableHead className="text-zinc-500">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${row.name}-${index}`}
              className="border-white/10 hover:bg-white/[0.025]"
            >
              <TableCell className="font-mono text-xs text-zinc-200">
                {row.name}
              </TableCell>
              <TableCell className="max-w-72 whitespace-normal font-mono text-xs leading-5 text-zinc-500">
                {row.type}
              </TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">
                {row.defaultValue ?? "-"}
              </TableCell>
              <TableCell className="min-w-72 whitespace-normal leading-6 text-zinc-500">
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
