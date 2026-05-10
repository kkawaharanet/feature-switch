type SettingKey = "images" | "javascript" | "cookies";

const KEYS: SettingKey[] = ["images", "javascript", "cookies"];

async function applySettings(stored: Record<string, unknown>) {
  const cs = (browser as any).contentSettings;
  for (const key of KEYS) {
    const enabled = stored[key] !== false;
    cs[key].set({
      primaryPattern: "<all_urls>",
      setting: enabled ? "allow" : "block",
    });
  }
}

async function updateBadge(stored: Record<string, unknown>) {
  const disabledCount = KEYS.filter((key) => stored[key] === false).length;
  const text = disabledCount > 0 ? String(disabledCount) : "";
  await browser.action.setBadgeText({ text });
  if (disabledCount > 0) {
    await browser.action.setBadgeBackgroundColor({ color: "#ea4335" });
    await browser.action.setBadgeTextColor({ color: "#ffffff" });
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    const stored = await browser.storage.local.get(KEYS);
    await applySettings(stored);
    await updateBadge(stored);
  });

  browser.runtime.onStartup.addListener(async () => {
    const stored = await browser.storage.local.get(KEYS);
    await applySettings(stored);
    await updateBadge(stored);
  });

  browser.storage.onChanged.addListener(async (_changes, area) => {
    if (area !== "local") return;
    const stored = await browser.storage.local.get(KEYS);
    await updateBadge(stored);
  });
});
