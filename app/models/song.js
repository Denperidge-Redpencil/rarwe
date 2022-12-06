import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class Song {
  @tracked rating;
  @service catalog;

  constructor({ id, title, rating, band }, relationships = {}) {
    this.id = id;
    this.title = title;
    this.rating = rating ?? 0;
    this.band = band;
    this.relationships = relationships;
  }

  save(attributes) { 
    return this.catalog.songs;//.update('song', this, attributes);
  }
}