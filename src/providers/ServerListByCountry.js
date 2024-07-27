import {
    Countries,
    Regions
} from "../countries/countriesInfo.js";
import { Freeproxyupdate } from "./Freeproxyupdate.js";

import {
    Geonode
} from "./Geonode.js";
import { Proxyhub } from "./Proxyhub.js";
import {
    ProxyList
} from "./ProxyList.js";
import {
    Proxyscrape
} from "./Proxyscrape.js";



export class ServerListByCountry {
    constructor() {
        this.providerName = "ServerListByCountry";
        this.providerID = this.providerName.toLowerCase().replace(/\s/g, "-");
        this.serverList = [];
        this.countryList = [];
    }

    renderUI() {
        var self = this;

        // country item
        const countryItem = (item) => {
            return `<div class="contryitem" contrycode="${item.code}">
                        <div class="info">
                            <img src="https://countryflagsapi.com/png/${item.code}">
                            <span>${item.name}</span>
                        </div>
                        <div class="actionSection">
                            <a href="#" class="connectThisCountry" contrycode="${item.code}">Connect</a>
                        </div>
                    </div>`;
        }
        
        // filter country list by country list on this.countryList    
        var FliterdCountryList = Countries.filter(item => {
            return this.countryList.includes(item.code);
        });

        // country list by region
        const countryList = (regionCode) => {
            var countryList = FliterdCountryList.filter(e => e.region === regionCode);
            var list = countryList.map(item => countryItem(item));
            return list.length > 0 ? list.join("") : "country server not found";
        }

        // region list
        var regions = Regions.map(function (e) {
            return `<div class="regionsitem">
                <a href="#" class="regionsitemLable">${e.name}</a>
                <div class="countrylist">
                    ${countryList(e.code)}
                </div>
            </div>`;
        }).join("");

        // render ui
        $('.countrySelect').html(`
            <input type="text" id="countrySearch" placeholder="search"/>
            <div class="${this.providerID}">${regions}</div>
        `);

        // toggle slide down fast
        $(document).on("click", `.${this.providerID} .regionsitemLable`, function () {
            $(this).parent().find('.countrylist').slideToggle("fast");
        });

        // search
        $(`.countrySelect #countrySearch`).keyup(function () {
            var search = $(this).val().toLowerCase();
            var countryList = Countries.filter(e => e.name.toLowerCase().includes(search));
            var countryListHTML = countryList.map((e) => countryItem(e)).join("");
            if (search == "") {
                $(`.${self.providerID}`).html(regions);
            } else if (countryList.length == 0) {
                $(`.${self.providerID}`).html(`<div class="notfound">No results found</div>`);
            } else {
                $(`.${self.providerID}`).html(countryListHTML);
            }
        });

        // on select country
        $(document).on("click", `.${this.providerID} .contryitem`, function () {
            //mark selected country
            $(`.${self.providerID} .contryitem`).removeClass("selected");
            $(this).addClass("selected"); // get country code

            // show contryitem .actionSection
            $(`.${self.providerID} .contryitem .actionSection`).hide();
            $(this).find('.actionSection').show();
        });

        // on click connect button
        $(document).on("click", `.${this.providerID} .connectThisCountry`, async function () {
            var countryCode = $(this).attr("contrycode");

            //show loading on actionSection
            var parrentElement = $(this).parent();
            parrentElement.html(`loading...`);
            console.log(countryCode);
            var serverList = await self.getServerList({
                country: countryCode
            });

            // if found server list
            if (serverList.length > 0) {
                // show total found
                parrentElement.html(` Total found: ${serverList.length} Connectiong...`);
                // save server list
                self.serverList = serverList;
                self.saveServerList();
            } else {
                parrentElement.html(`No server found`);
            }



        });
    }

    async getServerList({
        country = "US",
        anonymity = "all",
        protocol = "http"
    } = {}) {
        var proxyscrape = await new Proxyscrape().getServerList({
            country,
            anonymity,
            protocol
        });
        var proxyList = await new ProxyList().getServerList({
            country,
            anonymity,
            protocol
        });
        var freeproxyupdate = await new Freeproxyupdate().getServerList({
            country,
            anonymity,
            protocol
        });
        var proxyhub = await new Proxyhub().getServerList({
            country,
            anonymity,
            protocol
        });
        // var geonode = await new Geonode().getServerList();

        // merge all server list
        return [...proxyscrape, ...proxyList, ...freeproxyupdate, ...proxyhub];
    }

    async getCountries() {
        var proxyscrape = await new Proxyscrape().getCountries();
        var proxyhub = await new Proxyhub().getCountries();
        var freeproxyupdate = await new Freeproxyupdate().getCountries();

        // merge all server list
        return [...proxyscrape, ...freeproxyupdate, ...proxyhub];
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

        // render ui
        this.renderUI();
    }
}