import _ from 'lodash';
import api from '../hknews_config';

let GetHandler = class {
    makeLodashTemplate(ary) {
        console.log(ary[9].id);
        const template = _.template,
            $target = document.getElementById("cards"),
            $template = document.getElementById("template"),
            compile = template($template.innerHTML);
        let html = compile({
            data: ary
        });

        $target.innerHTML = html;
    }

    async getData(url="") {
        console.log("1. FETCH JSON");
        url = url || api.TOP500;
        let res = await this.fetchJSON(url);

        let top_10 = res.slice(0, 10);

        /*
        mapで回す時に Promise.all を使用して全てのPromiseオブジェクトのresolveを待機
        ref:
            https://tech-1natsu.hatenablog.com/entry/2017/12/09/012717,
            http://2ality.com/2016/10/async-function-tips.html#arrayprototypemap
         */
        let asyncFetch = async (ids) => {
            let fetchAry = ids.map(async (id) => {
                let object = await this.fetchJSON(api.INDIVIDUAL + id + ".json");
                return object
            });
            console.log(fetchAry);// fetchAry is bunch of Promise Obj.
            return Promise.all(fetchAry);
        };
        let newAry = await asyncFetch(top_10);
        console.log(newAry);
        this.makeLodashTemplate(newAry);
    }

    fetchJSON(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();

            console.log("2. INVOKE ASYNC PROCESS");
            request.open("GET", url);
            request.onreadystatechange = function() {
                if(request.readyState === 4 && request.status === 200) {
                    let type = request.getResponseHeader("Content-Type");
                    if(_.includes(type, "application/json")) {
                        console.log("3. RESOLVE ASYNC FUNCTION");
                        let res = JSON.parse(request.responseText);
                        resolve(res);
                    }else{
                        console.log("error: ", "Content-Type is nod 'application/json'");
                        console.log(`Content-Tyep: ${type}`);
                    }
                }
            };
            console.log("1. FETCH JSON");
            request.send(null);
        });
    }
};

export default GetHandler;
