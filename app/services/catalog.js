import Service from '@ember/service';
import Band from 'rarwe/models/band';
import { tracked } from 'tracked-built-ins';

function extractRelationships(object) {
    let relationships = {};
    for (let relationshipName in object) {
        relationships[relationshipName] = object[relationshipName].links.related;
    }
    return relationships;
}

export default class CatalogService extends Service {
    storage = {};

    constructor() {
        super(...arguments);
        this.storage.bands = tracked([]);
        this.storage.songs = tracked([]);
    }

    async fetchAll() {
        let response = await fetch('/bands');
        let json = await response.json();
        for (let item of json.data) {
            let { id, attributes, relationships } = item;
            let rels = extractRelationships(relationships);
            let record = new Band({ id, ...attributes }, rels);
            this.add('band', record);
        }
        return this.bands;

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

    find(type, filterFn) {
        let collection = type === 'band' ? this.bands : this.songs;
        return collection.find(filterFn);
    }
}
