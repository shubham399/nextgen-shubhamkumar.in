'use client';
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export interface ICta {
  btn: string;
  className: string;
  children: React.ReactNode;
}
const CTA = ({ btn, children, className }: ICta) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", { "theme": "dark", "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, [])
  return (
    <button className={`${className}`} data-cal-config='{"layout":"month_view"}' data-cal-link={btn}>
      {children}
    </button>
  )
};



export default CTA;
