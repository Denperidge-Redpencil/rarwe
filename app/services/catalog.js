import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CatalogService extends Service {
    @tracked storage = {};

    constructor() {
        super(...arguments);
        this.storage.bands = [];
        this.storage.songs = [];
    }

    add(type, record) {
        // add(type, record) {
        let collection = type === 'band' ? this.storage.bands : this.storage.songs;
        //console.log(record)
        //let collection = Object.hasOwn(record, "songs") ? this.storage.bands : this.storage.songs;
        collection.push(record);
        return this;
    }

    get bands() {
        return this.storage.bands;
    }

    get songs() {
        return this.storage.songs;
    }
}
