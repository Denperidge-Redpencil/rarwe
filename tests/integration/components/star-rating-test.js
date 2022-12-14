import { module, test } from 'qunit';
import { setupRenderingTest } from 'rarwe/tests/helpers';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  testSelector,
  starRatingCheck,
} from 'rarwe/tests/helpers/custom-helpers';

module('Integration | Component | star-rating', function (hooks) {
  setupRenderingTest(hooks);

  test('Renders the full and empty stars correctly', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('rating', 4);
    this.set('updateRating', () => {});

    await render(hbs`
      <StarRating 
        @rating={{this.rating}}
        @onUpdate={{this.updateRating}}
      />
    `);

    starRatingCheck(assert, 4, 1);

    this.set('rating', 2);

    starRatingCheck(assert, 2, 3, ' after changing rating');
  });

  test('Calls onUpdate with the correct value', async function (assert) {
    this.set('rating', 2);
    this.set('updateRating', (rating) => {
      assert.step(`Updated to rating: ${rating}`);
    });

    await render(hbs`
      <StarRating
        @rating={{this.rating}}
        @onUpdate={{this.updateRating}}
      />
    `);
    await click(testSelector('star-rating-button', ':nth-child(4)'));
    assert.verifySteps(['Updated to rating: 4']);
  });
});
