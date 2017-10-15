var _db = { }

module.exports = {
    Add: (key, value) => {
        let _v = value;

        _db.key = {
            key : key,
            value: _v
        };
    },
    Get: (key) => {
        let _v = _db.key;
        return _v;
    }
}