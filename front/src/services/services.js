import { team } from "./team/team";
import { country } from "./country/country";
import { NotificationManager } from 'react-notifications';
import { confirmAlert } from 'react-confirm-alert';

export class services {
  constructor() {
    this.team = new team();
    this.country = new country();
  }

  createNotification(type, message = "", title = "") {
    switch (type) {
      case 'info':
        return NotificationManager.info(message, title);
        break;
      case 'success':
        return NotificationManager.success(message, title);
        break;
      case 'warning':
        return NotificationManager.warning(message, title, 3000);
        break;
      case 'error':
        return NotificationManager.error(message, title, 15000, () => { });
        break;
    }
  }

  confirmAlert(message = "", callbacks = {}, className = "overlay-custom-class-name") {
    const _callbacks = {
      onYes: () => { }, onNo: () => { },
      willUnmount: () => { },
      afterClose: () => { },
      onClickOutside: () => { },
      onKeypress: () => { },
      onKeypressEscape: () => { },
      ...callbacks
    };
    confirmAlert({
      title: 'Confirm',
      message: message,
      buttons: [
        {
          label: 'Yes',
          onClick: _callbacks.onYes
        },
        {
          label: 'No',
          onClick: _callbacks.onNo
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      willUnmount: _callbacks.willUnmount,
      afterClose: _callbacks.afterClose,
      onClickOutside: _callbacks.onClickOutside,
      onKeypress: _callbacks.onKeypress,
      onKeypressEscape: _callbacks.onKeypressEscape,
      overlayClassName: className
    });

  }
}