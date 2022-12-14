import { tracked } from '@glimmer/tracking';
import { dasherize } from '@ember/string';

export default class Band {
  @tracked name;
  @tracked songs;

  constructor({ id, name, songs, description }, relationships = {}) {
    //this.id = dasherize(name);
    this.id = id ?? dasherize(name);
    this.name = name;
    this.songs = songs || [];
    this.relationships = relationships;
    this.description = description;
  }

  save(catalog, attributes) {
    return catalog.update('band', this, attributes);
  }
}
