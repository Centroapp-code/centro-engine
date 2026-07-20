import Link from "next/link";
import { Logo } from "@/components/logo";
import { footerLinks, footerTagline, supportEmail } from "@/lib/content/marketing";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              {footerTagline}
            </p>
            <p className="mt-4 text-sm">
              <span className="text-muted-foreground">Sales: </span>
              <Link
                href={`mailto:${supportEmail}`}
                className="font-medium transition-colors hover:text-primary"
              >
                {supportEmail}
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.heading}>
                <p className="text-sm font-medium">{column.heading}</p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Centro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
