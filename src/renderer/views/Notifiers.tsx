import React, { useEffect, useState } from 'react';
import { NotifierConfig } from '../../main/Store/NotifierStore';
import { IpcRendererEvent } from 'electron';
import { Button } from 'antd';

export const Notifiers = (): JSX.Element => {
  const [notifiers, setNotifiers] = useState<{ [key: string]: NotifierConfig }>(
    {},
  );

  useEffect(() => {
    const notifiersListener = (
      event: IpcRendererEvent,
      notifiers: { [key: string]: NotifierConfig },
    ) => {
      setNotifiers(notifiers);
    };

    const cleanListener =
      window.notifierManagement.getAllListener(notifiersListener);

    return () => {
      cleanListener();
    };
  }, []);

  return (
    <>
      <h1>Notifiers</h1>
      <Button type="primary" onClick={() => window.notifierManagement.getAll()}>
        Load
      </Button>
      <p>
        {Object.keys(notifiers)
          .map((el) => notifiers[el].name)
          .join('\n')}
      </p>
    </>
  );
};
