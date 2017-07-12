
'use strict';

const _parseAndReconstitute = factory => doc => Promise.resolve(JSON.parse(JSON.stringify(doc)))
    .then(data => factory.reconstitute(data));

const parseResponse = parseAndReconstitute => blob => {
    if (!blob) {
        return Promise.resolve();
    }

    if (Array.isArray(blob)) {
        return Promise.all(blob.map(doc => parseAndReconstitute(doc)));
    }

    return parseAndReconstitute(blob);
};


function domainify(repo, factory) {
    const parseAndReconstitute = _parseAndReconstitute(factory);
    const parse = parseResponse(parseAndReconstitute);

    const wrap = methodName => {
        const orig = repo[methodName].bind(repo);
        repo[methodName] = function () {
            return orig.apply(null, arguments).then(results => parse(results));
        };
    };

    wrap('findAll');
    wrap('findOne');

    repo.wrap = wrap;
    return repo;
}

module.exports = domainify;
