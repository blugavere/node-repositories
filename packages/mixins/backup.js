
'use strict';

/**
 * Optimistically back up writes.
 * Assumes both repositories are Promise-based repositories. 
 * @param {any} repo
 * @param {any} backupRepo
 * @param {any} options
 */
module.exports = (repo, backupRepo, options) => {
    options = options || {};

    const wrap = methodName => {
        const orig = repo[methodName].bind(repo);
        repo[methodName] = function() {
            return orig.apply(null, arguments)
                .then(result => {
                    let backupMethod = backupRepo[methodName];

                    if(options.backupOverrides && options.backupOverrides[methodName]) {
                        backupMethod = options.backupOverrides[methodName];
                    }

                    backupMethod.apply(null, [result]);
                    return result;
                });
        };
    };

    wrap('add');
    wrap('update');

    repo.wrap = wrap;

    return repo;
};
