import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";

const dummySizes = [
  {
    _id: "1",
    product: "Urea",
    label: "500 gm",
    unit: "gm",
    isActive: true,
  },
];

export default function SizeTableForDesktop() {
  return (
    <div className="border rounded-lg bg-card">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold">Sizes</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Size
        </Button>
      </div>

      <Table>
        <TableHeader className="sticky top-0 bg-muted/70">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dummySizes.map((size) => (
            <TableRow key={size._id}>
              <TableCell>{size.product}</TableCell>
              <TableCell>{size.label}</TableCell>
              <TableCell>{size.unit}</TableCell>
              <TableCell>{size.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
