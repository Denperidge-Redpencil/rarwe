import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { dasherize } from '@ember/string/';
import { inject as service } from '@ember/service';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';


export default class BandsRoute extends Route {
  @service catalog;

  model() {
    let ultraViolentLightCannon = new Song({
      title: 'Ultra Violent Light Cannon',
      rating: 4,
    });
    let thosMoser = new Song({
      title: 'Thos Moser',
      rating: 2,
    });
    let desktop = new Song({
      title: 'DESKTOP!!',
      rating: 3,
    });

    let ngdr = new Band({
      id: '1',
      name: 'Newgrounds Death Rugby',
      songs: [ultraViolentLightCannon],
    });

    let foodHouse = new Band({
      name: 'food house',
      songs: [thosMoser],
    });

    let csk = new Band({
      name: 'CORNER STORE KINGDOM',
      songs: [desktop],
    });

    ultraViolentLightCannon.band = ngdr;
    thosMoser.band = foodHouse;
    desktop.band = csk;

    this.catalog.add('song', ultraViolentLightCannon).add('song', thosMoser).add('song', desktop);

    this.catalog.add('band', ngdr).add('band', foodHouse).add('band', csk);

    return this.catalog.bands;

    //return [ngdr, foodHouse, csk];
  }
}
