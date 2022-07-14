export default () => {
    if (__SERVER__ &&  __currentRequestUserAgent__.source.isMobile) {
        return true;
    }
    var userAgent = __SERVER__ ? __currentRequestUserAgent__.source : window.navigator.userAgent;
    if (userAgent && (
        userAgent.match(/Android/i) ||
        userAgent.match(/webOS/i) ||
        userAgent.match(/iPhone/i) ||
        userAgent.match(/iPad/i) ||
        userAgent.match(/iPod/i) ||
        userAgent.match(/BlackBerry/i) ||
        userAgent.match(/Windows Phone/i) ||
        userAgent.match(/Nokia/i)
    )) {
        return true;
    }
    if (!__SERVER__  && window && window.innerWidth < 800) {
        return true;
    }
    return false;
};