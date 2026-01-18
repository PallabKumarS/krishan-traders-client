import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

type TPropConfirmationBox = {
  description?: string;
  title?: string;
  trigger: ReactNode | string;
  onConfirm: () => void;
};

export default function ConfirmationBox({
  description,
  title,
  trigger,
  onConfirm,
}: TPropConfirmationBox) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="" asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-destructive">
            {description ||
              "This action cannot be undone. This will delete your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-accent bg-transparent border border-accent hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="hover:bg-destructive text-destructive hover:text-white bg-transparent border border-destructive"
            onClick={onConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
