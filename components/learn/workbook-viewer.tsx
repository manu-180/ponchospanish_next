"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Printer,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const Document = dynamic(
  () => import("react-pdf").then((m) => m.Document),
  { ssr: false },
);
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
});

// Register worker once on the client
if (typeof window !== "undefined") {
  // dynamic require to avoid bundling on server
  import("react-pdf").then(({ pdfjs }) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

interface WorkbookViewerProps {
  workbook: {
    id: string;
    title: string;
    pdf_path: string;
  };
  initialNote: string | null;
  userId: string | null;
}

export function WorkbookViewer({
  workbook,
  initialNote,
  userId,
}: WorkbookViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [note, setNote] = useState(initialNote ?? "");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(note !== (initialNote ?? ""));
  }, [note, initialNote]);

  const save = useCallback(async () => {
    if (!userId) {
      toast.error("Sign in to save your notes");
      return;
    }
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("workbook_notes").upsert(
      {
        user_id: userId,
        workbook_id: workbook.id,
        content: note,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,workbook_id" },
    );
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Notes saved");
      setDirty(false);
    }
  }, [note, userId, workbook.id]);

  // Autosave debounced
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(save, 1500);
    return () => clearTimeout(t);
  }, [dirty, save]);

  const print = () => window.open(workbook.pdf_path, "_blank")?.print();

  return (
    <div className="rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-charcoal-100/40">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-mustard-600 shrink-0" />
          <p className="font-semibold text-sm truncate">{workbook.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="soft" size="sm">
            <a href={workbook.pdf_path} download>
              <Download className="h-4 w-4" /> Download
            </a>
          </Button>
          <Button variant="soft" size="sm" onClick={print}>
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-charcoal-100/30 p-4 border-b lg:border-b-0 lg:border-r border-charcoal-100/40">
          <div className="mx-auto max-w-full overflow-auto">
            <Document
              file={workbook.pdf_path}
              onLoadSuccess={(p) => setNumPages(p.numPages)}
              loading={
                <div className="flex items-center justify-center h-72 text-sm text-charcoal-400 gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading workbook...
                </div>
              }
              error={
                <div className="flex items-center justify-center h-72 text-sm text-destructive">
                  Couldn&rsquo;t load the workbook.
                </div>
              }
            >
              <Page
                pageNumber={page}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="rounded-lg shadow-soft overflow-hidden bg-white max-w-full"
                width={600}
              />
            </Document>
          </div>

          {numPages > 0 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                size="icon"
                variant="soft"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-charcoal-400 tabular-nums">
                Page {page} of {numPages}
              </span>
              <Button
                size="icon"
                variant="soft"
                onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                disabled={page >= numPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col">
          <p className="text-xs uppercase tracking-[0.22em] text-mustard-600 font-semibold mb-2">
            Your notes
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Take notes, jot answers, or complete exercises here. Saved automatically."
            className="flex-1 min-h-[320px] bg-white"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-charcoal-400">
              {saving
                ? "Saving…"
                : dirty
                  ? "Unsaved changes — auto-saving in a moment"
                  : "All changes saved"}
            </span>
            <Button size="sm" onClick={save} disabled={!dirty || saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
