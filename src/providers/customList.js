import { getCountryName, xTimesAgo } from "../ablibary.js";

export class CustomList {
    constructor() {
        this.providerName = "customList";
        this.providerID = this.providerName.toLowerCase().replace(/\s/g, "-");
        this.serverList = [];
    }

    renderUI(self) {
        // render ui
        $('.customList').append(/*html*/`
            <div class="${self.providerID}">
                <textarea id="customList">${self.serverList.join("\n")}</textarea>
                <br />
                <div class="notification"></div>
                <button>Connect</button>
            </div>
        `);

        // on change select
        $(document).on('change', `.${this.providerID} #customList`, function () {
            var value = $(this).val();
            self.serverList = value.trim().split("\n");
            self.saveUserProxyList();
            self.showNotification(`Total: ${self.serverList.length} servers has been saved.`);

        });

        // on click button
        $(document).on('click', `.${this.providerID} button`, function () {
            if(self.serverList.length > 0){
                self.saveServerList();
                self.showNotification(`connecting... `);
            }else{
                self.showNotification("No server found");
            }
        });
    }

    showNotification(ms){
        $(`.${this.providerID} .notification`).html(ms);
    }

    saveUserProxyList(){
        chrome.runtime.sendMessage({
            type: 'userProxyList',
            userProxyList: this.serverList // send serverList to background.js
        });
    }

    async getUserProxyList(self){
        return new Promise((resolved, reject)=>{
            chrome.storage.local.get(['proxySetting'], function (result) {
                const data = JSON.parse(result?.proxySetting);
                if (result?.proxySetting) {
                    self.serverList = data?.userProxyList;
                    resolved(true);
                }
            });
        })
    }
    
    saveServerList() {
        chrome.runtime.sendMessage({
            type: 'connectServerList',
            serverList: this.serverList // send serverList to background.js
        });
    }
    
    async init() {
        await this.getUserProxyList(this);
        this.renderUI(this);
    }
}