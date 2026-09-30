/* =========================================================
   GIOVANNA OS
   Main System Script
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let highestZIndex = 200;

let draggedWindow = null;

let dragOffsetX = 0;
let dragOffsetY = 0;

let buddyDragging = false;

let buddyOffsetX = 0;
let buddyOffsetY = 0;

let buddyEnabled = true;

let buddyTimer = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeBoot();

});


/* =========================================================
   BOOT SYSTEM
========================================================= */

function initializeBoot() {

    const bootScreen = document.getElementById("boot-screen");
    const progressBar = document.getElementById("boot-progress-bar");
    const bootStatus = document.getElementById("boot-status");

    if (!bootScreen) {
        initializeSystem();
        return;
    }

    const messages = [
        "Initializing system...",
        "Loading kernel...",
        "Loading Java............. OK",
        "Loading SQL.............. OK",
        "Loading Git.............. OK",
        "Loading Spring Boot...... OK",
        "Loading JavaScript....... OK",
        "Loading creativity...... OK",
        "Loading portfolio.exe.... OK",
        "Starting desktop......... OK"
    ];

    let progress = 0;
    let messageIndex = 0;

    const bootInterval = setInterval(() => {

        progress += Math.floor(Math.random() * 9) + 5;

        if (progress > 100) {
            progress = 100;
        }

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (bootStatus && messageIndex < messages.length) {
            bootStatus.textContent = messages[messageIndex];
            messageIndex++;
        }

        if (progress >= 100) {

            clearInterval(bootInterval);

            setTimeout(() => {

                bootScreen.style.opacity = "0";
                bootScreen.style.transition = "opacity .6s ease";

                setTimeout(() => {

                    bootScreen.remove();

                    initializeSystem();

                }, 650);

            }, 500);

        }

    }, 280);

}


/* =========================================================
   SYSTEM INITIALIZATION
========================================================= */

function initializeSystem() {

    initializeClock();

    initializeStartMenu();

    initializeWindows();

    initializeDesktopIcons();

    initializeProjectItems();

    initializeComputerItems();

    initializeWindowDragging();

    initializeTaskbar();

    initializeGioBuddy();

}


/* =========================================================
   CLOCK
========================================================= */

function initializeClock() {

    const clock = document.getElementById("clock");

    if (!clock) {
        return;
    }

    function updateClock() {

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        clock.textContent = `${hours}:${minutes}`;

    }

    updateClock();

    setInterval(updateClock, 1000);

}


/* =========================================================
   START MENU
========================================================= */

function initializeStartMenu() {

    const startButton = document.getElementById("start-button");
    const startMenu = document.getElementById("start-menu");

    if (!startButton || !startMenu) {
        return;
    }

    startButton.addEventListener("click", (event) => {

        event.stopPropagation();

        startMenu.classList.toggle("open");

    });


    document.addEventListener("click", (event) => {

        if (
            !startMenu.contains(event.target) &&
            event.target !== startButton &&
            !startButton.contains(event.target)
        ) {

            startMenu.classList.remove("open");

        }

    });


    startMenu.querySelectorAll("[data-window]").forEach(button => {

        button.addEventListener("click", () => {

            const windowId = button.dataset.window;

            openWindow(windowId);

            startMenu.classList.remove("open");

        });

    });

}


/* =========================================================
   WINDOW SYSTEM
========================================================= */

function initializeWindows() {

    const windows = document.querySelectorAll(".os-window");

    windows.forEach(windowElement => {

        const closeButton =
            windowElement.querySelector(".window-close");

        const minimizeButton =
            windowElement.querySelector(".window-minimize");

        const maximizeButton =
            windowElement.querySelector(".window-maximize");


        /* -----------------------------------------------------
           CLOSE
        ----------------------------------------------------- */

        if (closeButton) {

            closeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                closeWindow(windowElement.id);

            });

        }


        /* -----------------------------------------------------
           MINIMIZE
        ----------------------------------------------------- */

        if (minimizeButton) {

            minimizeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                minimizeWindow(windowElement.id);

            });

        }


        /* -----------------------------------------------------
           MAXIMIZE
        ----------------------------------------------------- */

        if (maximizeButton) {

            maximizeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                maximizeWindow(windowElement.id);

            });

        }


        /* -----------------------------------------------------
           BRING TO FRONT
        ----------------------------------------------------- */

        windowElement.addEventListener("mousedown", () => {

            bringToFront(windowElement);

        });

    });

}


