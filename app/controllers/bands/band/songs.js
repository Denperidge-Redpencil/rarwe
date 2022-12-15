import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Song from 'rarwe/models/song';
import { inject as service } from '@ember/service';

export default class BandsBandSongsController extends Controller {
  @tracked showAddSong = true;
  @tracked title = '';
  @tracked sortBy = 'title';
  @tracked searchTerm = {target: {value: ''}};

  @service catalog;

  get matchingSongs() {
    console.log(this.searchTerm)
    let searchTerm = this.searchTerm.target.value.toLowerCase();
    return this.model.songs.filter((song) => {
      return song.title.toLowerCase().includes(searchTerm);
    });
  }

  get sortedSongs() {
    console.log("meow")
    let sortBy = this.sortBy;
    let modifier = 1;
    if (sortBy.startsWith('-')) {
      modifier = -1;
      sortBy = sortBy.substring(1);
    }
    

    return this.matchingSongs.sort((song1, song2) => {
      if (song1[sortBy] < song2[sortBy]) {
        return -1 * modifier;
      } else if (song1[sortBy] > song2[sortBy]) {
        return 1 * modifier;
      } else {
        return 0;
      }
    });
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    //this.catalog.update('song', song, { rating });
    song.save(this.catalog, { rating });
    console.log(song);
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async saveSong() {
    let song = await this.catalog.create(
      'song',
      { title: this.title },
      { band: { data: { id: this.model.id, type: 'bands' } } }
    );
    /*
      Not implemented: p151 are-we-there-yet-6 
      (because I'm not sure what is meant with this but that might be a me problem)
      "Similarly, when we save a song to the back-end where the `band`
      relationship is set, the songs relationship of the band could
      be updated automatically to onclude the song"
    */
    this.model.songs = [...this.model.songs, song];
    this.title = '';
    this.showAddSong = true;
  }

  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
