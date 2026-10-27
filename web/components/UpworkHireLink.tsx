import { UPWORK_LINK_RELS, UPWORK_PROFILE_URL } from "@/lib/site-links";

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

/** External Upwork profile link — opens in a new tab. */
export function UpworkHireLink({ children, className, href = UPWORK_PROFILE_URL }: Props) {
  return (
    <a className={className} href={href || UPWORK_PROFILE_URL} target="_blank" rel={UPWORK_LINK_RELS}>
      {children}
    </a>
  );
}
