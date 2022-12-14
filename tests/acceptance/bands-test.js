import { module, test } from 'qunit';
import { visit, click, fillIn, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'rarwe/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';

function testSelector(name, psuedoClass="") {
  let selector = `[data-test-rr="${name}"]`;
  if (psuedoClass != "") {
    selector += `${psuedoClass}`;
  }
  return selector;
}

async function dataTestSteps(...args) {
  for (let i = 0; i < args.length; i+=2) {
    let func = args[i];
    let target = args[i+1];
    let selector = testSelector(target);

    // If no additional parameter
    if (typeof args[i+2] === 'function') { 
      await func(selector);
    }
    // If additional parameter
    else {
      await func(selector, args[i+2]);
      i++;  // Skip the additional parameter next step
    }

  }
  /*
  await args.forEach(async (step) => {
    let func, target, value;
    [ func, target, value ] = step;

    target = `[data-test-rr="${args[0]}"]`;
    func = args[1];
    await func(target);
  });
  */
}

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
      .hasText(
        'Radiohead', 
        'The first band link contains the band name'
      );

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
    await dataTestSteps(
      click, "new-band-button",
      fillIn, "new-band-name", 'Caspian',
      click, "save-band-button",
      waitFor, "no-songs-text"
    );

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
