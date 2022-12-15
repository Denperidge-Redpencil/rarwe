import { assert, module, test } from 'qunit';
import { visit, waitFor, click, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'rarwe/tests/helpers';
import {
  testSelector,
  dataTestSteps,
  createSong,
} from 'rarwe/tests/helpers/custom-helpers';

module('Acceptance | songs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List songs', async function (assert) {
    let csk = this.server.create('band', { name: 'Corner Store Kingdom' });
    this.server.create('song', { title: 'DESKTOP!!!', rating: 3, band: csk });

    await visit('/');

    await dataTestSteps(
      click,
      testSelector('band-link', ':first-child'),
      click,
      'songs-nav-item'
    );
    await waitFor(testSelector('song-list-item'));

    assert.dom(testSelector('song-list-item')).hasText('DESKTOP!!!');
  });

  test('Create a song', async function (assert) {
    this.server.create('band', { name: 'Corner Store Kingdom ' });

    await visit('/');
    await dataTestSteps(
      click,
      testSelector('band-link', ':first-child'),
      click,
      'songs-nav-item'
    );

    await createSong('DESKTOP!!!');

    await waitFor(testSelector('song-list-item'));

    assert.dom(testSelector('song-list-item')).hasText('DESKTOP!!!');
  });

  test('Sort songs in various ways', async function () {
    let band = this.server.create('band', { name: 'Them Crooked Vultures' });

    [
      ['Mind Eraser, No Chaser', 2],
      ['Elephants', 4],
      ['Spinning in Daffodils', 5],
      ['New Fang', 3]
    ].forEach((songInfo) => {
      this.server.create('song', {
        title: songInfo[0],
        rating: songInfo[1],
        band
      });
    });

    await visit('/');

    await click(testSelector('band-link'));
    
    assert
      .dom(testSelector('song-list-item', ':first-child'))
      .hasText(
        'Elephants',
        'The first song is the one that comes first in the alphabet'
      );
    assert
      .dom(testSelector('song-list-item', ':last-child'))
      .hasText(
        'Spinning in Daffodils',
        'The last song is the one that comes last in the alphabet'
      );
  });
});
