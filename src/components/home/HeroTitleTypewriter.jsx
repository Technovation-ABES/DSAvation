import React, { useState, useEffect } from 'react';

export const HeroTitleTypewriter = React.memo(function HeroTitleTypewriter() {
  const line1Full = "Build the instinct.";
  const line2Full = "One problem at a time.";
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  useEffect(() => {
    let i1 = 0;
    let i2 = 0;
    let t1 = null;
    let t2 = null;

    const typeLine1 = () => {
      if (i1 < line1Full.length) {
        setLine1(line1Full.slice(0, i1 + 1));
        i1++;
        t1 = setTimeout(typeLine1, 38);
      } else {
        t2 = setTimeout(typeLine2, 130);
      }
    };

    const typeLine2 = () => {
      if (i2 < line2Full.length) {
        setLine2(line2Full.slice(0, i2 + 1));
        i2++;
        t2 = setTimeout(typeLine2, 35);
      }
    };

    t1 = setTimeout(typeLine1, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <h1 style={{ minHeight: '2.15em' }}>
      {line1}
      {line1.length === line1Full.length && <br />}
      {line2 && <em>{line2}</em>}
    </h1>
  );
});

