import Route from '@ember/routing/route';

export default class BandsRoute extends Route {
    model() {
        return [
            { name: 'Newgrounds Death Rugby' },
            { name: 'food house' },
            { name: 'CORNER STORE KINGDOM' }
        ];
    }
}
