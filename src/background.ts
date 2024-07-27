
// chrome listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "setProxy") {
        setProxy(request.proxy);
    }

    if (request.type === "disableProxy") {
        disableProxy();
    }
});


function setProxy(proxy: {host: string, port: string, bypassList: string[]}) {
    chrome.proxy.settings.set({
        scope: 'regular',
        value: {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    // scheme: "http",
                    host: proxy.host,
                    port: parseInt(proxy.port),
                },
                // bypassList: this.bypassList
            }
        },
    }, () => {
        console.log("set proxy");
    });
}


function disableProxy() {
    chrome.proxy.settings.clear({
        scope: "regular"
    }, () => {
        // this.setIconAndBadge({
        //     icon: "logo128",
        // });
        // this.connectedServerInfo = null;
        // this.isConnected = "notConnected";
        // this.saveServerInfo();
    });
}

