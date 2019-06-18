import _ from 'lodash';
import api from '../hknews_config';

let GetHandler = class {
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

    async getData(url) {
        console.log("1. WAITING FOR CALL ASYNCH FUNCTION WILL RESOLVE");
        let res = await this.fetchJSON(url);

        console.log("4. INVOKE AFTER FUNCTION. THIS TIME, ASYNCH FUNC WAS ALREADY RESOLVED");
        console.log(res);
        let top_1 = res[0];
        let obj = await this.fetchJSON(api.INDIVIDUAL + top_1 + ".json");
        this.writeHtml(obj);
        //
    }

    fetchJSON(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();

            console.log("2. INVOKE ASYNCH PROCESS");
            request.open("GET", url);
            request.onreadystatechange = function() {
                if(request.readyState === 4 && request.status === 200) {
                    let type = request.getResponseHeader("Content-Type");
                    if(_.includes(type, "application/json")) {
                        console.log("3. RESOLVE ASYNCH FUNCTION");
                        let res = JSON.parse(request.responseText);
                        resolve(res);
                    }else{
                        console.log("error: ", "Content-Type is nod 'application/json'");
                        console.log(`Content-Tyep: ${type}`);
                    }
                }
            };
            console.log("FETCH JSON");
            request.send(null);
        });
    }
};

export default GetHandler;
