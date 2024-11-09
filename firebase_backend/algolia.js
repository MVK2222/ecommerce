import * as algoliasearch from 'algoliasearch';
import * as algoliasearchFirebase from 'algoliasearch-firebase';

const algoliaClient = algoliasearch('3KBUWFHR1J', '065cdf95a60ffe22d46930a73594daa2');
const index = algoliaClient.initIndex('products');

export { index };