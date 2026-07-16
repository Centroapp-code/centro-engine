import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CallListItem } from "@/lib/db/queries/calls";

export function CallDetailsDialog({ call }: { call: CallListItem }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        View
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{call.callerName ?? "Unknown caller"}</DialogTitle>
          <DialogDescription>{call.callerPhone}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          <div>
            <p className="font-medium">Summary</p>
            <p className="mt-1 text-muted-foreground">
              {call.summary ?? "Centro hasn't analyzed this call yet."}
            </p>
          </div>
          <div>
            <p className="font-medium">Transcript</p>
            {call.transcript ? (
              <pre className="mt-1 max-h-64 overflow-y-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap text-muted-foreground">
                {call.transcript}
              </pre>
            ) : (
              <p className="mt-1 text-muted-foreground">
                No transcript recorded for this call.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
