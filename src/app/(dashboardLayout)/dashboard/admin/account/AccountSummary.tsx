import { Card, CardContent } from "@/components/ui/card";
import { TAccount } from "@/types/account.type";

export function AccountSummary({ accounts }: { accounts: TAccount[] }) {
  const totalBalance = accounts.reduce(
    (acc, item) => acc + item.currentBalance,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Total Accounts</p>
          <p className="text-2xl font-bold">{accounts.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className="text-2xl font-bold text-green-600">
            ৳ {totalBalance.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
