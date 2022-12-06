import Service from '@ember/service';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';
import { tracked } from 'tracked-built-ins';
import { isArray } from '@ember/array';
import fetch from 'fetch';

function extractRelationships(object) {
    let relationships = {};
    for (let relationshipName in object) {
        relationships[relationshipName] = object[relationshipName].links.related;
    }
    return relationships;
}

class Collection {
    constructor(Class, singular, plural, endpoint) {
        this.singular = singular;
        this.plural = plural;
        this.endpoint = endpoint;
        this.Class = Class;
        this.map = tracked(new Map());
        // Thanks to https://stackoverflow.com/a/28402429
        //this.getter = Object.getOwnPropertyDescriptor();
    }

    get id() {
        return this.singular;
    }

    // Based on API
    get type() {
        return this.plural;
    }

    get(...args) {
        return this.map.get(...args);
    }

    set(...args) {
        return this.map.set(...args);
    }

    // Meant for the Catalogs getters
    // If the collection data has to be sent to another place,
    // you probably want to use this
    get values() {
        return Array.from(this.map.values());
    }

    typeEquals(type) {
        return type === this.singular || type === this.plural;
    }
}

export default class CatalogService extends Service {
    storage = {};

    constructor() {
        super(...arguments);
        this.storage.bands = new Collection(Band, 'band', 'bands', '/bands')
        this.storage.songs = new Collection(Song, 'song', 'songs', '/songs')
    }

    selectCollection(typeToSelect) {
        if (this.storage.bands.typeEquals(typeToSelect)) {
            return this.storage.bands;
        } else if (this.storage.songs.typeEquals(typeToSelect)) {
            return this.storage.songs;
        } else {
            throw `Type ${typeToSelect} is not (yet) implemented.`; 
        }
    }

    async fetchRelated(record, relationship) {
        let url = record.relationships[relationship];
        let response = await fetch(url);
        let json = await response.json();
        if (isArray(json.data)) {
            record[relationship] = this.loadAll(json);
        } else {
            record[relationship] = this.load(json);
        }
        return record[relationship];
    }
    

    async fetchAll(typeToFetch) {
        let collection = this.selectCollection(typeToFetch);

        let response = await fetch(collection.endpoint);
        let json = await response.json();

        for (let item of json.data) {
            let { id, attributes, relationships } = item;
            let rels = extractRelationships(relationships);
            let record = new collection.Class({ id, ...attributes }, rels);
            this.add(collection.id, record);
        }

        return collection.values;
    }

    loadAll(json) {
        let records = [];
        for (let item of json.data) {
            records.push(this._loadResource(item));
        }
        return records;
    }

    load(response) {
        return this._loadResource(response.data);
    }

    _loadResource(data) {
        let record;
        let { id, type, attributes, relationships } = data;
        let collection = this.selectCollection(type);
        let rels = extractRelationships(relationships);

        record = new collection.Class({ id, ...attributes }, rels);

        this.add(collection.singular, record);
        return record;
    }

    async create(type, attributes, relationships = {}) {
        let collection = this.selectCollection(type);
        let [ requestDataType, requestUrl ] = [collection.type, collection.endpoint];


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

    async update(type, record, attributes) {
        let collection = this.selectCollection(type);
        let [ requestDataType, requestUrl ] = [collection.type, collection.endpoint];

        let payload = {
            data: {
                id: record.id,
                type: requestDataType,
                attributes,
            }
        };
        requestUrl += `/${record.id}`;
        //Documents
        await fetch(requestUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(payload),
        });
        
    }

    add(type, record) {
        // add(type, record) {
        let collection = this.selectCollection(type);
        //console.log(record)
        //let collection = Object.hasOwn(record, "songs") ? this.storage.bands : this.storage.songs;
        //collection.push(record);

        let existingRecord = collection.get(record.id)

        if (!existingRecord) {
            collection.set(record.id, record);
        }
        // Whether newly added or not, get a fresh copy from the collection
        return collection.get(record.id);

        // Previously returned 'this', so I could chain collection.add().add().add();
    }

    // triggers when using this.bands & this.songs, NOT when using this.storage.bands & this.storage.songs
    get bands() {
        return this.storage.bands.values;
    }

    get songs() {
        return this.storage.songs.values;
    }

    find(type, filterFn) {
        let collection = this.selectCollection(type);
        return collection.find(filterFn);
    }

    findById(type, id) {
        let collection = this.selectCollection(type);
        return collection.get(id);
    }
}
