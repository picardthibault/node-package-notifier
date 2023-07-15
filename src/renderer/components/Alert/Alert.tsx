import { notification } from 'antd';

type AlertType = 'error' | 'success';

export const openAlert = (
  type: AlertType,
  title: string,
  description?: string,
) => {
  notification[type]({
    message: title,
    description,
    placement: 'topRight',
  });
};
