import { getCountryName } from "../ablibary.js";

export class Proxyscrape {
    constructor() {
        this.providerName = "proxyscrape";
        this.providerURL = "https://proxyscrape.com/";
        this.providerID = this.providerName.toLowerCase().replace(/\s/g, "-");
        this.lastUpdated = "";
        this.protocolList = ["all", "http", "socks4", "socks5"];
        this.countryList = ["all"];
        this.anonymityList = ["all", "anonymous", "elite", "transparent"];
        this.SSLList = ["all", "yes", "no"];

        this.country = this.countryList[0];
        this.anonymity = this.anonymityList[0];
        this.protocol = this.protocolList[0];
        this.ssl = this.SSLList[0];

        this.serverList = [];
    }

    renderUI() {
        var self = this;
        // render ui
        $('.provider').append(/*html*/`
            <div class="${this.providerID} providerItem">
                <h3>${this.providerName}<a href="${this.providerURL}" target="__blank"><span class="material-icons">open_in_new</span></a></h3>
                <h4>${this.lastUpdated}</h4>
                <select title="Country: " id="country" value="${this.country}">
                    ${this.countryList.map(country => `<option value="${country}">${getCountryName(country)}</option>`).join("")}
                </select>
                <select title="Anonymity: " id="anonymity" value="${this.anonymity}">
                    ${this.anonymityList.map(anonymity => `<option value="${anonymity}">${anonymity}</option>`).join("")}
                </select>
                <select title="SSL: " id="ssl" value="${this.ssl}">
                    ${this.SSLList.map(ssl => `<option value="${ssl}">${ssl}</option>`).join("")}
                </select>
                <select title="protocol: " id="protocol" value="${this.protocol}">
                    ${this.protocolList.map(protocol => `<option value="${protocol}">${protocol}</option>`).join("")}
                </select>
                <div class="notification"></div>
                <textarea class="serverList"></textarea>
                <button>Connect</button>
            </div>`);

        // on change select
        $(document).on('change', `.${this.providerID} select`, async function () {
            self.country = $(`.${self.providerID} #country`).val();
            self.anonymity = $(`.${self.providerID} #anonymity`).val();
            self.protocol = $(`.${self.providerID} #protocol`).val();
            self.ssl = $(`.${self.providerID} #ssl`).val();

            self.serverList = await self.getServerList({
                country: self.country,
                anonymity: self.anonymity,
                protocol: self.protocol,
                ssl: self.ssl
            });
            $(`.${self.providerID} .serverList`).val(self.serverList.join("\n"));
            self.showNotification(`
                Total found: ${self.serverList.length} :<a href="#" class="serverListBtn">items</a>
            `);
        });

        // on click button
        $(document).on('click', `.${this.providerID} button`, function () {
            $(`.${self.providerID} .serverList`).hide();
            if(self.serverList.length > 0){
                self.saveServerList();
                self.showNotification(`connecting... `);
            }else{
                self.showNotification("No server found");
            }
        });

        $(document).on('click', `.${this.providerID} .serverListBtn`, function () {
            $(`.${self.providerID} .serverList`).toggle();
        });
    }

    async getServerList({country = "all", anonymity = "all", protocol = "all", ssl = "all"} = {}) {
        try {
            const response = await fetch(`https://api.proxyscrape.com/v2/?request=displayproxies&protocol=${protocol}&timeout=10000&country=${country}&ssl=${ssl}&anonymity=${anonymity}`);
            const k = await response.text();
            const serverList = k.trim().split("\n");
            return serverList.filter(function (el) {
                return el != "";
            });
        } catch (error) {
            return [];
        }
    }
    
    async getCountries() {
        try {
            var responseinfo = await fetch("https://api.proxyscrape.com/v2/?request=proxyinfo");
            var k = await responseinfo.json();
            return k.countries;
        } catch (error) {
            return [];
        }
    }

    async getLastUpdateInfo() {
        try {
            var responseinfo = await fetch("https://api.proxyscrape.com/v2/?request=proxyinfo");
            var k = await responseinfo.json();
            return k.last_updated;
        } catch (error) {
            return "";
        }
    }

    showNotification(ms){
        $(`.${this.providerID} .notification`).html(ms);
    }

    saveServerList() {
        chrome.runtime.sendMessage({
            type: 'connectServerList',
            serverList: this.serverList // send serverList to background.js
        });
    }

    async init() {
        // get countries list 
        var cList =  await this.getCountries();
        this.countryList = [this.countryList, ...cList];

        // get last updated time
        var lastUpdate = await this.getLastUpdateInfo();
        this.lastUpdated = lastUpdate;
        
        this.renderUI();
    }
}