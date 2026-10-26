import Link from "next/link";
import { categoryGroups } from "@/lib/content";

type Props = {
  byCategory: Record<string, number>;
  compact?: boolean;
};

export function CategoryOverviewGrid({ byCategory, compact = false }: Props) {
  return (
    <div className={compact ? "admin-category-grid admin-category-grid-compact" : "admin-category-grid"}>
      {categoryGroups.map((group) => {
        const groupTotal = group.sections.reduce(
          (sum, section) => sum + (byCategory[section.id] ?? 0),
          0,
        );
        return (
          <section key={group.id} className="admin-category-group">
            <header className="admin-category-group-head">
              <Link href={`/work#${group.id}`} className="admin-category-group-title">
                {group.label}
              </Link>
              {!compact && <span className="admin-category-group-total">{groupTotal} visible</span>}
            </header>
            <ul className="admin-category-cells">
              {group.sections.map((section) => (
                <li key={section.id}>
                  <Link href={`/work#${section.id}`} className="admin-category-cell">
                    <span>{section.label}</span>
                    <strong>{byCategory[section.id] ?? 0}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
