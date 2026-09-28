'use client';
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { colorGroups } from "@/lib/theme";

export interface ICta {
  btn: string;
  className: string;
  children: React.ReactNode;
}
const CTA = ({ btn, children, className }: ICta) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      // A literal hex, because it crosses into the cal.com iframe where none of
      // our custom properties exist. Pinned to the default palette rather than
      // re-keyed: the modal is a different product on a different surface.
      cal("ui", { "theme": "dark", "styles": { "branding": { "brandColor": colorGroups.surface.surface } }, "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, [])
  return (
    <button type="button" aria-haspopup="dialog" className={className} data-cal-config='{"layout":"month_view"}' data-cal-link={btn}>
      {children}
    </button>
  )
};



export default CTA;
