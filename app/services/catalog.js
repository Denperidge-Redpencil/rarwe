import Service from '@ember/service';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';
import { tracked } from 'tracked-built-ins';

function extractRelationships(object) {
    let relationships = {};
    for (let relationshipName in object) {
        relationships[relationshipName] = object[relationshipName].links.related;
    }
    return relationships;
}

let acceptedTypes = ['bands', 'songs'];

export default class CatalogService extends Service {
    storage = {};

    constructor() {
        super(...arguments);
        this.storage.bands = tracked([]);
        this.storage.songs = tracked([]);
    }

    async fetchAll(type) {
        if (!acceptedTypes.includes(type)) throw `Type ${type} not supported. Accepted types: ${acceptedTypes}`;

        let response = await fetch(`/${type}`);
        let json = await response.json();

        if (type === 'bands') {
            for (let item of json.data) {
                let { id, attributes, relationships } = item;
                let rels = extractRelationships(relationships);
                let record = new Band({ id, ...attributes }, rels);
                this.add('band', record);
            }
            return this.bands;
        } else if (type === 'songs') {
            for (let item of json.data) {
                let { id, attributes, relationships } = item;
                let rels = extractRelationships(relationships);
                let record = new Song({ id, ...attributes}, rels)
                this.add('song', record);
            }
            return this.songs;
        }

    }

    loadAll(json) {
        let records = [];
        for (let item of json.data) {
            record.push(this._loadResource(item));
        }
        return records;
    }

    load(response) {
        return this._loadResource(response.data);
    }

    _loadResource(data) {
        let record;
        let { id, type, attributes, relationships } = data;
        let resourceType = type === 'bands' ? Band : Song
        let typeNameSingular = type.substring(0, type.length - 1);  // bands --> band, songs --> song
        let rels = extractRelationships(relationships);
        record = new resourceType({ id, ...attributes }, rels);
        this.add(typeNameSingular, record);
        return record;
    }

    async create(type, attributes, relationships = {}) {
        let requestDataType;
        let requestUrl;
        if (type === 'band' ) {
            requestDataType = 'bands';
            requestUrl = '/bands';
        } else {
            requestDataType = 'songs';
            requestUrl = '/songs';
        }

        let payload = {
            data: {
                type: requestDataType,
                attributes,
                relationships,
            }
        };
        let response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(payload),
        });
        let json = await response.json();
        return this.load(json);
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
