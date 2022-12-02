import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { dasherize } from '@ember/string/';

class Band {
  @tracked name;

  constructor({ id, name, songs }) {
    //this.id = dasherize(name);
    this.id = id ?? dasherize(name);
    this.name = name;
    this.songs = songs;
  }
}

class Song {
  constructor({ title, rating, band}) {
    this.title = title;
    this.rating = rating ?? 0;
    this.band = band;
  }
}

export default class BandsRoute extends Route {
  model() {
    let ultraViolentLightCannon = new Song({
      title: "Ultra Violent Light Cannon",
      band: "Newgrounds Death Rugby",
      rating: 4
    });
    let thosMoser = new Song({
      title: "Thos Moser",
      band: "food house",
      rating: 2
    });
    let desktop = new Song({
      title: "DESKTOP!!",
      band: "CORNER STORE KINGDOM",
      rating: 3
    });


    let ngdr = new Band({
      id: "1",
      name: 'Newgrounds Death Rugby',
      songs: [ultraViolentLightCannon]
    });

    let foodHouse = new Band({
      name: 'food house',
      songs: [thosMoser]
    });

    let csk = new Band({
      name: 'CORNER STORE KINGDOM',
      songs: [desktop]
    });


    return [ngdr, foodHouse, csk];
  }
}
