function setCookie(cname, cvalue, exdays, path) {

    path   = path || "/"
    exdays = exdays || 365;

    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=" + path;

}

function getCookie(cname) {

    var name = cname + "=";
    var ca   = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }

    return "";

}

function getScrollBarWidth(){
    
    var result = 0;
    var div = document.createElement("div");
        
    div.style.overflow = "scroll";

    document.body.appendChild(div);

    result = div.offsetHeight;

    div.parentNode.removeChild(div);

    return result;
    
};