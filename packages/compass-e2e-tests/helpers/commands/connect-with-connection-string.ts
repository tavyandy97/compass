import type { CompassBrowser } from '../compass-browser';
import * as Selectors from '../selectors';

export async function connectWithConnectionString(
  browser: CompassBrowser,
  connectionString: string,
  connectionStatus: 'success' | 'failure' | 'either' = 'success',
  timeout?: number
): Promise<void> {
  const sidebar = await browser.$(Selectors.SidebarTitle);
  if (await sidebar.isDisplayed()) {
    await browser.disconnect();
  }

  await browser.setValueVisible(
    Selectors.ConnectionStringInput,
    connectionString
  );
  await browser.doConnect(connectionStatus, timeout);
}
