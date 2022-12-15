import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import wait from 'rarwe/utils/wait';

export default class BandsBandSongsRoute extends Route {
  @service catalog;

  queryParams = {
    sortBy: {
      as: 's',
    },
    searchTerm: {
      as: 'q',
    },
  };

  async model() {
    let band = this.modelFor('bands.band');
    await wait(3000);
    await this.catalog.fetchRelated(band, 'songs', 'band');
    //for (let song of band.songs)
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