/* =========================================================
   OPEN WINDOW
========================================================= */

function openWindow(windowId) {

    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "block";

    windowElement.classList.add("active-window");

    bringToFront(windowElement);

    updateTaskbarButton(windowId);

}


/* =========================================================
   CLOSE WINDOW
========================================================= */

function closeWindow(windowId) {

    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "none";

    windowElement.classList.remove("active-window");

    removeTaskbarButton(windowId);

}


/* =========================================================
   MINIMIZE WINDOW
========================================================= */

function minimizeWindow(windowId) {

    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "none";

    windowElement.classList.remove("active-window");

    updateTaskbarButton(windowId);

}


/* =========================================================
   MAXIMIZE WINDOW
========================================================= */

function maximizeWindow(windowId) {

    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    windowElement.classList.toggle("maximized");

    bringToFront(windowElement);

}


/* =========================================================
   BRING WINDOW TO FRONT
========================================================= */

function bringToFront(windowElement) {

    highestZIndex++;

    windowElement.style.zIndex = highestZIndex;

    document.querySelectorAll(".os-window").forEach(windowItem => {

        windowItem.classList.remove("focused-window");

    });

    windowElement.classList.add("focused-window");

}


/* =========================================================
   DESKTOP ICONS
========================================================= */

function initializeDesktopIcons() {

    const icons =
        document.querySelectorAll(".desktop-icon");

    icons.forEach(icon => {

        icon.addEventListener("dblclick", () => {

            const windowId = icon.dataset.window;

            if (windowId) {

                openWindow(windowId);

            }

        });

    });

}


/* =========================================================
   PROJECT ITEMS
========================================================= */

function initializeProjectItems() {

    const projects =
        document.querySelectorAll(".project-item");

    projects.forEach(project => {

        project.addEventListener("dblclick", () => {

            const windowId = project.dataset.window;

            if (windowId) {

                openWindow(windowId);

            }

        });

    });

}


/* =========================================================
   COMPUTER ITEMS
========================================================= */

function initializeComputerItems() {

    const items =
        document.querySelectorAll(".computer-item");

    items.forEach(item => {

        item.addEventListener("dblclick", () => {

            const windowId = item.dataset.window;

            if (windowId) {

                openWindow(windowId);

            }

        });

    });

}


/* =========================================================
   WINDOW DRAGGING
========================================================= */

function initializeWindowDragging() {

    const titlebars =
        document.querySelectorAll(".window-titlebar");

    titlebars.forEach(titlebar => {

        titlebar.addEventListener("mousedown", (event) => {

            const windowElement =
                titlebar.closest(".os-window");

            if (!windowElement) {
                return;
            }

            if (
                event.target.closest(".window-controls")
            ) {
                return;
            }

            if (
                windowElement.classList.contains("maximized")
            ) {
                return;
            }

            draggedWindow = windowElement;

            const rect =
                windowElement.getBoundingClientRect();

            dragOffsetX = event.clientX - rect.left;
            dragOffsetY = event.clientY - rect.top;

            bringToFront(windowElement);

            document.body.style.userSelect = "none";

        });

    });


    document.addEventListener("mousemove", (event) => {

        if (!draggedWindow) {
            return;
        }

        let newX =
            event.clientX - dragOffsetX;

        let newY =
            event.clientY - dragOffsetY;


        const maxX =
            window.innerWidth -
            draggedWindow.offsetWidth;

        const maxY =
            window.innerHeight -
            45;


        newX = Math.max(0, Math.min(newX, maxX));

        newY = Math.max(0, Math.min(newY, maxY));


        draggedWindow.style.left = `${newX}px`;

        draggedWindow.style.top = `${newY}px`;

    });


    document.addEventListener("mouseup", () => {

        draggedWindow = null;

        document.body.style.userSelect = "";

    });

}


