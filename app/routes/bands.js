import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import wait from 'rarwe/utils/wait';

export default class BandsRoute extends Route {
  @service catalog;

  async model() {
    //await wait(3000);
    return this.catalog.fetchAll('bands');
    /*
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
    */
    /*
    let response = await fetch('/bands');
    let json = await response.json();
    console.log(json)
    for (let item of json.data) {
      let { id, attributes, relationships } = item;  // Don't forget the {} before you get stuck for way too long
      let rels = {};
      for (let relationshipName in relationships) {
        rels[relationshipName] = relationships[relationshipName].links.related;
      }
      let record = new Band({id, ...attributes}, rels);
      console.log(record)
      this.catalog.add('band', record);
    }

    return this.catalog.bands;
    */

    //return [ngdr, foodHouse, csk];
  }
}
