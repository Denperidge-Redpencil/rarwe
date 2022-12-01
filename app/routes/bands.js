import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

class Band {
  @tracked name;

  constructor(name) {
    this.name = name;
  }
}

export default class BandsRoute extends Route {
  model() {
    return [
      new Band('Newgrounds Death Rugby'),
      new Band('food house'),
      new Band('CORNER STORE KINGDOM'),
    ];
  }
}
