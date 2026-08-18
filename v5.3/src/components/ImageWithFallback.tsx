import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { withBase } from "../utilities/paths";

export function ImageWithFallback({ src, alt, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const requested = typeof src === "string" ? src : "fallback-cover.svg";

  useEffect(() => setFailed(false), [requested]);

  return (
    <img
      {...props}
      src={failed ? withBase("fallback-cover.svg") : withBase(requested)}
      alt={alt ?? ""}
      onError={(event) => {
        onError?.(event);
        setFailed(true);
      }}
      loading={props.loading ?? "lazy"}
      decoding="async"
      referrerPolicy={props.referrerPolicy ?? "no-referrer"}
    />
  );
}
