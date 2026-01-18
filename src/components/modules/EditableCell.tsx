"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/services/UserService";

interface Props {
  id: string;
  field: "name" | "email";
  initialValue: string;
}

const EditableCell = ({ id, field, initialValue }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = async () => {
    const toastId = toast.loading(`Updating ${field}...`);
    try {
      const res = await updateUser(id, { [field]: value });
      if (res.success) {
        toast.success(`${field} updated successfully`, { id: toastId });
        setIsEditing(false);
      } else {
        toast.error(res.message || "Update failed", { id: toastId });
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {isEditing ? (
        <>
          <Input
            className="w-40"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span>{value}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default EditableCell;
