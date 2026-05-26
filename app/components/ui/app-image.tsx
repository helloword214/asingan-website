import { useEffect, useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from "react";

import { cx } from "./cx";

type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean;
  skeleton?: boolean;
};

const useSafeLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function AppImage({
  className,
  decoding,
  fetchPriority,
  loading,
  onError,
  onLoad,
  priority = false,
  skeleton = true,
  src,
  ...props
}: AppImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useSafeLayoutEffect(() => {
    const image = imageRef.current;
    setIsClientReady(true);
    setIsLoaded(Boolean(image?.complete && image.naturalWidth > 0));
  }, [src]);

  return (
    <img
      {...props}
      className={cx(
        "app-image",
        skeleton && isLoaded && "is-loaded",
        skeleton && isClientReady && !isLoaded && "is-loading",
        className,
      )}
      decoding={decoding ?? (priority ? "sync" : "async")}
      fetchPriority={priority ? "high" : fetchPriority}
      loading={priority ? "eager" : loading ?? "lazy"}
      onError={(event) => {
        setIsLoaded(true);
        onError?.(event);
      }}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
      ref={imageRef}
      src={src}
    />
  );
}
