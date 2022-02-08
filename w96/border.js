//!wrt $BSPEC:{"icn":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoUlEQVQ4Ed1Puw2DMBB9IzBCxkFxCvahQUfBCAyQkqEoKSlTJrK4g6c7fnUsWff8frYBXQny5W387cnhjG8HzfiHBf5L+fyE9PblMPcCB9w7hDPhzWxKkJF11lZ8ZbjS6QVtvbYS4IIXpCNpgWYIghKm6xyCT4UpCDsFJZpH8OWCQBLBLyB6g2cFHD70ecGH7Lxd6VCFpmAqQT4W0jmzbvgHE7moTscCW+cAAAAASUVORK5CYII=","cpr":"WeDontCareInc","dsc":"A simple yet customisable multi tab browser !","frn":"Test App","ver":1}

const icon16 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoUlEQVQ4Ed1Puw2DMBB9IzBCxkFxCvahQUfBCAyQkqEoKSlTJrK4g6c7fnUsWff8frYBXQny5W387cnhjG8HzfiHBf5L+fyE9PblMPcCB9w7hDPhzWxKkJF11lZ8ZbjS6QVtvbYS4IIXpCNpgWYIghKm6xyCT4UpCDsFJZpH8OWCQBLBLyB6g2cFHD70ecGH7Lxd6VCFpmAqQT4W0jmzbvgHE7moTscCW+cAAAAASUVORK5CYII=";
const icon32 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABlklEQVRYCe1WO04DMRB9JQUFBQUHoOAYKSI+Nkgp6TgADSWl4+UGHICSI1BSpuQAFByBMgUFyGIHjTfPs/FqUyBtpGjGb96bN5poswbIxyN+sy+h7gZi5gnbjRvpOg0wbWDawL/ZgMfDjcNy5RA/HOKLQ3NJnup6qG8DpbrGHcJRvXOr0I3yPMzzM//LFk7azKAhpMEYcdAQYxjrHqcIJ1Wb0GKWnyEcdxt6xDXjCtblm2cRkfhpCa0hZgh7ljarEeN0P1hnpMKhoE3694JkE2ZNNlkcYVrBuIKgIpBYsz6P+Cq6biRWHOoIvziLow7NbUf/d73jCoLqBqRsQhcIC63XuSnUxUGitkF6P2i9zrWHmYtohrBvEknRIz6LvhsJnUMi5FUbFS2LtlJVk9ihWSlo65QZt9hTVZOtyYroER9LAyhaf5qa9LNyxhXCYcm8up9HpM++RzPPbX9PHsu30cxTS49QMGpMIzbEOcI1G3oQtkA4YCYlzCHeDzKyROnnKRlqvOb9YfnRmke802Y6Z5cV2qQFfwBqglSf+VjzvwAAAABJRU5ErkJggg==";

class Border extends WApplication {
  constructor() {
    super();
  }

