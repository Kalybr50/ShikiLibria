// ==UserScript==
// @name         ShikiLibria
// @namespace    ShikiLibria
// @version      1.0.0
// @description  Adds a "Shikimori" button to the top of the Anilibria video player. Click the button to open Shikimori with the anime you're currently viewing on Anilibria, providing instant access to the corresponding anime page.
// @author       Kalybr50
// @match        *://*.anilibria.tv/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilibria.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function makeApiRequest(animeName) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://shikimori.one/api/animes?search=` + animeName;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const animeUrl = data[0].url;
                        console.log("Anime URL:", animeUrl);
                        resolve(animeUrl);
                    } else {
                        console.error("Anime not found");
                        reject("Anime not found");
                    }
                })
                .catch(error => {
                    console.error("Error making API request:", error);
                    reject(error);
                });
        });
    }

    var newButtonElement = document.createElement("button");
    newButtonElement.textContent = "Shikimori";

    var tabContentElement = document.querySelector('.tab-content');

    if (tabContentElement) {
        tabContentElement.appendChild(newButtonElement);

        newButtonElement.addEventListener('click', function() {
            var releaseTitleElement = document.querySelector('.release-title');

            if (releaseTitleElement) {
                var animeTitle = releaseTitleElement.textContent.trim();

                console.log(animeTitle);
            } else {
                console.log("Элемент с классом 'release-title' не найден.");
            }
            makeApiRequest(animeTitle)
                .then(animeUrl => {
                window.open('https://shikimori.one' + animeUrl, '_blank');
            })
                .catch(error => {
                console.error("Error:", error);
                window.open('https://shikimori.one/animes?search=' + animeTitle, '_blank');
            });
        });
    }
})();