import { getCountryName, xTimesAgo } from "../ablibary.js";

export class BypassList {
    constructor() {
        this.providerName = "bypassList";
        this.providerID = this.providerName.toLowerCase().replace(/\s/g, "-");
        this.bypassList = [];
    }

    renderUI(self) {
        // render ui
        $('.bypassList').append(/*html*/`
            <div class="${self.providerID}">
                <textarea id="bypassList">${self.bypassList.join("\n")}</textarea>
                <br />
                <button>save</button>
                <div class="notification"></div>
            </div>
        `);

        // on change select
        $(document).on('change', `.${this.providerID} #bypassList`, function () {
            var value = $(this).val();
            self.bypassList = value.trim().split("\n");
            self.saveBypassList();
        });

        // on click button
        $(document).on('click', `.${this.providerID} button`, function () {
            self.saveBypassList();
            self.showNotification();
        });
    }

    showNotification(){
        var self = this;
        $(`.${this.providerID} .notification`).html(`
            Total found: ${self.bypassList.length} :<a href="#" class="bypassListBtn">items</a>
        `);
    }

    // saveUserProxyList(){
    //     chrome.runtime.sendMessage({
    //         type: 'bypassList',
    //         userProxyList: this.bypassList // send bypassList to background.js
    //     });
    // }

    async getUserProxyList(self){
        return new Promise((resolved, reject)=>{
            chrome.storage.local.get(['proxySetting'], function (result) {
                const data = JSON.parse(result?.proxySetting);
                if (result?.proxySetting) {
                    self.bypassList = data?.bypassList;
                    resolved(true);
                }
            });
        })
    }
    
    saveBypassList() {
        chrome.runtime.sendMessage({
            type: 'bypassList',
            bypassList: this.bypassList // send bypassList to background.js
        });
    }
    
    async init() {
        await this.getUserProxyList(this);
        this.renderUI(this);
    }
}