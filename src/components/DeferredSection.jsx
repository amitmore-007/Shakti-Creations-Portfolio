import React, { useEffect, useRef, useState } from "react";

function DeferredSection({
  children,
  id,
  minHeight = 520,
  rootMargin = "320px 0px",
}) {
  const [active, setActive] = useState(false);
  const hostRef = useRef(null);

  useEffect(() => {
    if (active) return undefined;

    const node = hostRef.current;
    if (!node) return undefined;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(true);
          observer.disconnect();
        });
      },
      {
        root: null,
        threshold: 0.01,
        rootMargin,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [active, rootMargin]);

  return (
    <div id={id} ref={hostRef}>
      {active ? (
        children
      ) : (
        <div
          className="deferred-section-placeholder"
          style={{ minHeight }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default React.memo(DeferredSection);
