import GetHandler from './class/GetHandler';
import api from './hknews_config';

const getHandler = new GetHandler();
getHandler.getData(api.TOP500);

