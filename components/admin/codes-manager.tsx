"use client";

/**
 * Premium admin UI for access + discount codes.
 *
 * Layout:
 *  - 4 KPI cards (totals, redemptions, by kind)
 *  - Big "New code" CTA opens a Dialog with a tabbed form
 *  - Tabs filter the list (All / Free / Discount)
 *  - Each code rendered as a Card with copy, status, usage bar, delete
 */

import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  Copy,
  Gift,
  Plus,
  Sparkles,
  Tag,
  Ticket,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Scope = "any" | "course" | "digital_product";

interface BaseCode {
  id: string;
  code: string;
  scope: Scope | string;
  course_id: string | null;
  digital_product_id: string | null;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface FreeCode extends BaseCode {
  kind: "free";
}
export interface DiscountCode extends BaseCode {
  kind: "discount";
  percent_off: number;
}
type AnyCode = FreeCode | DiscountCode;

interface CourseOption {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodesManager({
  initialFree,
  initialDiscount,
  courses,
}: {
  initialFree: FreeCode[];
  initialDiscount: DiscountCode[];
  courses: CourseOption[];
}) {
  const [free, setFree] = useState<FreeCode[]>(initialFree);
  const [discount, setDiscount] = useState<DiscountCode[]>(initialDiscount);
  const [createOpen, setCreateOpen] = useState(false);

  const all: AnyCode[] = useMemo(() => {
    return [...free, ...discount].sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1,
    );
  }, [free, discount]);

  const stats = useMemo(() => {
    const active = all.filter((c) => statusOf(c) === "active").length;
    const redemptions = all.reduce((sum, c) => sum + c.uses_count, 0);
    return {
      active,
      redemptions,
      free: free.length,
      discount: discount.length,
    };
  }, [all, free.length, discount.length]);

  const onCreated = (created: AnyCode) => {
    if (created.kind === "free") setFree((f) => [created, ...f]);
    else setDiscount((d) => [created, ...d]);
    setCreateOpen(false);
    toast.success(`Código ${created.code} creado`);
  };

  const onDeleted = (deleted: AnyCode) => {
    if (deleted.kind === "free") {
      setFree((f) => f.filter((c) => c.id !== deleted.id));
    } else {
      setDiscount((d) => d.filter((c) => c.id !== deleted.id));
    }
    toast.success("Código eliminado");
  };

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Activos"
          value={stats.active}
          tone="emerald"
        />
        <StatCard
          icon={<Ticket className="h-4 w-4" />}
          label="Redimidos"
          value={stats.redemptions}
          tone="mustard"
        />
        <StatCard
          icon={<Gift className="h-4 w-4" />}
          label="Acceso gratis"
          value={stats.free}
          tone="terracotta"
        />
        <StatCard
          icon={<Tag className="h-4 w-4" />}
          label="Descuento"
          value={stats.discount}
          tone="charcoal"
        />
      </div>

