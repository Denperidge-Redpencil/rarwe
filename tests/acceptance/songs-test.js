import { module, test } from 'qunit';
import { visit, waitFor, click, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'rarwe/tests/helpers';
import {
  testSelector,
  dataTestSteps,
  createBand,
} from 'rarwe/tests/helpers/custom-helpers';

module('Acceptance | songs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List songs', async function (assert) {
    let csk = this.server.create('band', { name: 'Corner Store Kingdom '});
    this.server.create('song', { title: 'DESKTOP!!!', rating: 3, band: csk });
    
    await visit('/');
    
    await dataTestSteps(
      click, testSelector('band-link', ':first-child'),
      click, 'songs-nav-item'
    );
    await waitFor(testSelector('song-item'))

    assert
      .dom(testSelector('song-item'))
      .hasText('DESKTOP!!!');
  });

  /*
  test('Create a song', async function (assert) {
    await visit('/');

    //assert.strictEqual(currentURL(), '/songs');
  });
  */
});
