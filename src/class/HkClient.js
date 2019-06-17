
let HkClient = class {
    fetchJSON(url, callback) {
        let request = new XMLHttpRequest();

        request.open("GET", url);
        request.onreadystatechange = function() {
            if(request.readyState === 4 && request.status === 200) {
                let type = request.getResponseHeader("Content-Type");
                if(_.includes(type, "application/json")) {
                    callback(request.responseText);
                }else{
                    console.log("error: ", "Content-Type is nod 'application/json'");
                    console.log(`Content-Tyep: ${type}`);
                }
            }
        };
        request.send(null);
    }
};

export default HkClient;
