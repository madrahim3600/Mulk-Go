import { Link } from "@tanstack/react-router";
import { Eye, MapPin } from "lucide-react";
import { formatPrice, useI18n, type Lang } from "@/lib/i18n";
import { PLACEHOLDER_IMAGE, type Listing } from "@/lib/listings";
import { Badge } from "@/components/ui/badge";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, lang } = useI18n();
  const image = listing.images?.[0] || PLACEHOLDER_IMAGE;

  return (
    <Link
      to="/listings/$id"
      params={{ id: listing.id }}
      className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:-translate-y-1"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={image}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant={listing.listing_kind === "rent" ? "secondary" : "default"}>
            {t(listing.listing_kind)}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-display text-lg font-semibold tracking-tight">
          {formatPrice(Number(listing.price), listing.currency, lang as Lang)}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-foreground/90">{listing.title}</h3>
        <p className="text-xs font-semibold text-primary">ID: {listing.listing_number}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {listing.location || "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" />
            {listing.views_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
