import { module, test } from 'qunit';
import { visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'rarwe/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';

import {
  testSelector,
  dataTestSteps,
  createBand,
} from 'rarwe/tests/helpers/custom-helpers';

module('Acceptance | bands', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List /bands', async function (assert) {
    this.server.create('band', { name: 'Radiohead' });
    this.server.create('band', { name: 'Long Distance Calling' });

    await visit('/');

    assert.strictEqual(getPageTitle(), 'Bands | Rock & Roll with Octane');

    assert
      .dom(testSelector('band-link'))
      .exists({ count: 2 }, 'All band links are rendered');

    assert
      .dom(testSelector('band-list-item', ':first-child'))
      .hasText('Radiohead', 'The first band link contains the band name');

    assert
      .dom(testSelector('band-list-item', ':last-child'))
      .hasText(
        'Long Distance Calling',
        'The other band link contains the band name'
      );
  });

  test('Create a band', async function (assert) {
    this.server.create('band', { name: 'Royal Blood' });

    await visit('/');
    await createBand('Caspian');
    await waitFor(testSelector('no-songs-text'));

    assert
      .dom(testSelector('band-list-item'))
      .exists({ count: 2 }, 'A new band link is rendered');
    assert
      .dom(testSelector('band-list-item', ':last-child'))
      .hasText('Caspian', 'The new band link is rendered as the last item');

    assert
      .dom(testSelector('songs-nav-item', ' > .active'))
      .exists('The Songs tab is active');
  });
});
