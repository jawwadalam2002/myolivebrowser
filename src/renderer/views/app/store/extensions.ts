/* eslint @typescript-eslint/camelcase: 0 */

import { observable } from 'mobx';
import { join } from 'path';

import { IBrowserAction } from '../models';
import { promises } from 'fs';
import { ipcRenderer } from 'electron';
import store from '.';
import { Electron10Extension } from '~/interfaces';

export class ExtensionsStore {
  @observable
  public browserActions: IBrowserAction[] = [];

  @observable
  public defaultBrowserActions: IBrowserAction[] = [];

  @observable
  public currentlyToggledPopup = '';

  public constructor() {
    this.load();

    ipcRenderer.on('load-browserAction', async (e, extension) => {
      await this.loadExtension(extension);
      requestAnimationFrame(() => {
        store.tabs.updateTabsBounds(false);
      });
    });
  }

  public addBrowserActionToTab(tabId: number, browserAction: IBrowserAction) {
    const tabBrowserAction: IBrowserAction = Object.assign(
      Object.create(Object.getPrototypeOf(browserAction)),
      browserAction,
    );
    tabBrowserAction.tabId = tabId;
    this.browserActions.push(tabBrowserAction);
  }

  public async loadExtension(extension: Electron10Extension) {
    if (this.defaultBrowserActions.find(x => x.extensionId === extension.id))
      return;

    if (extension.manifest.browser_action) {
      const { default_icon, default_title } = extension.manifest.browser_action;

      let icon1 = default_icon;

      if (typeof icon1 === 'object') {
        icon1 = Object.values(default_icon)[
          Object.keys(default_icon).length - 1
        ];
      }

      const data = await promises.readFile(
        join(extension.path, icon1 as string),
      );

      if (this.defaultBrowserActions.find(x => x.extensionId === extension.id))
        return;

      const icon = window.URL.createObjectURL(new Blob([data]));
      const browserAction = new IBrowserAction({
        extensionId: extension.id,
        icon,
        title: default_title,
        popup: extension.manifest?.browser_action?.default_popup,
      });

      this.defaultBrowserActions.push(browserAction);

      for (const tab of store.tabs.list) {
        this.addBrowserActionToTab(tab.id, browserAction);
      }
    }
  }

  public async load() {
    const extensions: Electron10Extension[] = await ipcRenderer.invoke(
      'get-extensions',
    );

    await Promise.all(extensions.map(x => this.loadExtension(x)));

    requestAnimationFrame(() => {
      store.tabs.updateTabsBounds(false);
    });
  }
}
