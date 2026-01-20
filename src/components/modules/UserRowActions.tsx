"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/services/UserService";

interface Props {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const UserRowActions = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = async () => {
    const toastId = toast.loading("Updating user...");

    try {
      const res = await updateUser(user._id, { name, email });
      if (res.success) {
        toast.success("User updated successfully", { id: toastId });
        setIsEditing(false);
      } else {
        toast.error(res.message || "Update failed", { id: toastId });
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            className="w-32"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="w-48"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span>{name}</span>
          <span className="ml-4">{email}</span>
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

export default UserRowActions;
