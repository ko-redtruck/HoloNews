function request(zome,fn,data,resultFn) {
    console.log("calling: " + fn+" with "+JSON.stringify(data));
    $.post(
        "/fn/"+zome+"/"+fn,
        data,
        function(response) {
            console.log("response: " + response);
            resultFn(response);
        }
    ).fail(function(response) {
        console.log("response failed: " + response.responseText);
    })
    ;
};
