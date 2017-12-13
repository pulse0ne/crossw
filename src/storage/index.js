import { localStorageProxy } from '../utils';

export default {
    saves: localStorageProxy('cw-save-data'),
    last: localStorageProxy('cw-last-played'),
    completed: localStorageProxy('cw-completed')
};
