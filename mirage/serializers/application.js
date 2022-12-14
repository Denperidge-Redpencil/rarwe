import { JSONAPISerializer } from 'miragejs';

export default JSONAPISerializer.extend({
  links(resource) {
    let { id, modelName } = resource;
    if (modelName === 'band') {
      return {
        songs: {
          related: `/bands/${id}/songs`,
          self: `/bands/${id}/relationships/songs`,
        },
      };
    } else if (modelName === 'song') {
      return {
        band: {
          related: `/songs/${id}/band`,
          self: `/songs/${id}/relationships/band`,
        }
      }
    }
  },
});