/* =========================================================
   TASKBAR
========================================================= */

function initializeTaskbar() {

    const taskbar =
        document.getElementById("taskbar-programs");

    if (!taskbar) {
        return;
    }

}


/* =========================================================
   CREATE TASKBAR BUTTON
========================================================= */

function updateTaskbarButton(windowId) {

    const taskbar =
        document.getElementById("taskbar-programs");

    const windowElement =
        document.getElementById(windowId);

    if (!taskbar || !windowElement) {
        return;
    }


    let button =
        taskbar.querySelector(
            `[data-task-window="${windowId}"]`
        );


    const titleElement =
        windowElement.querySelector(".window-title");


    let title =
        titleElement
            ? titleElement.textContent.trim()
            : windowId;


    if (!button) {

        button = document.createElement("button");

        button.className = "taskbar-button";

        button.dataset.taskWindow = windowId;

        button.textContent = title;

        button.addEventListener("click", () => {

            const currentWindow =
                document.getElementById(windowId);

            if (!currentWindow) {
                return;
            }


            if (
                currentWindow.style.display === "none"
            ) {

                openWindow(windowId);

            } else {

                const currentZ =
                    Number(
                        currentWindow.style.zIndex || 0
                    );

                if (currentZ >= highestZIndex) {

                    minimizeWindow(windowId);

                } else {

                    bringToFront(currentWindow);

                }

            }

        });

        taskbar.appendChild(button);

    }


    document
        .querySelectorAll(".taskbar-button")
        .forEach(item => {

            item.classList.remove("active");

        });


    button.classList.add("active");

}


/* =========================================================
   REMOVE TASKBAR BUTTON
========================================================= */

function removeTaskbarButton(windowId) {

    const taskbar =
        document.getElementById("taskbar-programs");

    if (!taskbar) {
        return;
    }

    const button =
        taskbar.querySelector(
            `[data-task-window="${windowId}"]`
        );

    if (button) {
        button.remove();
    }

}


/* =========================================================
   GIOBUDDY
========================================================= */

function initializeGioBuddy() {

    if (document.getElementById("giobuddy")) {
        return;
    }

    injectGioBuddyStyles();

    createGioBuddy();

    setTimeout(() => {

        buddySay(
            "Oi! Eu sou o GioBuddy.exe 👾"
        );

    }, 1800);


    setTimeout(() => {

        buddySay(
            "Quer ver seus projetos? Eu sei onde eles estão."
        );

    }, 6500);


    startBuddyRandomEvents();

}


/* =========================================================
   GIOBUDDY STYLES
========================================================= */

