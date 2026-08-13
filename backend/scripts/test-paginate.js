(async () => {
  try {
    const { RepositoryFactory } = require('../dist/repositories/repository-factory.js');
    const userRepo = RepositoryFactory.getUserRepository();

    const options = {
      page: 1,
      limit: 10,
      filters: { OR: [ { displayName: { contains: 'a' } }, { email: { contains: 'a' } } ] },
      sort: 'createdAt',
      order: 'desc',
    };

    const res = await userRepo.paginate(options);
    console.log('paginate ok', res);
  } catch (err) {
    console.error('paginate error', err && err.message ? err.message : err, err);
  } finally {
    process.exit(0);
  }
})();
