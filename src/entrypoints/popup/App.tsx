import { useEffect, useState } from "react";
import styles from "./App.module.css";

const SETTING_KEYS = ["images", "javascript", "cookies"] as const;
type SettingKey = (typeof SETTING_KEYS)[number];
type Settings = Record<SettingKey, boolean>;

async function applyContentSetting(key: SettingKey, enabled: boolean) {
  const cs = (browser as any).contentSettings;
  cs[key].set({
    primaryPattern: "<all_urls>",
    setting: enabled ? "allow" : "block",
  });
}

function App() {
  const [settings, setSettings] = useState<Settings>({
    images: true,
    javascript: true,
    cookies: true,
  });

  useEffect(() => {
    browser.storage.local.get([...SETTING_KEYS]).then((stored) => {
      setSettings({
        images: stored.images !== false,
        javascript: stored.javascript !== false,
        cookies: stored.cookies !== false,
      });
    });
  }, []);

  const toggle = async (key: SettingKey) => {
    const next = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: next }));
    await browser.storage.local.set({ [key]: next });
    await applyContentSetting(key, next);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {SETTING_KEYS.map((key: SettingKey) => (
          <li key={key} className={styles.item}>
            <input
              id={key}
              type="checkbox"
              checked={settings[key]}
              onChange={() => toggle(key)}
            />
            <label htmlFor={key}>{browser.i18n.getMessage(key)}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