  async main(argv) {
    super.main(argv);

    const isConfigFileExisting = await w96.FS.exists(
      "c:/user/appdata/Border/config.json"
    );
    const isBookmarksFileExisting = await w96.FS.exists(
      "c:/user/appdata/Border/bookmarks.json"
    );
    const isConfigFolderExisting = await w96.FS.exists(
      "c:/user/appdata/Border"
    );

    // creating default config file
    if (!isConfigFolderExisting) {
      await w96.FS.mkdir("c:/user/appdata/Border");
      await w96.FS.writestr(
        "c:/user/appdata/Border/.meta",
        JSON.stringify({
          description:
            "This is the Border's Data folder.\n\nIt's unsafe to edit files here if you don't know what you do !\n\nUse the Border Setup Program instead !",
        })
      );
    }
    if (!isBookmarksFileExisting) {
      await w96.FS.writestr(
        "c:/user/appdata/Border/bookmarks.json",
        JSON.stringify([])
      );
    }
    if (!isConfigFileExisting) {
      await w96.FS.writestr(
        "c:/user/appdata/Border/config.json",
        JSON.stringify({
          theme: {
            primary: "#4b0082",
            secondary: "#ffffff",
          },
          window: {
            height: 480,
            width: 640,
          },
          browser: {
            defaultPage: "border://newtab",
            enableShortcuts: true,
          },
        })
      );

      await createSetupWnd();
    } else {
      let configJSON = JSON.parse(
        await w96.FS.readstr("c:/user/appdata/Border/config.json")
      );
      let bookmarksJSON = JSON.parse(
        await w96.FS.readstr("c:/user/appdata/Border/bookmarks.json")
      );

      // Border main window
      const wnd = this.createWindow(
        {
          title: "Border",
          body: `
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');

            :root {
                --border-primary: indigo;
                --border-secondary: #fff;
            }
            
            #border-root>* {
                padding: 0;
                margin: 0;
                -webkit-box-sizing: border-box;
                        box-sizing: border-box;
            }
            
            #border-root {
                width: 100%;
                height: 100vh;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                        flex-direction: column;
                font-family: 'Lexend', sans-serif;
            }
            
            #border-menu,
            #border-tab-menu {
                width: 100%;
                height: 60px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                background: var(--border-primary);
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
            }
            
            #border-tab-menu {
                background: var(--border-secondary);
            }

            #border-tab-container::-webkit-scrollbar {
              display: none;
            }
            
            #border-tab-container {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                height: 100%;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                -ms-overflow-style: none; /* IE 11 */
                    overflow: auto;
                scrollbar-width: none; /* Firefox 64 */
            }
            
            .border-tab {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                color: var(--border-secondary);
                -webkit-box-pack: space-evenly;
                    -ms-flex-pack: space-evenly;
                        justify-content: space-evenly;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                width: 150px;
                min-width: 200px;
                border-radius: 20px;
                height: 80%;
                margin: 15px 10px;
                background: var(--border-primary);
                -webkit-transition: all 0.2s ease;
                -o-transition: all 0.2s ease;
                transition: all 0.2s ease;
                overflow: hidden;
            }
            .border-view {
                display: none;
            }
            
            #border-add-button {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                color: var(--border-secondary);
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                border-radius: 50px;
                min-height: 40px;
                min-width: 40px;
                margin: 15px 10px;
                background: var(--border-primary);
            }
            #border-add-button>h2 {
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
            }
            #border-search-button, .border-history-btn {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                color: var(--border-primary);
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                border-radius: 50px;
                min-height: 35px;
                min-width: 35px;
                margin: 15px 10px;
                background: var(--border-secondary);
            }
            
            .border-tab.border-current {
                border-radius: 20px 20px 0 0;
                margin: 11px 10px 0;
            }
            .border-view.border-current {
                display: block;
            }
            
            #border-searchbar {
                border: none;
                margin: 10px;
                padding: 10px;
                width: 100%;
                border-radius: 999px;
                color: var(--border-primary);
                background: var(--border-secondary);
            }
            
            #border-view-container, .border-view {
                width: 100%;
                height: 100%;
                border: none;
                background: var(--border-primary);
            }
            .border-title, .border-close-btn, #border-search-button, #border-add-button, .border-history-btn {
                cursor: pointer;
            }
            .border-title, .border-close-btn, #border-search-button, #border-add-button, .border-history-btn, #border-searchbar {
                font-size: 15px;
            }
            </style>
            <div class="appbar"></div>
            <div id="border-root">
                <div id="border-tab-menu">
                    <div id="border-tab-container">

                    </div>
                    <div id="border-add-button">+</div>
                </div>

                <div id="border-menu">
                    <div class="border-history-btn"><</div>
                    <div class="border-history-btn">></div>
                    <div class="border-history-btn">↺</div>
                    <input id="border-searchbar">

                    </input>
                    <div id="border-search-button">⇾</div>
                </div>
                <div id="border-view-container">

                </div>
            </div>
            `,
          initialHeight: configJSON.window.height,
          initialWidth: configJSON.window.width,
          taskbar: true,
          icon: icon16,
        },
        true
      );

      const body = wnd.getBodyContainer();

      let browser = {
        cfg: {
          tabNb: 0,
          tabId: [],
          version: "1.6.1",
        },
        protocols: {
          newtab: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Tab</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
                </head>
                <body style="width: 100vw; height: 100vh; display: flex; justify-content: flex-start; align-items: center; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 50px; color: white;">
                            <div id="centered" style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                                <img src="data:image/png;base64,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">
                                <div display: flex; justify-content: flex-start; align-items: center;>
                                    <h1>Welcome to Border !</h1>
                                    <p>
                                        For searching just type it in the search bar and click the arrow button.
                                    </p>
                                </div>
                            </div>
                </body>
                </html>
                `,
          changelog: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Tab</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
                </head>
                <body style="width: 100vw; height: 100vh; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 50px; color: white;">
                            
                            <h1>Border v1.6.1 changelog.</h1>
                            <ul>
                                <li>Border is now in 2022 !</li>
                                <li>Added a bookmark system</li>
                                <li>Updated the code for v3 API</li>
                                <li>You can now browse your files from Border with the "file://" protocol !</li>
                            </ul>
        
                            <p style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)">Border v1.6.1 | © Onofficiel - 2022 - All rights reserved</p>
                </body>
                </html>
                `,
          about: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Tab</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
                </head>
                <body style="width: 100vw; height: 100vh; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 50px; color: white;">
                            
                            <h1>About Border.</h1>
                            <p>
                            Border is an iframe Web browser developped by <a style="color: white;" href="github.com/Onofficiel">Onofficiel</a><br> accessible on all platforms.<br>Because of the iframe system some website won't work in this browser (like Google.com),<br>but you can always use bing.
                            <br><br>Thanks to <a style="color: white;" href="https://billygoat891.tk">billygoat891</a> for hosting the project on windows96.
                            </p>
        
                            <p style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)">Border v1.6.1 | © Onofficiel - 2022 - All rights reserved</p>
                </body>
                </html>
                `,
          404: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>404</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
                </head>
                <body style="width: 100vw; height: 100vh; display: flex; justify-content: flex-start; align-items: center; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 50px; color: white; background: rgb(247, 37, 58)">
                            <div id="centered">
                                <h1>404</h1>
                                <p>
                                    Not found.
                                </p>
                            </div>
                </body>
                </html>
                `,
          woozy: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Wooooooooooooooooooooooooozy</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
                </head>
                <body style="width: 100vw; height: 100vh; display: flex; justify-content: flex-start; align-items: center; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 50px; color: white; background: rgb(255, 204, 77)">
                            <div id="centered">
                                <img src="https://hotemoji.com/images/dl/t/woozy-face-emoji-by-twitter.png">
                            </div>
                </body>
                </html>
                `,
        },
        keybinds: [
          {
            keys: ["Alt", "t"],
            description: "Open a new tab",
            exec: () => {
              browser.addTab({ current: true });
            },
          },
          {
            keys: ["Alt", "w"],
            description: "Close the current tab",
            exec: () => {
              browser.removeTab(
                body.querySelector(".border-tab.border-current").dataset.id
              );
            },
          },
          {
            keys: ["Alt", "a"],
            description: "Open an about tab",
            exec: () => {
              browser.addTab({ current: true, url: "border://about" });
            },
          },
        ],
        verifyProtocol: (url) => {
          console.log(url);
          if (/^\S*:/i.test(url)) {
            for (let i = 0; i < Object.keys(browser.protocols).length; i++) {
              const protocol = Object.keys(browser.protocols)[i];

              if (RegExp("^border:/*" + protocol).test(url)) {
                return [
                  encodeURI("data:text/html," + browser.protocols[protocol]),
                  protocol,
                ];
              } else if (url.startsWith("file://")) {
                return [
                  encodeURI("https://rel3.windows96.net/_/" + url.substring(7)),
                  url.substring(7),
                ];
              }
            }
            return [url, false];
          } else {
            return ["https://" + url, false];
          }
        },
        addTab: (tab) => {
          if (!tab)
            throw new Error("You have to add an object for creating a tab.");
          if (!tab.url) tab.url = configJSON.browser.defaultPage;

          // Create an html tab div
          let tabElement = document.createElement("div");
          tabElement.classList.add("border-tab");
          tabElement.dataset.id = browser.generateId();
          tabElement.dataset.url = tab.url;
          tabElement.innerHTML =
            "<div class='border-title'>Name Undefined</div><div class='border-close-btn'>×</div>";

          tabElement.addEventListener("click", () => {
            browser.setCurrent(tabElement.dataset.id);
          });

          tabElement
            .querySelector(".border-close-btn")
            .addEventListener("click", () => {
              browser.removeTab(tabElement.dataset.id);
            });

          body.querySelector("#border-tab-container").appendChild(tabElement);
          // <

          // Create an html view tab
          let viewElement = document.createElement("iframe");
          viewElement.classList.add("border-view");
          viewElement.dataset.id = tabElement.dataset.id;

          body.querySelector("#border-view-container").appendChild(viewElement);
          // <

          // After Ctreated Action
          if (tab.current) browser.setCurrent(tabElement.dataset.id);
          browser.reloadTab();
          // <

          browser.cfg.tabNb++;
          browser.cfg.tabId.push(tabElement.dataset.id);
        },
        setCurrent: (id) => {
          try {
            for (let tab of body
              .querySelector("#border-tab-container")
              .querySelectorAll(".border-tab")) {
              tab.classList.remove("border-current");
            }
            body
              .querySelector('.border-tab[data-id~="' + id + '"]')
              .classList.add("border-current");

            for (let view of body
              .querySelector("#border-view-container")
              .querySelectorAll(".border-view")) {
              view.classList.remove("border-current");
            }
            body
              .querySelector('.border-view[data-id~="' + id + '"]')
              .classList.add("border-current");

            body.querySelector("#border-searchbar").value = body.querySelector(
              ".border-tab.border-current"
            ).dataset.url;
          } catch {}
        },
        removeTab: (id) => {
          if (!id) throw new Error("Specify a correct ID");

          browser.cfg.tabNb--;
          browser.cfg.tabId.splice(browser.cfg.tabId.indexOf(id), 1);

          body
            .querySelector("#border-tab-container")
            .removeChild(
              body.querySelector('.border-tab[data-id~="' + id + '"]')
            );
          body
            .querySelector("#border-view-container")
            .removeChild(
              body.querySelector('.border-view[data-id~="' + id + '"]')
            );
        },
        reloadTab: () => {
          body.querySelector("#border-searchbar").value = body.querySelector(
            ".border-tab.border-current"
          ).dataset.url;
          body
            .querySelector("#border-view-container")
            .querySelector(".border-view.border-current").src =
            browser.verifyProtocol(
              body
                .querySelector("#border-tab-container")
                .querySelector(".border-tab.border-current").dataset.url
            )[0];
          body.querySelector("#border-searchbar").blur();

          if (
            browser.verifyProtocol(
              body.querySelector(".border-tab.border-current").dataset.url
            )[1]
          ) {
            body
              .querySelector(".border-tab.border-current")
              .querySelector(".border-title").innerText =
              browser.verifyProtocol(
                body.querySelector(".border-tab.border-current").dataset.url
              )[1];
          } else
            body
              .querySelector(".border-tab.border-current")
              .querySelector(".border-title").innerText = browser
              .verifyProtocol(
                body.querySelector(".border-tab.border-current").dataset.url
              )[0]
              .split("/")[2];
        },
        generateId: () => {
          let id = "";
          for (let i = 0; i < 4; i++) {
            id += Math.floor(Math.random() * 10);
          }

          if (browser.cfg.tabId.length >= 9999)
            throw new Error("Cannot generate ID");
          for (const tabId in browser.cfg.tabId) {
            if (tabId === id) return browser.generateId();
          }
          return parseInt(id);
        },
        boot: () => {
          document
            .querySelector(":root")
            .style.setProperty("--border-primary", configJSON.theme.primary);
          document
            .querySelector(":root")
            .style.setProperty(
              "--border-secondary",
              configJSON.theme.secondary
            );

          let h = body.querySelectorAll(".border-history-btn");

          h[0].addEventListener("click", () => {
            window.history.back();
            browser.reloadTab();
          });
          h[1].addEventListener("click", () => {
            window.history.forward();
            browser.reloadTab();
          });
          h[2].addEventListener(
            "click",
            () =>
              (body.querySelector(".border-view.border-current").src =
                body.querySelector(".border-view.border-current").src)
          );

          body
            .querySelector("#border-add-button")
            .addEventListener("click", () => browser.addTab({ current: true }));
          body
            .querySelector("#border-search-button")
            .addEventListener("click", () => {
              body.querySelector(".border-tab.border-current").dataset.url =
                body.querySelector("#border-searchbar").value;
              browser.reloadTab();
            });

          if (argv[1])
            browser.addTab({
              url: browser.verifyProtocol(argv[1])[0],
              current: true,
            });
          else browser.addTab({ current: true });

          body
            .querySelector("#border-searchbar")
            .addEventListener("keyup", (event) => {
              if (event.key === "Enter") {
                body.querySelector(".border-tab.border-current").dataset.url =
                  body.querySelector("#border-searchbar").value;
                browser.reloadTab();
              }
            });

          setInterval(() => {
            if (
              body
                .querySelector("#border-tab-container")
                .querySelectorAll(".border-tab").length <= 0
            )
              wnd.close();

            if (!body.querySelector(".border-tab.border-current")) {
              browser.setCurrent(browser.cfg.tabId[0]);
            }
          }, 10);

          if (configJSON.browser.enableShortcuts) {
            for (const keybind in browser.keybinds) {
              if (Object.hasOwnProperty.call(browser.keybinds, keybind)) {
                const cKeybind = browser.keybinds[keybind];

                cKeybind.keys.reverse();

                let status = [];

                for (const key in cKeybind.keys) {
                  if (Object.hasOwnProperty.call(cKeybind.keys, key)) {
                    const cKey = cKeybind.keys[key];

                    status.push(false);

                    window.addEventListener("keydown", (e) => {
                      if (e.key.toLowerCase() === cKey.toLowerCase()) {
                        status[key] = true;
                      } else status[key] = false;

                      let i = 0;
                      for (let stat in status) {
                        if (status[stat]) i++;

                        if (i >= status.length) {
                          e.preventDefault();
                          cKeybind.exec();
                        }
                      }
                    });
                  }
                }
              }
            }
          }
        },
      };
      browser.boot();

      const appbar = new w96.ui.MenuBar();

      await appbar.addRoot("File", [
        {
          type: "normal",
          label: "New Tab",
          onclick: () => {
            browser.addTab({ current: true });
          },
        },
        {
          type: "normal",
          label: "Close Current Tab",
          onclick: () => {
            browser.removeTab(
              body.querySelector(".border-tab.border-current").dataset.id
            );
          },
        },
        {
          type: "separator",
        },
        {
          type: "normal",
          label: "Restart",
          onclick: () => {
            wnd.close();
            w96.sys.execCmd("border");
          },
        },
        {
          type: "normal",
          label: "Exit",
          onclick: () => wnd.close(),
        },
      ]);

      appbar.addRoot("View", [
        {
          type: "normal",
          label: "Reload",
          onclick: () => {
            browser.reloadTab();
          },
        },
        {
          type: "separator",
        },
        {
          type: "normal",
          label: "Back",
          onclick: () => {
            window.history.back();
          },
        },
        {
          type: "normal",
          label: "Forward",
          onclick: () => {
            window.history.forward();
          },
        },
      ]);

      appbar.addRoot("Tools", [
        {
          type: "normal",
          label: "Edit Config",
          onclick: async () => {
            await createSetupWnd();
            wnd.close();
          },
        },
        {
          type: "normal",
          label: "Create Shortcut",
          onclick: () => {
            w96.shell.mkShortcut(
              "c:/user/desktop/" +
                browser
                  .verifyProtocol(
                    body.querySelector(".border-tab.border-current").dataset.url
                  )[0]
                  .split("/")[2] +
                ".link",
              icon32,
              "border " +
                body.querySelector(".border-tab.border-current").dataset.url
            );
          },
        },
        {
          type: "normal",
          label: "Add This Site To Bookmarks",
          onclick: async () => {
            bookmarksJSON.push({
              name: browser.verifyProtocol(
                body.querySelector(".border-tab.border-current").dataset.url
              )[0],
              url: browser.verifyProtocol(
                body.querySelector(".border-tab.border-current").dataset.url
              )[0],
            });
            await w96.FS.writestr(
              "c:/user/appdata/Border/bookmarks.json",
              JSON.stringify(bookmarksJSON)
            );
            alert("Restart Border to access the bookmark");
          },
        },
      ]);

      appbar.addRoot("Help", [
        {
          type: "normal",
          label: "About",
          onclick: () =>
            w96.ui.MsgBoxSimple.info(
              "About Border for Windows 96",
              '<span class="bold-noaa">Border</span><br>Version ' +
                browser.cfg.version +
                '<br><br>Powered by <a href="https://onofficiel.github.io/border/">Border Web</a>',
              "OK"
            ).dlg.setSize(320, 140),
        },
        {
          type: "normal",
          label: "Send Feedback",
          onclick: async () => {
            let loader = w96.ui.MsgBoxSimple.idleProgress(
              "Border Feedback",
              "Connecting to the feedback server..."
            );

            if (!w96.net.p3.connected) await w96.net.p3.connect();

            let socket = w96.net.p3.createConnection(
              "onofficiel.l51drui0hb.ppp:1234"
            );

            const tryConnect = () => {
              socket.connect().catch((err) => {
                loader.closeDialog();
                w96.ui.MsgBoxSimple.confirm(
                  "Cannot connect to the feedback server : " +
                    err +
                    ".\nRetry ?",
                  (ok) => {
                    if (ok) {
                      tryConnect();
                      loader = w96.ui.MsgBoxSimple.idleProgress(
                        "Border Feedback",
                        "Connecting to the feedback server..."
                      );
                    }
                  }
                );
              });
            };

            socket.on("connect", () => {
              loader.closeDialog();
              w96.ui.MsgBoxSimple.prompt(
                "Border Feedback",
                'Write here to us : ( the message can\'t contain ">>" )',
                "",
                (msg) => {
                  if (msg) socket.send(["text", "feedback>>" + msg]);
                }
              );
            });

            socket.on("message", (msg) => {
              alert(msg[1]);
            });

            tryConnect();
          },
        },
        {
          type: "separator",
        },
        {
          type: "normal",
          label: "See Keyboard Shortcuts",
          onclick: () => {
            let list =
              "Do shortcuts are actived ? " + configJSON.browser.enableShortcuts
                ? "yes"
                : "no" + "<br>";

            for (const keybind in browser.keybinds) {
              if (Object.hasOwnProperty.call(browser.keybinds, keybind)) {
                const element = browser.keybinds[keybind];

                list += `<b>${element.description + " : "}</b>${element.keys
                  .reverse()
                  .join(" + ")}<br>`;
              }
            }

            w96.ui.MsgBoxSimple.info(
              "Border Keyboard Shortcuts",
              '<span class="bold-noaa">Border Keyboard Shortcuts :</span><br><br> ' +
                list,
              "OK"
            ).dlg.setSize(320, 140);
          },
        },
        {
          type: "normal",
          label: "Open A Changelog Tab",
          onclick: () => {
            browser.addTab({ current: true, url: "border://changelog" });
          },
        },
      ]);

      const bookmarkList = [];
      bookmarksJSON.forEach(({ name, url }) => {
        bookmarkList.push({
          type: "normal",
          label: name,
          onclick: () => {
            browser.addTab({ current: true, url });
          },
        });
      });

      appbar.addRoot("Bookmarks", bookmarkList);

      body.querySelector(".appbar").replaceWith(appbar.getMenuDiv());

      wnd.show();
    }

    // creating the Border Setup Program
    async function createSetupWnd() {
      let wnd = new w96.StandardWindow({
        title: "Setup Border",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoUlEQVQ4Ed1Puw2DMBB9IzBCxkFxCvahQUfBCAyQkqEoKSlTJrK4g6c7fnUsWff8frYBXQny5W387cnhjG8HzfiHBf5L+fyE9PblMPcCB9w7hDPhzWxKkJF11lZ8ZbjS6QVtvbYS4IIXpCNpgWYIghKm6xyCT4UpCDsFJZpH8OWCQBLBLyB6g2cFHD70ecGH7Lxd6VCFpmAqQT4W0jmzbvgHE7moTscCW+cAAAAASUVORK5CYII=",
        bodyClass: "border-setup-wnd",
        taskbar: true,
        initialHeight: 400,
        initialWidth: 600,
      });

      let setupBody = wnd.getBodyContainer();

      setupBody.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');

.border-setup-body {
    background: indigo;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: #fff;
    font-family: Lexend, sans-serif;
    font-size: .7rem;
}
.border-setup-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
    font-size: .7rem;
}
</style>
<div class="border-setup-body">
    <div class="border-setup-container">
        <img height="150" src="data:image/png;base64,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">
        <div class="border-setup-content">
            <div class="border-setup-panel"></div>
        </div>
    </div>
    <div class="border-setup-button-container">
        <button class="border-setup-back">Back</button>
        <button class="border-setup-next">Next</button>
    </div>
</div>
`;

      let currentPage = 0;
      let settings = {};
      let configJSON = JSON.parse(
        await w96.FS.readstr("c:/user/appdata/Border/config.json")
      );

      let page = [
        {
          content: `
            <h1>Welcome to the Border Setup Program !</h1>
            Click next to start the configuration of Border or back to use the default one.
            `,
        },
        {
          content: `
            <h1>Theme of Border</h1>
            <b>Primary : </b><input class="border-setup-primary-input" type="color" value="${configJSON.theme.primary}"></input><br>
            <b>Secondary : </b><input class="border-setup-secondary-input" type="color" value="${configJSON.theme.secondary}"></input>
            `,
          save: [
            {
              name: "primary",
              value: ".border-setup-primary-input",
            },
            {
              name: "secondary",
              value: ".border-setup-secondary-input",
            },
          ],
        },
        {
          content: `
            <h1>Size of the window</h1>
            <b>Height : </b><input class="border-setup-height-input" type="number" value="${configJSON.window.height}"></input>px<br>
            <b>Width : </b><input class="border-setup-width-input" type="number" value="${configJSON.window.width}"></input>px
            `,
          save: [
            {
              name: "height",
              value: ".border-setup-height-input",
            },
            {
              name: "width",
              value: ".border-setup-width-input",
            },
          ],
        },
        {
          content: `
            <h1>Others</h1>
            <b>Default page : </b><input class="border-setup-default-input" type="url" value="${configJSON.browser.defaultPage}"></input><br>
            <b>Enable shortcuts ? </b><input class="border-setup-shortcuts-input" type="checkbox" checked="${configJSON.browser.enableShortcuts}"></input><br>
            <b>Create a Border shortcut on your desktop ? </b><input class="border-setup-desktop-input" type="checkbox" checked="true"></input>
            `,
          save: [
            {
              name: "defaultPage",
              value: ".border-setup-default-input",
            },
            {
              name: "enableShortcuts",
              value: ".border-setup-shortcuts-input",
            },
            {
              name: "createDesktopShortcut",
              value: ".border-setup-desktop-input",
            },
          ],
        },
        {
          content: `
            <h1>So here we are !</h1>
            <div class="border-setup-get-settings"></div>
            `,
        },
      ];

      setupBody
        .querySelector(".border-setup-back")
        .addEventListener("click", () => {
          goto(--currentPage);
        });

      setupBody
        .querySelector(".border-setup-next")
        .addEventListener("click", () => {
          if (!!page[currentPage].save) {
            for (let data of page[currentPage].save) {
              settings[data.name] =
                setupBody.querySelector(data.value).type === "checkbox"
                  ? setupBody.querySelector(data.value).checked
                  : setupBody.querySelector(data.value).value;
            }
          }
          goto(++currentPage);
        });

      const goto = (n) => {
        if (n >= page.length) {
          let json = JSON.stringify({
            theme: {
              primary: settings.primary,
              secondary: settings.secondary,
            },
            window: {
              height: settings.height,
              width: settings.width,
            },
            browser: {
              defaultPage: settings.defaultPage,
              enableShortcuts: settings.enableShortcuts,
            },
          });

          if (settings.createDesktopShortcut) {
            w96.shell.mkShortcut(
              "c:/user/desktop/Border.link",
              icon32,
              "border"
            );
          }

          w96.FS.writestr("c:/user/appdata/Border/config.json", json).then(
            () => {
              alert("Configuration done !");
              w96.sys.execCmd("border");
              return wnd.close();
            }
          );
        }

        if (n < 0) {
          w96.sys.execCmd("border");
          return wnd.close();
        }

        setupBody.querySelector(".border-setup-panel").innerHTML =
          page[n].content;

        document
          .querySelectorAll(".border-setup-get-settings")
          .forEach((item) => {
            let settingsData = "";
            for (let key of Object.keys(settings)) {
              settingsData += key + ": " + settings[key] + "<br/>";
            }
            item.innerHTML = settingsData;
          });

        currentPage = n;
      };
      goto(0);

      wnd.show();
    }
  }
}

w96.shell.mkShortcut(
  "c:/system/programs/Accessories/Border.link",
  icon16,
  "border"
);

return await WApplication.execAsync(new Border(), this.boxedEnv.args);