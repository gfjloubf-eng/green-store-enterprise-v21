import { useEffect, useState } from 'react';

const SPLASH_DURATION_MS = 1300;

export function BrandSplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="qutoof-splash"
      role="status"
      aria-live="polite"
      aria-label="جارٍ فتح قطوف الطبيعة"
    >
      <div className="qutoof-splash__glow qutoof-splash__glow--green" aria-hidden="true" />
      <div className="qutoof-splash__glow qutoof-splash__glow--orange" aria-hidden="true" />
      <div className="qutoof-splash__content">
        <div className="qutoof-splash__logo-frame">
          <img
            src="/qutoof-official.png"
            alt="قطوف الطبيعة — الطبيعة أقرب إليك"
            className="qutoof-splash__logo"
          />
        </div>
        <p className="qutoof-splash__tagline">الطبيعة أقرب إليك</p>
        <div className="qutoof-splash__loader" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