      {/* Header + CTA */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Tus códigos</h2>
          <p className="text-xs text-charcoal-400">
            {all.length === 0
              ? "Todavía no creaste ninguno."
              : `${all.length} código${all.length === 1 ? "" : "s"} en total.`}
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Nuevo código
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <CreateForm courses={courses} onCreated={onCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs + list */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos ({all.length})</TabsTrigger>
          <TabsTrigger value="free">Gratis ({free.length})</TabsTrigger>
          <TabsTrigger value="discount">
            Descuento ({discount.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <CodeList codes={all} courses={courses} onDeleted={onDeleted} />
        </TabsContent>
        <TabsContent value="free" className="mt-4">
          <CodeList codes={free} courses={courses} onDeleted={onDeleted} />
        </TabsContent>
        <TabsContent value="discount" className="mt-4">
          <CodeList codes={discount} courses={courses} onDeleted={onDeleted} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "emerald" | "mustard" | "terracotta" | "charcoal";
}) {
  const tones: Record<typeof tone, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    mustard: "bg-mustard/15 text-mustard-600",
    terracotta: "bg-terracotta/15 text-terracotta-600",
    charcoal: "bg-charcoal-100 text-charcoal-600",
  };
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          {icon}
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold">
            {label}
          </p>
          <p className="font-serif text-2xl leading-none mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Code list
// ---------------------------------------------------------------------------

function CodeList({
  codes,
  courses,
  onDeleted,
}: {
  codes: AnyCode[];
  courses: CourseOption[];
  onDeleted: (c: AnyCode) => void;
}) {
  if (codes.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center space-y-2">
          <Ticket className="h-8 w-8 mx-auto text-charcoal-300" />
          <p className="text-sm text-charcoal-400">Nada por acá todavía.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {codes.map((c) => (
        <CodeRow key={`${c.kind}-${c.id}`} code={c} courses={courses} onDeleted={onDeleted} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single code row
// ---------------------------------------------------------------------------

function CodeRow({
  code,
  courses,
  onDeleted,
}: {
  code: AnyCode;
  courses: CourseOption[];
  onDeleted: (c: AnyCode) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const status = statusOf(code);
  const target = targetLabel(code, courses);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const remove = () => {
    if (!confirm(`¿Eliminar ${code.code}? Esta acción no se puede deshacer.`))
      return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/codes/${code.id}?kind=${code.kind}`,
          { method: "DELETE" },
        );
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message ?? d.error ?? "Error");
        }
        onDeleted(code);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo borrar");
      }
    });
  };

  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-soft-lg",
        status !== "active" && "opacity-70",
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Code + copy */}
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={copy}
            className="flex-1 min-w-0 text-left group/code"
            title="Click para copiar"
          >
            <p className="font-mono text-lg font-semibold tracking-tight truncate group-hover/code:text-mustard-600 transition-colors">
              {code.code}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 group-hover/code:text-mustard-600 transition-colors">
              {copied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Click para copiar
                </>
              )}
            </span>
          </button>
          <button
            onClick={remove}
            disabled={pending}
            aria-label="Eliminar"
            className="text-charcoal-300 hover:text-destructive transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Status + kind chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={status} />
          {code.kind === "free" ? (
            <Badge variant="terracotta">
              <Gift className="h-3 w-3 mr-1" />
              Acceso gratis
            </Badge>
          ) : (
            <Badge>
              <Tag className="h-3 w-3 mr-1" />
              {code.percent_off}% OFF
            </Badge>
          )}
        </div>

        {/* Target + usage */}
        <div className="space-y-2 text-xs text-charcoal-400">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate">
              <span className="text-charcoal-300">Curso:</span>{" "}
              <span className="text-charcoal-500">{target}</span>
            </span>
            <span className="text-charcoal-300 shrink-0">
              {code.uses_count}
              {code.max_uses != null ? ` / ${code.max_uses}` : ""} usos
            </span>
          </div>
          {code.max_uses != null && (
            <Progress
              value={Math.min(100, (code.uses_count / code.max_uses) * 100)}
              className="h-1"
            />
          )}
          {code.expires_at && (
            <p className="text-[11px]">
              <span className="text-charcoal-300">Vence:</span>{" "}
              <span
                className={cn(
                  status === "expired" && "text-destructive",
                )}
              >
                {new Date(code.expires_at).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
          {code.notes && (
            <p className="text-[11px] italic text-charcoal-400 line-clamp-2">
              {code.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

type Status = "active" | "expired" | "exhausted";

function statusOf(c: AnyCode): Status {
  if (c.expires_at && new Date(c.expires_at) < new Date()) return "expired";
  if (c.max_uses != null && c.uses_count >= c.max_uses) return "exhausted";
  return "active";
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "active") {
    return (
      <Badge variant="success">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
        Activo
      </Badge>
    );
  }
  if (status === "expired") {
    return <Badge variant="outline">Vencido</Badge>;
  }
  return <Badge variant="muted">Sin usos</Badge>;
}

function targetLabel(c: AnyCode, courses: CourseOption[]): string {
  if (c.scope === "any") return "Cualquier curso";
  if (c.scope === "course" && c.course_id) {
    const course = courses.find((co) => co.id === c.course_id);
    return course?.title ?? "Curso desconocido";
  }
  if (c.scope === "digital_product") return "Producto digital";
  return c.scope;
}

// ---------------------------------------------------------------------------
// Create form (in dialog)
// ---------------------------------------------------------------------------

function CreateForm({
  courses,
  onCreated,
}: {
  courses: CourseOption[];
  onCreated: (c: AnyCode) => void;
}) {
  const [kind, setKind] = useState<"free" | "discount">("free");
  const [code, setCode] = useState("");
  const [scope, setScope] = useState<Scope>("any");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [percentOff, setPercentOff] = useState(20);
  const [maxUses, setMaxUses] = useState<string>(""); // "" = unlimited
  const [expiresAt, setExpiresAt] = useState<string>(""); // YYYY-MM-DD
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  const generate = () => {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const block = () =>
      Array.from(
        { length: 4 },
        () => alphabet[Math.floor(Math.random() * alphabet.length)],
      ).join("");
    setCode(`${block()}-${block()}-${block()}`);
  };

  const submit = () => {
    if (scope === "course" && !courseId) {
      toast.error("Elegí un curso");
      return;
    }
    const payload: Record<string, unknown> = {
      kind,
      scope,
      course_id: scope === "course" ? courseId : null,
      max_uses: maxUses ? Number(maxUses) : null,
      expires_at: expiresAt
        ? new Date(`${expiresAt}T23:59:59.000Z`).toISOString()
        : null,
      notes: notes.trim() || null,
    };
    if (code.trim()) payload.code = code.trim().toUpperCase();
    if (kind === "discount") payload.percent_off = percentOff;

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (!res.ok) {
          const msg =
            d.error === "code_already_exists"
              ? "Ese código ya existe — probá otro"
              : (d.message ?? d.error ?? "Error");
          throw new Error(msg);
        }
        onCreated(d as AnyCode);
        // reset
        setCode("");
        setNotes("");
        setMaxUses("");
        setExpiresAt("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Nuevo código</DialogTitle>
        <DialogDescription>
          Generá un código para regalar acceso gratuito o aplicar un descuento.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Kind selector */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-cream-100 p-1">
          <button
            type="button"
            onClick={() => setKind("free")}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-all",
              kind === "free"
                ? "bg-white shadow-soft text-charcoal-600"
                : "text-charcoal-400 hover:text-charcoal-600",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Gift className="h-3.5 w-3.5" /> Acceso gratis
            </span>
            <span className="text-[11px] text-charcoal-400">
              Desbloquea el curso entero sin pagar.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setKind("discount")}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-all",
              kind === "discount"
                ? "bg-white shadow-soft text-charcoal-600"
                : "text-charcoal-400 hover:text-charcoal-600",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Tag className="h-3.5 w-3.5" /> Descuento
            </span>
            <span className="text-[11px] text-charcoal-400">
              % off en el precio al pagar.
            </span>
          </button>
        </div>

        {/* Code with generate button */}
        <div className="space-y-1.5">
          <Label htmlFor="code">Código</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))
              }
              placeholder="Dejá vacío para auto-generar"
              maxLength={64}
              className="font-mono"
            />
            <Button type="button" variant="soft" onClick={generate}>
              <Wand2 className="h-3.5 w-3.5" /> Generar
            </Button>
          </div>
          <p className="text-[11px] text-charcoal-400">
            Letras mayúsculas, números y guiones. Se guarda en MAYÚSCULAS.
          </p>
        </div>

        {/* Percent off (only for discount) */}
        {kind === "discount" && (
          <div className="space-y-1.5">
            <Label htmlFor="percent">Descuento %</Label>
            <Input
              id="percent"
              type="number"
              min={1}
              max={100}
              value={percentOff}
              onChange={(e) => setPercentOff(Number(e.target.value))}
            />
          </div>
        )}

        {/* Scope + course */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Aplica a</Label>
            <Select
              value={scope}
              onValueChange={(v) => setScope(v as Scope)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier curso</SelectItem>
                <SelectItem value="course">Un curso específico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scope === "course" && (
            <div className="space-y-1.5">
              <Label>Curso</Label>
              <Select
                value={courseId ?? ""}
                onValueChange={(v) => setCourseId(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} {c.is_published ? "" : "(borrador)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Max uses + expiry */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="max">Máx. usos</Label>
            <Input
              id="max"
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="Sin límite"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp">Vence el</Label>
            <Input
              id="exp"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes">Nota interna (opcional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            maxLength={280}
            placeholder="Ej: campaña de Instagram noviembre"
          />
        </div>
      </div>

      <DialogFooter>
        <Button onClick={submit} disabled={pending}>
          {pending ? "Creando…" : "Crear código"}
        </Button>
      </DialogFooter>
    </>
  );
}
