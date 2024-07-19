import '../i18n';
import { expect, $ } from '@wdio/globals';
import i18next from 'i18next';

describe('Package List testing', () => {
  it('it should print title "Package list"', async () => {
    const header = await $(`h1=${i18next.t('package.list.title')}`);
    await expect(header).toBeDisplayed();
  });
});
