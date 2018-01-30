class Dwarf {
    static get info() {
        return {
            version: '0.1dev',
            author: 'Viktor Machnik <viktor@machnik.online>',
            license: 'Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>'
        };
    }

    static find(sel) {

    }

    static bagIn(obj) {
        return new Bag(obj);
    }
}