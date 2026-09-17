import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-10 text-sm text-muted-foreground">
        <p className="font-display text-base font-semibold text-foreground">Mulk-Go</p>
        <p>{t("footerNote")}</p>
        <p className="text-xs">© {new Date().getFullYear()} Mulk-Go</p>
      </div>
    </footer>
  );
}
