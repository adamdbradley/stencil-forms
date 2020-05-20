import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-forms',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      dir: '../../docs',
      serviceWorker: false,
    },
  ],
};
