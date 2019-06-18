import _ from 'lodash';
import api from '../hknews_config';
import HkClient from './HkClient';

let GetHandler = class {
    constructor() {
        this.hkClient = new HkClient();
    }
    makeLodashTemplate(obj) {
        console.log(obj);
        const template = _.template,
            $target = document.getElementById("cards"),
            $template = document.getElementById("template"),
            compile = template($template.innerHTML);
        let testObj = {
            "url": obj.url,
            "num_comments": obj.num_comments,
            "score": obj.score,
            "title": obj.title
        };
        console.log(testObj);
        console.log(obj);
        let html = compile(obj);

        $target.innerHTML = html;
    }
    writeHtml(data) {
        const html = {
            "title": data.title,
            "score": data.score,
            "num_comments": data.descendants,
            "url": data.url
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
        let handler = () => {
            return new Promise((resolve, reject) => {
                let data = JSON.parse(res).slice(0, 10);// TOP10件を取得
                let callback = async (x) => {
                    let obj = {};
                    const promiseAry = await this.hkClient.fetchJSON(api.INDIVIDUAL + String(x) + ".json", (res) => {
                        let r = JSON.parse(res);
                        obj.url = r.url;
                        obj.num_comments = String(r.descendants);
                        obj.score = String(r.score);
                        obj.title = r.title;
                    });
                    console.log('finish fetchJSON!');
                    return obj;
                };

                let newAry = data.map(callback);
                resolve(newAry);
            });
        };
        let fetch = async () => {
            let ary = await handler();
            console.log(ary);
            console.log(ary[0].url);
            this.makeLodashTemplate(ary[0]);
        };
        fetch();
        /*
        handler.then((ary) => {
            console.log(ary);
            this.makeLodashTemplate(ary);
        });
        */

        // this.hkClient.fetchJSON(api.INDIVIDUAL + data[0] + ".json", this.parseIndividual.bind(this));
        // this.hkClient.fetchJSON(api.INDIVIDUAL + data[1] + ".json", this.parseIndividual.bind(this));
    }
    getData() {
        this.hkClient.fetchJSON(api.TOP500, this.parseAry.bind(this));
    }
};

export default GetHandler;
