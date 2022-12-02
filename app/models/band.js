import { tracked } from "@glimmer/tracking";

export class Band {
    @tracked name;
    @tracked songs;
  
    constructor({ id, name, songs }) {
      //this.id = dasherize(name);
      this.id = id ?? dasherize(name);
      this.name = name;
      this.songs = songs ?? [];
    }
}
  