function injectGioBuddyStyles() {

    if (document.getElementById("giobuddy-styles")) {
        return;
    }


    const style =
        document.createElement("style");

    style.id = "giobuddy-styles";


    style.textContent = `

        #giobuddy {

            position: absolute;

            right: 55px;
            bottom: 52px;

            width: 95px;
            height: 125px;

            z-index: 9100;

            cursor: grab;

            user-select: none;

            filter:
                drop-shadow(
                    3px 5px 4px
                    rgba(0,0,0,.45)
                );

            animation:
                gioBuddyFloat 2.5s ease-in-out infinite;

        }


        #giobuddy.dragging {

            cursor: grabbing;

            animation: none;

        }


        .gio-body {

            position: absolute;

            left: 18px;
            bottom: 8px;

            width: 62px;
            height: 75px;

            border-radius:
                45% 45% 38% 38%;

            background:
                linear-gradient(
                    135deg,
                    #9b6cff,
                    #5130a8
                );

            border:
                2px solid #27145f;

            box-shadow:
                inset 7px 5px 0
                rgba(255,255,255,.18);

        }


        .gio-head {

            position: absolute;

            left: 8px;
            top: -35px;

            width: 78px;
            height: 62px;

            border-radius:
                48% 48% 45% 45%;

            background:
                linear-gradient(
                    135deg,
                    #b58cff,
                    #6340bb
                );

            border:
                2px solid #27145f;

            box-shadow:
                inset 7px 5px 0
                rgba(255,255,255,.2);

        }


        .gio-ear {

            position: absolute;

            width: 22px;
            height: 34px;

            top: 15px;

            border-radius: 50%;

            background:
                linear-gradient(
                    #8055dd,
                    #3f267e
                );

            border:
                2px solid #27145f;

        }


        .gio-ear.left {

            left: -13px;

            transform:
                rotate(-25deg);

        }


        .gio-ear.right {

            right: -13px;

            transform:
                rotate(25deg);

        }


        .gio-eye {

            position: absolute;

            top: 22px;

            width: 13px;
            height: 17px;

            border-radius: 50%;

            background: #fff;

            border: 2px solid #27145f;

        }


        .gio-eye::after {

            content: "";

            position: absolute;

            width: 5px;
            height: 8px;

            left: 3px;
            top: 3px;

            border-radius: 50%;

            background: #111;

        }


        .gio-eye.left {

            left: 19px;

        }


        .gio-eye.right {

            right: 19px;

        }


        .gio-mouth {

            position: absolute;

            left: 29px;
            top: 43px;

            width: 20px;
            height: 9px;

            border-bottom:
                2px solid #27145f;

            border-radius: 50%;

        }


        .gio-antenna {

            position: absolute;

            width: 3px;
            height: 23px;

            left: 38px;
            top: -22px;

            background: #27145f;

            transform:
                rotate(10deg);

        }


        .gio-antenna::after {

            content: "";

            position: absolute;

            width: 8px;
            height: 8px;

            left: -3px;
            top: -5px;

            border-radius: 50%;

            background: #5ed0ff;

            border: 2px solid #27145f;

            box-shadow:
                0 0 7px #5ed0ff;

        }


        .gio-tie {

            position: absolute;

            left: 43px;
            bottom: 9px;

            width: 15px;
            height: 35px;

            background:
                linear-gradient(
                    90deg,
                    #3e73ff,
                    #173fa8
                );

            clip-path:
                polygon(
                    0 0,
                    100% 0,
                    75% 60%,
                    100% 100%,
                    50% 82%,
                    0 100%,
                    25% 60%
                );

        }


        .gio-foot {

            position: absolute;

            bottom: 0;

            width: 32px;
            height: 15px;

            border-radius: 50%;

            background: #3c227d;

            border: 2px solid #27145f;

        }


        .gio-foot.left {

            left: 12px;

        }


        .gio-foot.right {

            right: 12px;

        }


        .gio-speech {

            position: absolute;

            right: 65px;
            bottom: 95px;

            width: 220px;

            padding: 9px 11px;

            color: #111;

            background: #fff;

            border: 1px solid #555;

            border-radius: 4px;

            box-shadow:
                3px 3px 5px
                rgba(0,0,0,.35);

            font-family:
                Tahoma,
                Arial,
                sans-serif;

            font-size: 11px;

            line-height: 1.35;

        }


        .gio-speech::after {

            content: "";

            position: absolute;

            right: -9px;
            bottom: 15px;

            width: 0;
            height: 0;

            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;

            border-left:
                10px solid #555;

        }


        .gio-speech::before {

            content: "";

            position: absolute;

            right: -7px;
            bottom: 15px;

            width: 0;
            height: 0;

            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;

            border-left:
                9px solid white;

            z-index: 2;

        }


        .gio-alert {

            position: fixed;

            z-index: 9998;

            width: 330px;

            background: #ece9d8;

            border: 1px solid #003399;

            box-shadow:
                4px 4px 12px
                rgba(0,0,0,.5);

            font-family: Tahoma, sans-serif;

        }


        .gio-alert-title {

            height: 25px;

            display: flex;
            align-items: center;

            padding: 0 6px;

            color: white;

            font-weight: bold;

            background:
                linear-gradient(
                    #5d9ce6,
                    #205eb6
                );

        }


        .gio-alert-body {

            display: flex;

            gap: 12px;

            padding: 15px;

            background: #fff;

        }


        .gio-alert-icon {

            font-size: 32px;

        }


        .gio-alert-text {

            line-height: 1.45;

        }


        .gio-alert-footer {

            display: flex;

            justify-content: flex-end;

            gap: 6px;

            padding: 7px;

            background: #ece9d8;

            border-top: 1px solid #bbb;

        }


        .gio-alert-footer button {

            min-width: 70px;

            height: 24px;

            border: 1px solid #777;

            background:
                linear-gradient(
                    #fff,
                    #ddd
                );

            font-family: Tahoma, sans-serif;

            cursor: pointer;

        }


        @keyframes gioBuddyFloat {

            0% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-7px);
            }

            100% {
                transform: translateY(0);
            }

        }


        @keyframes gioBuddyShake {

            0% {
                transform: rotate(0deg);
            }

            25% {
                transform: rotate(-5deg);
            }

            50% {
                transform: rotate(5deg);
            }

            75% {
                transform: rotate(-4deg);
            }

            100% {
                transform: rotate(0deg);
            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   CREATE GIOBUDDY
========================================================= */

function createGioBuddy() {

    const buddy =
        document.createElement("div");

    buddy.id = "giobuddy";


    buddy.innerHTML = `

        <div class="gio-speech" id="gio-speech">
            Inicializando GioBuddy...
        </div>


        <div class="gio-body">

            <div class="gio-head">

                <div class="gio-ear left"></div>
                <div class="gio-ear right"></div>

                <div class="gio-antenna"></div>

                <div class="gio-eye left"></div>
                <div class="gio-eye right"></div>

                <div class="gio-mouth"></div>

            </div>

            <div class="gio-tie"></div>

            <div class="gio-foot left"></div>
            <div class="gio-foot right"></div>

        </div>

    `;


    document
        .getElementById("desktop")
        .appendChild(buddy);


    buddy.addEventListener("click", (event) => {

        if (buddyDragging) {
            return;
        }

        event.stopPropagation();

        buddyRandomPhrase();

    });


    buddy.addEventListener(
        "mousedown",
        startBuddyDrag
    );


    buddy.addEventListener(
        "dblclick",
        () => {

            buddySay(
                "Eu disse que você não precisava clicar duas vezes... 😐"
            );

            setTimeout(() => {

                showBuddyAlert();

            }, 900);

        }
    );

}


/* =========================================================
   BUDDY SPEECH
========================================================= */

function buddySay(message, duration = 4200) {

    const speech =
        document.getElementById("gio-speech");

    if (!speech) {
        return;
    }

    speech.textContent = message;

    speech.style.display = "block";


    clearTimeout(window.gioSpeechTimer);


    window.gioSpeechTimer =
        setTimeout(() => {

            speech.style.display = "none";

        }, duration);

}


/* =========================================================
   RANDOM PHRASES
========================================================= */

function buddyRandomPhrase() {

    const phrases = [

        "Você realmente clicou em mim. Interessante.",

        "Eu posso te mostrar os projetos. Confia.",

        "Você já olhou o SKILLS.EXE?",

        "Java carregado. Café não encontrado.",

        "Banco de Dados detectado. 📊",

        "Eu ouvi dizer que você gosta de tecnologia.",

        "Seu portfolio está funcionando. Eu acho.",

        "Quer abrir o ABOUT.EXE?",

        "Estou monitorando... brincadeira. 👀",

        "Sistema funcionando dentro dos parâmetros.",

        "Tenho uma pergunta: por que você ainda está olhando para mim?",

        "Você sabia que eu não estava aqui antes?",

        "GioBuddy.exe está consumindo aproximadamente 0.0001% de sua atenção.",

        "ATENÇÃO: Giovanna está programando novamente.",

        "Eu poderia fazer seu projeto por você. Mas aí não seria seu projeto."

    ];


    const random =
        phrases[
            Math.floor(
                Math.random() * phrases.length
            )
        ];


    buddySay(random);


    const buddy =
        document.getElementById("giobuddy");

    if (buddy) {

        buddy.style.animation =
            "gioBuddyShake .4s ease";

        setTimeout(() => {

            buddy.style.animation =
                "gioBuddyFloat 2.5s ease-in-out infinite";

        }, 450);

    }

}


/* =========================================================
   RANDOM BUDDY EVENTS
========================================================= */

function startBuddyRandomEvents() {

    clearTimeout(buddyTimer);


    function scheduleEvent() {

        const delay =
            Math.floor(
                Math.random() * 18000
            ) + 18000;


        buddyTimer =
            setTimeout(() => {

                if (
                    buddyEnabled &&
                    document.visibilityState === "visible"
                ) {

                    const eventNumber =
                        Math.floor(
                            Math.random() * 5
                        );


                    switch (eventNumber) {

                        case 0:

                            buddySay(
                                "Psst... tem alguém aí? 👀"
                            );

                            break;


                        case 1:

                            buddySay(
                                "Só passando para lembrar que eu existo."
                            );

                            break;


                        case 2:

                            showBuddyAlert();

                            break;


                        case 3:

                            buddySay(
                                "SYSTEM STATUS: tudo estranhamente normal."
                            );

                            break;


                        case 4:

                            buddySay(
                                "Clique em mim. Eu sei que você quer."
                            );

                            break;

                    }

                }


                scheduleEvent();

            }, delay);

    }


    scheduleEvent();

}


/* =========================================================
   BUDDY ALERT
========================================================= */

function showBuddyAlert() {

    if (!buddyEnabled) {
        return;
    }


    const alertBox =
        document.createElement("div");

    alertBox.className =
        "gio-alert";


    const offset =
        Math.floor(
            Math.random() * 180
        );


    alertBox.style.left =
        `${Math.max(40, window.innerWidth / 2 - 165 + offset)}px`;


    alertBox.style.top =
        `${Math.max(70, window.innerHeight / 2 - 130 - offset / 2)}px`;


    alertBox.innerHTML = `

        <div class="gio-alert-title">
            GioBuddy.exe
        </div>


        <div class="gio-alert-body">

            <div class="gio-alert-icon">
                ⚠️
            </div>

            <div class="gio-alert-text">

                <strong>
                    SYSTEM WARNING
                </strong>

                <br><br>

                GioBuddy detectou uma atividade suspeita:

                <br><br>

                <strong>
                    Giovanna está aprendendo Java.
                </strong>

                <br><br>

                Isso pode resultar em:

                <br>

                • mais projetos<br>
                • mais código<br>
                • menos horas de sono

            </div>

        </div>


        <div class="gio-alert-footer">

            <button data-gio-action="projects">
                Ver projetos
            </button>

            <button data-gio-action="close">
                OK
            </button>

        </div>

    `;


    document
        .getElementById("desktop")
        .appendChild(alertBox);


    const projectsButton =
        alertBox.querySelector(
            '[data-gio-action="projects"]'
        );


    const closeButton =
        alertBox.querySelector(
            '[data-gio-action="close"]'
        );


    projectsButton.addEventListener(
        "click",
        () => {

            alertBox.remove();

            openWindow("projects-window");

            buddySay(
                "Eu sabia que você queria ver os projetos."
            );

        }
    );


    closeButton.addEventListener(
        "click",
        () => {

            alertBox.remove();

            buddySay(
                "Você fechou o alerta. Corajoso."
            );

        }
    );


    setTimeout(() => {

        if (document.body.contains(alertBox)) {

            alertBox.remove();

        }

    }, 15000);

}


/* =========================================================
   BUDDY DRAGGING
========================================================= */

function startBuddyDrag(event) {

    if (event.button !== 0) {
        return;
    }


    const buddy =
        document.getElementById("giobuddy");

    if (!buddy) {
        return;
    }


    const rect =
        buddy.getBoundingClientRect();


    buddyDragging = false;

    buddyOffsetX =
        event.clientX - rect.left;

    buddyOffsetY =
        event.clientY - rect.top;


    function moveBuddy(moveEvent) {

        buddyDragging = true;

        buddy.classList.add("dragging");


        const desktop =
            document.getElementById("desktop");


        const desktopRect =
            desktop.getBoundingClientRect();


        let x =
            moveEvent.clientX -
            desktopRect.left -
            buddyOffsetX;


        let y =
            moveEvent.clientY -
            desktopRect.top -
            buddyOffsetY;


        const maxX =
            desktop.clientWidth -
            buddy.offsetWidth;


        const maxY =
            desktop.clientHeight -
            35 -
            buddy.offsetHeight;


        x = Math.max(
            0,
            Math.min(x, maxX)
        );


        y = Math.max(
            0,
            Math.min(y, maxY)
        );


        buddy.style.left =
            `${x}px`;

        buddy.style.top =
            `${y}px`;

        buddy.style.right =
            "auto";

        buddy.style.bottom =
            "auto";

    }


    function stopBuddy() {

        document.removeEventListener(
            "mousemove",
            moveBuddy
        );

        document.removeEventListener(
            "mouseup",
            stopBuddy
        );


        buddy.classList.remove("dragging");


        setTimeout(() => {

            buddyDragging = false;

        }, 50);

    }


    document.addEventListener(
        "mousemove",
        moveBuddy
    );


    document.addEventListener(
        "mouseup",
        stopBuddy
    );

}


/* =========================================================
   GIOBUDDY CONTEXT MENU
========================================================= */

document.addEventListener(
    "contextmenu",
    (event) => {

        const buddy =
            document.getElementById("giobuddy");


        if (
            !buddy ||
            !buddy.contains(event.target)
        ) {
            return;
        }


        event.preventDefault();


        showBuddyContextMenu(
            event.clientX,
            event.clientY
        );

    }
);


/* =========================================================
   BUDDY CONTEXT MENU
========================================================= */

function showBuddyContextMenu(x, y) {

    const oldMenu =
        document.getElementById(
            "gio-context-menu"
        );


    if (oldMenu) {
        oldMenu.remove();
    }


    const menu =
        document.createElement("div");


    menu.id =
        "gio-context-menu";


    menu.style.position = "fixed";

    menu.style.left =
        `${Math.min(x, window.innerWidth - 190)}px`;

    menu.style.top =
        `${Math.min(y, window.innerHeight - 150)}px`;

    menu.style.width = "185px";

    menu.style.zIndex = "99999";

    menu.style.background = "#ece9d8";

    menu.style.border =
        "1px solid #555";

    menu.style.boxShadow =
        "3px 3px 8px rgba(0,0,0,.4)";

    menu.style.font =
        "11px Tahoma, sans-serif";


    const items = [

        {
            label: "💬 What are you doing?",
            action: () => {

                buddySay(
                    "Estou ajudando. Tecnicamente."
                );

            }
        },

        {
            label: "🎲 Do a trick",
            action: () => {

                buddySay(
                    "Olha só! Eu consigo ficar parado. Impressionante."
                );

                const buddy =
                    document.getElementById(
                        "giobuddy"
                    );

                if (buddy) {

                    buddy.style.animation =
                        "gioBuddyShake .5s ease";

                    setTimeout(() => {

                        buddy.style.animation =
                            "gioBuddyFloat 2.5s ease-in-out infinite";

                    }, 550);

                }

            }
        },

        {
            label: "📁 Show Projects",
            action: () => {

                openWindow(
                    "projects-window"
                );

                buddySay(
                    "Projetos encontrados."
                );

            }
        },

        {
            label: "⚠️ System Warning",
            action: () => {

                showBuddyAlert();

            }
        },

        {
            label: "❌ Disable GioBuddy",
            action: () => {

                disableGioBuddy();

            }
        }

    ];


    items.forEach(item => {

        const button =
            document.createElement("div");


        button.textContent =
            item.label;


        button.style.padding =
            "7px 9px";


        button.style.cursor =
            "pointer";


        button.addEventListener(
            "mouseenter",
            () => {

                button.style.background =
                    "#316ac5";

                button.style.color =
                    "white";

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.background =
                    "";

                button.style.color =
                    "";

            }
        );


        button.addEventListener(
            "click",
            () => {

                item.action();

                menu.remove();

            }
        );


        menu.appendChild(button);

    });


    document
        .getElementById("desktop")
        .appendChild(menu);


    setTimeout(() => {

        document.addEventListener(
            "click",
            function closeMenu(event) {

                if (!menu.contains(event.target)) {

                    menu.remove();

                    document.removeEventListener(
                        "click",
                        closeMenu
                    );

                }

            }
        );

    }, 10);

}


/* =========================================================
   DISABLE GIOBUDDY
========================================================= */

function disableGioBuddy() {

    const buddy =
        document.getElementById(
            "giobuddy"
        );


    if (!buddy) {
        return;
    }


    buddyEnabled = false;


    clearTimeout(buddyTimer);


    buddy.remove();


    showBuddyDisabledAlert();

}


/* =========================================================
   DISABLED MESSAGE
========================================================= */

function showBuddyDisabledAlert() {

    const alertBox =
        document.createElement("div");


    alertBox.className =
        "gio-alert";


    alertBox.style.left =
        `${window.innerWidth / 2 - 165}px`;


    alertBox.style.top =
        `${window.innerHeight / 2 - 100}px`;


    alertBox.innerHTML = `

        <div class="gio-alert-title">
            GioBuddy.exe
        </div>

        <div class="gio-alert-body">

            <div class="gio-alert-icon">
                👾
            </div>

            <div class="gio-alert-text">

                <strong>
                    GioBuddy foi desativado.
                </strong>

                <br><br>

                O sistema ficará em paz por enquanto.

                <br><br>

                Provavelmente.

            </div>

        </div>

        <div class="gio-alert-footer">

            <button id="gio-restore">
                Ativar novamente
            </button>

            <button id="gio-close-disabled">
                OK
            </button>

        </div>

    `;


    document
        .getElementById("desktop")
        .appendChild(alertBox);


    document
        .getElementById("gio-close-disabled")
        .addEventListener(
            "click",
            () => {

                alertBox.remove();

            }
        );


    document
        .getElementById("gio-restore")
        .addEventListener(
            "click",
            () => {

                alertBox.remove();

                buddyEnabled = true;

                createGioBuddy();

                buddySay(
                    "EU VOLTEI. 😈"
                );

                startBuddyRandomEvents();

            }
        );

}


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /* G = GioBuddy */

        if (
            event.key.toLowerCase() === "g" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey
        ) {

            const activeElement =
                document.activeElement;


            if (
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.tagName === "SELECT"
                )
            ) {
                return;
            }


            const buddy =
                document.getElementById(
                    "giobuddy"
                );


            if (buddy) {

                buddyRandomPhrase();

            } else {

                buddyEnabled = true;

                createGioBuddy();

                buddySay(
                    "Você me chamou?"
                );

                startBuddyRandomEvents();

            }

        }


        /* ESC = close start menu */

        if (event.key === "Escape") {

            const startMenu =
                document.getElementById(
                    "start-menu"
                );


            if (startMenu) {

                startMenu.classList.remove(
                    "open"
                );

            }

        }

    }
);