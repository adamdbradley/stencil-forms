import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-forms',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: false,
    },
  ],
};
