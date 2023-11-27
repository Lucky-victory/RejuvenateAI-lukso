import { createEIP1193Provider } from '@web3-onboard/common';

import { Device, Platform, WalletModule } from '@web3-onboard/common';

export interface InjectedWalletModule extends WalletModule {
  injectedNamespace: string;
  checkProviderIdentity: (helpers: {
    provider: any;
    device: Device;
  }) => boolean;
  platforms: Platform[];
  /**
   * A Url to link users to a download page for the wallet
   * to be shown if not installed or available on the browser
   */
  externalUrl?: string;
}

function lukso(): InjectedWalletModule {
  return {
    injectedNamespace: 'lukso',
    label: 'Universal Profiles',
    getIcon: async () => (await import('./icon')).default,
    checkProviderIdentity: ({ provider }) =>
      !!provider && !!provider.isUniversalProfileExtension,
    getInterface: async () => {
      if ('lukso' in window) {
        const anyWindow: any = window;

        return {
          provider: createEIP1193Provider(anyWindow.lukso),
        };
      }
      window.open(
        'https://chrome.google.com/webstore/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en',
        '_blank'
      );
      throw new Error(
        'Please install LUKSO Universal Profile extension before proceeding'
      );
    },
    platforms: ['all'],
    externalUrl:
      'https://chrome.google.com/webstore/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en',
  };
}

export default lukso;