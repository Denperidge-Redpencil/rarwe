import { assert, module, test } from 'qunit';
import { visit, waitFor, click, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'rarwe/tests/helpers';
import {
  testSelector,
  dataTestSteps,
  createSong,
} from 'rarwe/tests/helpers/custom-helpers';
import { songSortCheck } from '../helpers/custom-helpers';

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
    
    // Sort 0
    await songSortCheck(assert, '',
      'Elephants', 'the one that comes first in the alphabet',
      'Spinning in Daffodils', 'the one that comes last in the alphabet');
    
    // Sort 1
    await songSortCheck(assert, 'sort-by-title-desc',
      'Spinning in Daffodils', 'the one that comes last in the alphabet',
      'Elephants', 'the one that comes first in the alphabet');

    await songSortCheck(assert, 'sort-by-rating-asc',
      'Mind Eraser, No Chaser', 'the lowest rated',
      'Spinning in Daffodils', 'the highest rated');
    
    await songSortCheck(assert, 'sort-by-rating-desc',
      'Spinning in Daffodils', 'the highest rated',
      'Mind Eraser, No Chaser', 'the lowest rated');
    
  });
});
