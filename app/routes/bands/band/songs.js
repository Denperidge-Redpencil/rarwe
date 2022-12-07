import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Song from 'rarwe/models/song';
import fetch from 'fetch';

export default class BandsBandSongsRoute extends Route {
  @service catalog;
  
  async model() {
    let band = this.modelFor('bands.band');
    await this.catalog.fetchRelated(band, 'songs', 'band');
    //for (let song of band.songs)
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
