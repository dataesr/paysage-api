import BaseRepo from '../../commons/repositories/base.repo';

class CategoriesRepository extends BaseRepo {}

export default new CategoriesRepository({ collection: 'categories' });
