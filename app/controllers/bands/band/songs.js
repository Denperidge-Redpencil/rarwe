import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class BandsBandSongsController extends Controller {
    @tracked showAddSong = true;
}
