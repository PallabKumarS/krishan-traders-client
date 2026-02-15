"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TAccount } from "@/types/account.type";
import { Modal } from "@/components/shared/Modal";
import AccountForm from "@/components/forms/AccountForm";
import TransactionForm from "@/components/forms/TransactionForm";

export default function AccountView({ accounts }: { accounts: TAccount[] }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TAccount | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Accounts</h2>

        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {accounts.map((account) => (
          <Card key={account._id} className="hover:shadow-md transition">
            <CardContent className="p-5 space-y-3">
              {/* Account Name */}
              <div>
                <p className="text-sm text-muted-foreground">
                  {account.type.replace("-", " ")}
                </p>
                <p className="text-lg font-semibold">{account.name}</p>
              </div>

              {/* Balance */}
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    account.currentBalance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ৳ {account.currentBalance.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedAccount(account)}
                >
                  Add Transaction
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setOpenCreate(true)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Modal */}
      <Modal
        trigger={null}
        title="Create Account"
        open={openCreate}
        onOpenChange={setOpenCreate}
        content={
          <AccountForm
            onSuccess={() => {
              setOpenCreate(false);
            }}
          />
        }
      />

      {/* Transaction Modal */}
      <Modal
        trigger={null}
        title="Add Transaction"
        open={!!selectedAccount}
        onOpenChange={(open) => {
          if (!open) setSelectedAccount(null);
        }}
        content={
          selectedAccount && (
            <TransactionForm
              accountId={selectedAccount._id}
              onSuccess={() => {
                setSelectedAccount(null);
              }}
            />
          )
        }
      />
    </div>
  );
}
