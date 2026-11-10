"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface Pending {
  opts: ConfirmOptions;
  resolve: (ok: boolean) => void;
}

export function useConfirm() {
  const [pending, setPending] = React.useState<Pending | null>(null);

  const confirm = React.useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setPending({ opts, resolve })),
    [],
  );

  const settle = (ok: boolean) => {
    pending?.resolve(ok);
    setPending(null);
  };

  const dialog = (
    <AlertDialog.Root open={pending !== null} onOpenChange={(open) => !open && settle(false)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-charcoal-700/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-5 rounded-2xl border border-charcoal-100/40 bg-cream-50 p-6 shadow-soft-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:animate-none">
          <div className="space-y-2">
            <AlertDialog.Title className="font-display text-lg font-semibold text-charcoal-700">
              {pending?.opts.title}
            </AlertDialog.Title>
            {pending?.opts.description && (
              <AlertDialog.Description className="text-sm leading-relaxed text-charcoal-500">
                {pending.opts.description}
              </AlertDialog.Description>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel className={cn(buttonVariants({ variant: "soft", size: "sm" }))}>
              {pending?.opts.cancelLabel ?? "Cancelar"}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
              onClick={() => settle(true)}
            >
              {pending?.opts.confirmLabel ?? "Borrar"}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );

  return [confirm, dialog] as const;
}
