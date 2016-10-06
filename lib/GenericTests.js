const IRepository = require('./IRepository');
const expect = require('expect');

const client = {
  name: 'foo'
};

const GenericTests = repo => {
  return {
    checkInterface: () => {
      describe('should implement the IRepository Interface', () => {
        let methods = [
          'findAll',
          'findOne',
          'add',
          'remove',
          'update'
        ];
        it('should be a repository', () => {
          expect(repo instanceof IRepository);
        });
        for (let meth of methods) {
          it(`should ${meth}`, () => {
            expect(typeof repo[meth]).toBe('function', `IRepository method: ${meth} is missing.`);
          });
        }
      });
    },
    implementation: () => {
      describe('implementation', () => {
        let id;

        it('should create', done => {
          repo.add(client, (err, res) => {
            expect(res).toExist();
            expect(res._id).toExist();
            id = res._id;
            expect(res.name).toBe(client.name);
            done();
          });
        });

        it('should findAll', done => {
          repo.findAll((err, res) => {
            expect(res).toExist();
            expect(res[0].name).toBe(client.name);
            done();
          });
        });

        it('should findOne', done => {
          repo.findOne(id, (err, res) => {
            expect(res).toExist();
            expect(res.name).toBe(client.name);
            done();
          });
        });

        it('should update', done => {
          repo.update({_id: id, name: 'baz'}, (err, res) => {
            expect(res).toExist();
            expect(res.name).toBe('baz');
            done();
          });
        });

        it('should remove', done => {
          repo.remove(id, (err, res) => {
            expect(res).toExist();
            expect(res.name).toBe('baz');
            repo.findOne(id, (err, res) => {
              expect(res).toNotExist();
              done();
            });
          });
        });
      });
    }
  };
};

module.exports = GenericTests;
