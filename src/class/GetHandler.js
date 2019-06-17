import _ from 'lodash';
import api from '../hknews_config';
import HkClient from './HkClient';

let GetHandler = class {
    constructor() {
        this.hkClient = new HkClient();
    }
    makeLodashTemplate(obj) {
        const template = _.template,
            $target = document.getElementById("cards"),
            $template = document.getElementById("template"),
            compile = template($template.innerHTML);
        let html = compile(obj);

        $target.innerHTML = html;
    }
    writeHtml(data) {
        const html = {
            title: data.title,
            score: data.score,
            num_comments: data.descendants,
            link: data.url
        };
        this.makeLodashTemplate(html);
    }
    parseIndividual(res) {
        let data = JSON.parse(res);
        console.log(data);
        this.writeHtml(data);
    }
    // xxx
    parseAry(res) {
        let data = JSON.parse(res);
        this.hkClient.fetchJSON(api.INDIVIDUAL + data[0] + ".json", this.parseIndividual.bind(this));
        this.hkClient.fetchJSON(api.INDIVIDUAL + data[1] + ".json", this.parseIndividual.bind(this));
    }
    getData() {
        this.hkClient.fetchJSON(api.TOP500, this.parseAry.bind(this));
    }
};

export default GetHandler;
