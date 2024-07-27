import {
    getCountryName,
    xTimesAgo
} from "../ablibary.js";

export class ProxyList {
    constructor() {
        this.providerName = "ProxyList";
        this.providerURL = "https://www.proxy-list.download/";
        this.providerID = this.providerName.toLowerCase().replace(/\s/g, "-");
        this.lastUpdated = "";
        this.protocolList = ["http", "https", "socks4", "socks5"];
        this.countryList = ["all"];
        this.anonymityList = ["all", "elite", "anonymous", "transparent"];

        this.country = this.countryList[0];
        this.anonymity = this.anonymityList[0];
        this.protocol = this.protocolList[0];

        this.serverList = [];
    }

    renderUI() {
        var self = this;
        // render ui
        $('.provider').append( /*html*/ `
            <div class="${this.providerID} providerItem">
                <h3>${this.providerName}<a href="${this.providerURL}" target="__blank"><span class="material-icons">open_in_new</span></a></h3>
                <!--<h4>${this.lastUpdated}</h4>-->
                <select title="Country: " id="country" value="${this.country}">
                    ${this.countryList.map(country => `<option value="${country}">${getCountryName(country)}</option>`).join("")}
                </select>
                <select title="Anonymity: " id="anonymity" value="${this.anonymity}">
                    ${this.anonymityList.map(anonymity => `<option value="${anonymity}">${anonymity}</option>`).join("")}
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

            self.serverList = await self.getServerList({
                country: self.country,
                anonymity: self.anonymity,
                protocol: self.protocol
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
            $(`.${self.providerID} .serverList`).val(self.serverList.join("\n"));
            $(`.${self.providerID} .serverList`).toggle();
        });
    }

    async getServerList({
        country = "all",
        anonymity = "all",
        protocol = "http"
    } = {}) {
        try {
            const response = await fetch(`https://www.proxy-list.download/api/v1/get?type=${protocol}&${anonymity=="all"?'':`anon=${anonymity}&`}${country=="all"?'':`country=${country}`}`);
            const k = await response.text();
            const serverList = k.trim().split("\n");
            //remove empty lines
            return serverList.filter(function (el) {
                return el != "";
            });
        } catch (error) {
            return [];
        }
    }

    async getCountries() {
        return ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "EU", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"];
    }

    async getLastUpdateInfo() {
        return "no info found";
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
        var cList = await this.getCountries();
        this.countryList = [this.countryList, ...cList];

        // get last updated time
        var lastUpdate = await this.getLastUpdateInfo();
        this.lastUpdated = lastUpdate;

        this.renderUI();
    }
}