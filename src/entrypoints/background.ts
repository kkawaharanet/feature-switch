type SettingKey = 'images' | 'javascript' | 'cookies';

const KEYS: SettingKey[] = ['images', 'javascript', 'cookies'];

async function applySettings(stored: Record<string, unknown>) {
  const cs = (browser as any).contentSettings;
  for (const key of KEYS) {
    const enabled = stored[key] !== false;
    cs[key].set({
      primaryPattern: '<all_urls>',
      setting: enabled ? 'allow' : 'block',
    });
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    const stored = await browser.storage.local.get(KEYS);
    await applySettings(stored);
  });

  browser.runtime.onStartup.addListener(async () => {
    const stored = await browser.storage.local.get(KEYS);
    await applySettings(stored);
  });
});
