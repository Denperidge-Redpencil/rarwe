import Component from '@glimmer/component';

export default class SortButtonComponent extends Component {
    get icon() {
        if (!this.args.sort.startsWith('-')) {
            return 'angle-up';
        } else {
            return 'angle-down';
        }
    }
}
