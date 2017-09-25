
'use strict';

const _reconstitute = factory => blob => {
    if (!blob) {
        return Promise.resolve(null);
    }

    if (Array.isArray(blob)) {
        return Promise.all(blob.map(doc => factory.reconstitute(doc)));
    }

    return factory.reconstitute(blob);
};


function domainify(repo, factory) {
    const reconstitute = _reconstitute(factory);

    const wrap = methodName => {
        const orig = repo[methodName].bind(repo);
        repo[methodName] = function () {
            return orig.apply(null, arguments).then(results => reconstitute(results));
        };
    };

    wrap('findAll');
    wrap('findOne');
    wrap('add');
    wrap('update');

    repo.wrap = wrap;
    return repo;
}

module.exports = domainify;
