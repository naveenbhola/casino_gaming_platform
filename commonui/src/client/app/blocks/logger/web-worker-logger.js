(function(){
    let url = "";

    function setUrl(msg){
        url = msg;
    }

    function log(msg){
        let req = new XMLHttpRequest();

        req.open('PUT', url, false);

        req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                postMessage(JSON.stringify({type: "ajax", msg: "success"}));
            }else{
                postMessage(JSON.stringify({type: "ajax", msg: "error"}));
            }
        };
        req.send(msg);
    }

    function bindEvents(){
        onmessage = function(msg){
            let result = JSON.parse(msg.data);
            if(result.type === "set"){
                setUrl(result.url);
            }else if(result.type === "ajax"){
                log(result.data);
            }
        }
    }

    bindEvents();
})();