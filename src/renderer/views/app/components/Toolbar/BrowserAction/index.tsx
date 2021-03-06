import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ToolbarButton } from '../ToolbarButton';
import { IBrowserAction } from '../../../models';
import { ipcRenderer, remote } from 'electron';
import store from '../../../store';

interface Props {
  data: IBrowserAction;
}

const showPopup = (data: IBrowserAction, right: number, devtools: boolean) => {
  store.extensions.currentlyToggledPopup = data.extensionId;
  ipcRenderer.send(
    `show-extension-popup-${store.windowId}`,
    right,
    data.popup,
    devtools,
  );
};

let canOpenPopup = true;

const onClick = (data: IBrowserAction) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  if (data.tabId) {
    // TODO:
    //extensionsRenderer.browserAction.onClicked(data.extensionId, data.tabId);
  }

  if (canOpenPopup) {
    const { right } = e.currentTarget.getBoundingClientRect();
    showPopup(data, right, false);
  }
};

const onContextMenu = (data: IBrowserAction) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  const { target } = e;
  const menu = remote.Menu.buildFromTemplate([
    {
      label: 'Inspect popup',
      click: () => {
        const { right } = (target as any).getBoundingClientRect();
        showPopup(data, right, true);
      },
    },
    {
      label: 'Inspect background page',
      click: () => {
        ipcRenderer.invoke(
          `inspect-extension`,
          store.isIncognito,
          data.extensionId,
        );
      },
    },
  ]);

  menu.popup();
};

const onMouseDown = (data: IBrowserAction) => async (e: any) => {
  canOpenPopup =
    !store.dialogsVisibility['extension-popup'] ||
    data.extensionId !== store.extensions.currentlyToggledPopup;
  ipcRenderer.send(`hide-extension-popup-${store.windowId}`);
};

export const BrowserAction = observer(({ data }: Props) => {
  const {
    icon,
    badgeText,
    badgeBackgroundColor,
    badgeTextColor,
    extensionId,
  } = data;

  return (
    <ToolbarButton
      onClick={onClick(data)}
      onMouseDown={onMouseDown(data)}
      onContextMenu={onContextMenu(data)}
      opacity={1}
      autoInvert={false}
      size={16}
      toggled={
        store.dialogsVisibility['extension-popup'] &&
        store.extensions.currentlyToggledPopup === extensionId
      }
      icon={icon}
      badge={badgeText.trim() !== ''}
      badgeBackground={badgeBackgroundColor}
      badgeTextColor={badgeTextColor}
      badgeText={badgeText}
    ></ToolbarButton>
  );
});
