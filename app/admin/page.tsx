import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { CompanyStatusBadge } from "@/components/admin/company-status-badge";
import { mockAdminCompanies, type MockAdminCompany } from "@/lib/mock/admin";
import { formatDate } from "@/lib/format";

const columns: DataTableColumn<MockAdminCompany>[] = [
  {
    header: "Company",
    cell: (company) => (
      <Link
        href={`/admin/companies/${company.id}`}
        className="font-medium hover:underline"
      >
        {company.name}
      </Link>
    ),
  },
  {
    header: "Users",
    cell: (company) => company.userCount,
  },
  {
    header: "Created",
    cell: (company) => formatDate(company.createdAt),
  },
  {
    header: "Status",
    cell: (company) => <CompanyStatusBadge status={company.status} />,
  },
];

export default function AdminCompaniesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
        <p className="text-sm text-muted-foreground">
          Every company using Centro.
        </p>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            rows={mockAdminCompanies}
            getRowKey={(company) => company.id}
            emptyMessage="No companies yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
