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

const dummyProducts = [
  { _id: "1", name: "Urea", company: "ACI", isDisabled: false },
  { _id: "2", name: "DAP", company: "BASF", isDisabled: false },
];

export default function ProductTableForDesktop() {
  return (
    <div className="border rounded-lg bg-card">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold">Products</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <Table>
        <TableHeader className="sticky top-0 bg-muted/70">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dummyProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.company}</TableCell>
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
