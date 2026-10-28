
const ICON_PATH = "img/icons/";

const ICONS = {
    computer: "MyComputer.png",
    projects: "FolderOpened.png",
    about: "MyDocuments.png",
    skills: "ControlPanel.png",
    internet: "InternetExplorer6.png",
    media: "WindowsMediaPlayer9.png",

    folder: "FolderOpened.png",
    closedFolder: "FolderClosed.png",

    hardDrive: "LocalDisk.png",
    network: "NetworkConnections.png",

    document: "GenericDocument.png",
    image: "MyPictures.png",
    sound: "GenericAudio.png",
    video: "GenericVideo.png",

    program: "ApplicationWindow.png",
    programGroup: "StartMenuPrograms.png",

    settings: "ControlPanel.png",
    controlPanel: "ControlPanel.png",

    internetDoc: "InternetShortcut.png",
    msdos: "CommandPrompt.png",

    desktop: "Desktop.png",
    recycle: "RecycleBin(empty).png",

    configuration: "SystemProperties.png"
};

const TASKBAR_ICONS = {
    "computer-window": ICONS.computer,
    "projects-window": ICONS.folder,
    "about-window": ICONS.about,
    "skills-window": ICONS.settings,
    "internet-window": ICONS.internet,
    "media-window": ICONS.media,

    "api1-window": ICONS.document,
    "api2-window": ICONS.programGroup,
    "api3-window": ICONS.computer,
    "estacao-window": ICONS.sound
};

/* ===================
   ESTADO DO SISTEMA
====================== */

let highestZIndex = 200;

let draggedWindow = null;
let windowDragPointerId = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

let buddyEnabled = true;
let buddyDragging = false;
let buddyTimer = null;
let gioBuddyAnimationTimer = null;
let gioBuddyBlinkTimer = null;
let gioBuddyAnimationToken = 0;
let gioBuddyCurrentAnimation = "idle";
let gioBuddyMoveAnimationId = null;
let gioBuddyMoveToken = 0;

const GIOBUDDY_SPRITE_BASE = "img/GioBuddy/frames/";

let gioBuddyFacing = "right";

function makeGioBuddyFrames(folder, count) {
    return {
        right: Array.from({ length: count }, (_, i) => `${folder}/${folder}-${i + 1}.png`),
        left: Array.from({ length: count }, (_, i) => `${folder}/${folder}-${i + 1}.2.png`)
    };
}

const GIOBUDDY_SPRITES = {
    idle: makeGioBuddyFrames("idle", 6),
    blink: makeGioBuddyFrames("blink", 5),
    happy: makeGioBuddyFrames("happy", 5),
    talk: makeGioBuddyFrames("talk", 5)
};

const GIOBUDDY_ANIMATION_SPEED = {
    idle: 220,
    blink: 90,
    happy: 115,
    talk: 120
};
let buddyDragState = null;

/*===========
   EXPLORER
=============*/

let explorerHistory = ["computer"];
let explorerHistoryIndex = 0;
let explorerCurrentPath = "computer";

const explorerData = {
    computer: {
        title: "My Computer",
        subtitle: "Files and folders stored on this computer",
        address: "My Computer",
        details: "Personal Development Environment",

        items: [
            {
                name: "My Projects",
                icon: ICONS.folder,
                type: "Folder",
                path: "projects",
                description: "FATEC projects and applications."
            },
            {
                name: "Installed Skills",
                icon: ICONS.settings,
                type: "Folder",
                path: "skills",
                description: "Development technologies and tools."
            },
            {
                name: "About Giovanna",
                icon: ICONS.document,
                type: "Document",
                window: "about-window",
                description: "Profile and current status."
            },
            {
                name: "Internet",
                icon: ICONS.internet,
                type: "Shortcut",
                window: "internet-window",
                description: "Open Giovanna Online."
            },
            {
                name: "Media Player",
                icon: ICONS.sound,
                type: "Application",
                window: "media-window",
                description: "GIOVANNA OS soundtrack."
            },
            {
                name: "Control Panel",
                icon: ICONS.settings,
                type: "System",
                description: "System settings are currently unavailable."
            }
        ]
    },

    projects: {
        title: "My Projects",
        subtitle: "FATEC projects and personal applications",
        address: "C:\\Giovanna\\Projects",
        details: "4 project applications",

        items: [
            {
                name: "API-1",
                icon: ICONS.document,
                type: "C / Algorithms",
                window: "api1-window",
                description: "Aplicação de Cálculo de Sequências Lógicas."
            },
            {
                name: "API-2",
                icon: ICONS.programGroup,
                type: "Java / MySQL",
                window: "api2-window",
                description: "BlueTech — Plataforma para entrega de TG."
            },
            {
                name: "API-3",
                icon: ICONS.computer,
                type: "Spring Boot",
                window: "api3-window",
                description: "IPEMControl — Vehicle & Fuel Management."
            },
            {
                name: "Estação-TI",
                icon: ICONS.sound,
                type: "Node.js / WebSockets",
                window: "estacao-window",
                description: "Real-time collaborative platform."
            }
        ]
    },

    skills: {
        title: "Installed Skills",
        subtitle: "Software and technologies installed in Giovanna OS",
        address: "C:\\Giovanna\\Skills",
        details: "Development environment",

        items: [
            { name: "C Programming", icon: ICONS.msdos, type: "Development", description: "Algorithms · Logic · Programming" },
            { name: "Java Development Kit", icon: ICONS.program, type: "Development", description: "Java · Object-Oriented Programming" },
            { name: "Spring Boot", icon: ICONS.program, type: "Development", description: "Java Backend · REST APIs" },
            { name: "MySQL Database", icon: ICONS.hardDrive, type: "Database", description: "Relational Database · SQL" },
            { name: "SQLite", icon: ICONS.hardDrive, type: "Database", description: "Embedded Relational Database" },
            { name: "HTML5", icon: ICONS.internetDoc, type: "Web Development", description: "Semantic Markup · Web Structure" },
            { name: "CSS3", icon: ICONS.internetDoc, type: "Web Development", description: "Styling · Responsive Interfaces" },
            { name: "JavaScript", icon: ICONS.internetDoc, type: "Web Development", description: "Frontend · Node.js · Express · Socket.IO" },
            { name: "Git", icon: ICONS.configuration, type: "Development Tools", description: "Version Control" },
            { name: "GitHub", icon: ICONS.internet, type: "Development Tools", description: "Repositories · Projects · Collaboration" },
            { name: "Postman", icon: ICONS.program, type: "Development Tools", description: "API Testing · HTTP Requests" },
            { name: "Eclipse IDE", icon: ICONS.program, type: "Development Tools", description: "Java Development Environment" },
            { name: "IntelliJ IDEA", icon: ICONS.program, type: "Development Tools", description: "Java · Spring Boot" },
            { name: "CLion", icon: ICONS.program, type: "Development Tools", description: "C/C++ Development Environment" },
            { name: "Visual Studio Code", icon: ICONS.program, type: "Development Tools", description: "Code Editor · Extensions" },
            { name: "Figma", icon: ICONS.image, type: "Design", description: "Interface Design · Prototyping" },
            { name: "Linux", icon: ICONS.computer, type: "Operating Systems", description: "Operating System · Development Environment" },
            { name: "Windows", icon: ICONS.computer, type: "Operating Systems", description: "Operating System · Desktop Environment" },
            { name: "Docker", icon: ICONS.configuration, type: "Infrastructure", description: "Containers · Development Environment" },
            { name: "Oracle Database", icon: ICONS.hardDrive, type: "Database", description: "SQL · Relational Database" },
            { name: "Oracle Cloud Infrastructure", icon: ICONS.network, type: "Cloud", description: "Cloud Services · Oracle Ecosystem" }
        ]
    }
};

/* ==============
   MEDIA PLAYER
================= */

const mediaTrackInfo = [
    { title: "El Vals del Obrero", artist: "Ska-P" },
    { title: "Huipulla tuulee", artist: "Klamydia" },
    { title: "Schmerzengel", artist: "And One" },
    { title: "Vencidos", artist: "Arte no Escuro" },
    { title: "So Klingt Liebe", artist: "And One" },
    { title: "Boom!", artist: "System of a Down" },
    { title: "Dictatorshit", artist: "Sepultura" },
    { title: "Radio", artist: "Rammstein" },
    { title: "Violência Gratuita", artist: "Project 46" },
    { title: "Desespero", artist: "Lost Lenore" }
];

const mediaTracks = mediaTrackInfo.map((track, index) => ({
    ...track,
    src: `songs/musica${index + 1}.mp3`,
    duration: 0
}));

let mediaIndex = 0;
let mediaSeconds = 0;
let mediaPlaying = false;
let mediaTimer = null;
let mediaAudio = null;
let mediaAudioContext = null;
let mediaEqFilters = [];
let mediaEqSource = null;
let mediaEqEnabled = true;
let mediaAnalyser = null;
let mediaVisualFrame = null;
let mediaVisualMode = "psychedelic";
let mediaShuffle = false;
let mediaRepeat = false;

/*=========
   BOOT
=========*/

document.addEventListener("DOMContentLoaded", initializeBoot);

function initializeBoot() {
    const boot = document.getElementById("boot-screen");

    if (!boot) {
        initializeSystem();
        return;
    }

    const progressBar =
        document.getElementById("boot-progress-bar");

    const status =
        document.getElementById("boot-status");

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

    const timer = setInterval(() => {
        progress = Math.min(
            100,
            progress + Math.floor(Math.random() * 8) + 7
        );

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (status) {
            status.textContent =
                messages[
                    Math.min(
                        messageIndex++,
                        messages.length - 1
                    )
                ];
        }

        if (progress >= 100) {
            clearInterval(timer);

            setTimeout(() => {
                boot.style.opacity = "0";
                boot.style.transition = "opacity .45s ease";

                setTimeout(() => {
                    boot.remove();
                    initializeSystem();
                }, 500);
            }, 300);
        }
    }, 220);
}

/*==========================
   INICIALIZAÇÃO GERAL
==========================*/

function initializeSystem() {
    initializeClock();
    initializeWindows();
    initializeStartMenu();
    initializeDesktopIcons();
    initializeProjectItems();
    initializeComputerItems();
    initializeExplorer();
    initializeWindowDragging();
    initializeTaskbar();
    initializeMediaPlayer();
    initializeGioBuddy();

    applyWindowsIcons();
    initializeTrayIcons();
    updateTaskbarFromOpenWindows();
}

/*==========
   CLOCK
==========*/

function initializeClock() {
    const clock =
        document.getElementById("clock");

    if (!clock) {
        return;
    }

    const updateClock = () => {
        const now = new Date();

        clock.textContent =
            `${String(now.getHours()).padStart(2, "0")}:` +
            `${String(now.getMinutes()).padStart(2, "0")}`;
    };

    updateClock();

    setInterval(updateClock, 1000);
}

/*===============
   ICON SYSTEM
================*/

function iconUrl(file) {
    return `${ICON_PATH}${file.split("/").map(encodeURIComponent).join("/")}`;
}

function makeIconImage(
    file,
    className = "os-icon-image"
) {
    const img =
        document.createElement("img");

    img.className = className;
    img.src = iconUrl(file);
    img.alt = "";
    img.draggable = false;
    img.loading = "eager";

    img.onerror = () => {
        img.style.display = "none";
    };

    return img;
}

/*================
   DESKTOP ICONS
==================*/

function applyDesktopIcons() {
    const map = {
        "computer-window": ICONS.computer,
        "projects-window": ICONS.folder,
        "about-window": ICONS.about,
        "skills-window": ICONS.settings,
        "internet-window": ICONS.internet,
        "media-window": ICONS.media
    };

    document
        .querySelectorAll(".desktop-icon")
        .forEach(icon => {
            const holder =
                icon.querySelector(
                    ".desktop-icon-image"
                );

            const file =
                map[icon.dataset.window];

            if (!holder || !file) {
                return;
            }

            holder.innerHTML = "";

            holder.appendChild(
                makeIconImage(
                    file,
                    "desktop-real-icon"
                )
            );
        });
}

/* ====================
   WINDOW TITLE ICONS
======================= */

function applyWindowTitleIcons() {
    const map = {
        "computer-window": ICONS.computer,
        "projects-window": ICONS.folder,
        "about-window": ICONS.about,
        "skills-window": ICONS.settings,
        "internet-window": ICONS.internet,
        "media-window": ICONS.media,

        "api1-window": ICONS.document,
        "api2-window": ICONS.programGroup,
        "api3-window": ICONS.computer,
        "estacao-window": ICONS.sound
    };

    document
        .querySelectorAll(".os-window")
        .forEach(win => {
            const title =
                win.querySelector(".window-title");

            const file = map[win.id];

            if (!title || !file) {
                return;
            }

            title
                .querySelector(".window-real-icon")
                ?.remove();

            title.prepend(
                makeIconImage(
                    file,
                    "window-real-icon"
                )
            );
        });
}

/* ===============
   PROJECT ICONS
==================*/

function applyProjectIcons() {
    const map = {
        "API-1": ICONS.document,
        "API-2": ICONS.programGroup,
        "API-3": ICONS.computer,
        "Estação-TI": ICONS.sound
    };

    document
        .querySelectorAll(".project-item")
        .forEach(item => {
            const name =
                item
                    .querySelector(".project-name")
                    ?.textContent
                    .trim();

            const holder =
                item.querySelector(".project-icon");

            const file = map[name];

            if (!holder || !file) {
                return;
            }

            holder.innerHTML = "";

            holder.appendChild(
                makeIconImage(
                    file,
                    "project-real-icon"
                )
            );
        });
}

/* ================
   COMPUTER ICONS
=================== */

function applyComputerIcons() {
    const map = {
        "My Projects": ICONS.projects,
        "Installed Skills": ICONS.skills,
        "About Giovanna": ICONS.about,
        "Local Disk (C:)": ICONS.hardDrive,
        "Internet": ICONS.internet
    };

    document
        .querySelectorAll(".computer-item")
        .forEach(item => {
            const name =
                item
                    .querySelector("span")
                    ?.textContent
                    .trim();

            const holder =
                item.querySelector("div");

            const file = map[name];

            if (!holder || !file) {
                return;
            }

            holder.innerHTML = "";

            holder.appendChild(
                makeIconImage(
                    file,
                    "computer-real-icon"
                )
            );
        });
}

/* ==============
   SKILLS ICONS
================= */

function applySkillIcons() {
    const map = {
        Java: ICONS.program,
        "Spring Boot": ICONS.program,
        "C Development Tools": ICONS.msdos,
        JavaScript: ICONS.internetDoc,
        "JavaScript Runtime": ICONS.internetDoc,
        "Node.js Runtime": ICONS.program,
        "Node.js": ICONS.program,
        "Database Systems": ICONS.hardDrive,
        "SQL Tools": ICONS.hardDrive,
        "Web Development Pack": ICONS.internetDoc,
        "Git & GitHub": ICONS.network,
        Git: ICONS.network,
        GitHub: ICONS.network,
        Docker: ICONS.program,
        Linux: ICONS.computer,
        Postman: ICONS.internetDoc,
        Figma: ICONS.image,
        "Oracle Cloud": ICONS.network,
        Maven: ICONS.program
    };

    document
        .querySelectorAll(".skill-program")
        .forEach(program => {
            const title =
                program
                    .querySelector(
                        ".skill-program-info strong"
                    )
                    ?.textContent
                    .trim();

            const holder =
                program.querySelector(
                    ".skill-program-icon"
                );

            if (!holder) {
                return;
            }

            let file = map[title];

            if (!file) {
                const text =
                    program.textContent.toLowerCase();

                if (text.includes("java")) {
                    file = ICONS.program;
                } else if (
                    text.includes("mysql") ||
                    text.includes("sqlite") ||
                    text.includes("oracle") ||
                    text.includes("database") ||
                    text.includes("sql")
                ) {
                    file = ICONS.hardDrive;
                } else if (
                    text.includes("git") ||
                    text.includes("github")
                ) {
                    file = ICONS.network;
                } else if (
                    text.includes("html") ||
                    text.includes("css") ||
                    text.includes("javascript")
                ) {
                    file = ICONS.internetDoc;
                } else {
                    file = ICONS.program;
                }
            }

            holder.innerHTML = "";

            holder.appendChild(
                makeIconImage(
                    file,
                    "skill-real-icon"
                )
            );
        });
}

/* =============
   START ICON
================ */

function applyStartIcon() {
    const holder =
        document.querySelector(".windows-logo");

    if (!holder) {
        return;
    }

    holder.innerHTML = "";

    holder.appendChild(
        makeIconImage(
            ICONS.desktop,
            "start-icon-image"
        )
    );
}

/* ===========
   TRAY ICONS
============== */

function initializeTrayIcons() {
    const tray =
        document.getElementById(
            "taskbar-tray"
        );

    if (!tray) {
        return;
    }

    tray
        .querySelectorAll(".tray-icon")
        .forEach((holder, index) => {
            const file =
                index === 0
                    ? ICONS.sound
                    : ICONS.internet;

            holder.innerHTML = "";

            holder.appendChild(
                makeIconImage(
                    file,
                    "tray-icon-image"
                )
            );
        });
}

/* ======================
   APLICAÇÃO DOS ÍCONES
========================= */

function applyWindowsIcons() {
    applyDesktopIcons();
    applyWindowTitleIcons();
    applyProjectIcons();
    applyComputerIcons();
    applySkillIcons();
    applyStartIcon();
}

/* ==============
   WINDOW SYSTEM
================= */

function initializeWindows() {
    document
        .querySelectorAll(".os-window")
        .forEach(win => {
            win.style.display = "none";

            win.addEventListener(
                "pointerdown",
                () => bringToFront(win)
            );

            const close =
                win.querySelector(".window-close");

            const minimize =
                win.querySelector(".window-minimize");

            const maximize =
                win.querySelector(".window-maximize");

            close?.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();
                    closeWindow(win.id);
                }
            );

            minimize?.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();
                    minimizeWindow(win.id);
                }
            );

            maximize?.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();
                    maximizeWindow(win.id);
                }
            );
        });
}

const FLEX_WINDOWS = [
    "skills-window",
    "media-window"
];

function openWindow(id) {
    const win =
        document.getElementById(id);

    if (!win) {
        return;
    }

    win.style.display =
        FLEX_WINDOWS.includes(id)
            ? "flex"
            : "block";
    win.classList.add("active-window");

    bringToFront(win);
    updateTaskbarButton(id);

    if (id === "media-window") {
        initializeMediaPlayer();
        updateMediaDisplay();
    }

    if (id === "computer-window") {
        updateExplorerButtons();
    }
}

function closeWindow(id) {
    const win =
        document.getElementById(id);

    if (!win) {
        return;
    }

    win.classList.remove(
        "maximized",
        "active-window",
        "focused-window"
    );

    win.style.setProperty("display", "none", "important");

    removeTaskbarButton(id);

    if (id === "media-window") {
        mediaPlaying = false;
        stopMediaTimer();
        updateMediaDisplay();
    }

    focusTopVisibleWindow();
}

function minimizeWindow(id) {
    const win =
        document.getElementById(id);

    if (!win) {
        return;
    }

    win.style.display = "none";

    win.classList.remove(
        "active-window",
        "focused-window"
    );

    updateTaskbarButton(id);
    focusTopVisibleWindow();
}

function maximizeWindow(id) {
    const win =
        document.getElementById(id);

    if (!win) {
        return;
    }

    win.classList.toggle("maximized");
    bringToFront(win);
}

function bringToFront(win) {
    if (!win) {
        return;
    }

    highestZIndex += 1;

    win.style.zIndex =
        highestZIndex;

    document
        .querySelectorAll(".os-window")
        .forEach(other => {
            other.classList.remove(
                "focused-window"
            );
        });

    win.classList.add(
        "focused-window"
    );

    document
        .querySelectorAll(".taskbar-button")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.taskWindow === win.id
            );
        });
}

function focusTopVisibleWindow() {
    const visibleWindows =
        Array.from(
            document.querySelectorAll(
                ".os-window"
            )
        )
        .filter(win =>
            getComputedStyle(win).display !== "none"
        )
        .sort(
            (a, b) =>
                Number(a.style.zIndex || 0) -
                Number(b.style.zIndex || 0)
        );

    const top =
        visibleWindows[
            visibleWindows.length - 1
        ];

    if (top) {
        bringToFront(top);
    }
}

/* ===============================
   DESKTOP / PROJECTS / COMPUTER
================================== */

function bindDoubleOpen(selector) {
    document
        .querySelectorAll(selector)
        .forEach(item => {
            item.addEventListener(
                "dblclick",
                event => {
                    event.preventDefault();

                    const id =
                        item.dataset.window;

                    if (id) {
                        openWindow(id);
                    }
                }
            );
        });
}

function initializeDesktopIcons() {
    bindDoubleOpen(".desktop-icon");
}

function initializeProjectItems() {
    bindDoubleOpen(".project-item");
}

function initializeComputerItems() {
    bindDoubleOpen(".computer-item");
}

/* ==========
   EXPLORER
============= */

function initializeExplorer() {
    const explorer =
        document.getElementById(
            "computer-window"
        );

    if (!explorer) {
        return;
    }

    renderExplorer(
        "computer",
        false
    );

    explorer.addEventListener(
        "click",
        event => {
            const actionButton =
                event.target.closest(
                    "[data-explorer-action]"
                );

            if (actionButton) {
                event.preventDefault();

                handleExplorerAction(
                    actionButton.dataset
                        .explorerAction
                );

                return;
            }

            const pathButton =
                event.target.closest(
                    "[data-explorer-path]"
                );

            if (pathButton) {
                event.preventDefault();

                navigateExplorer(
                    pathButton.dataset
                        .explorerPath
                );

                return;
            }

            const sidebarWindow =
                event.target.closest(
                    ".explorer-sidebar [data-window]"
                );

            if (sidebarWindow) {
                event.preventDefault();

                openWindow(
                    sidebarWindow.dataset.window
                );
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            const explorerFocused =
                document
                    .getElementById(
                        "computer-window"
                    )
                    ?.classList.contains(
                        "focused-window"
                    );

            if (!explorerFocused) {
                return;
            }

            if (
                event.altKey &&
                event.key === "ArrowLeft"
            ) {
                event.preventDefault();
                handleExplorerAction("back");
            }

            if (
                event.altKey &&
                event.key === "ArrowRight"
            ) {
                event.preventDefault();
                handleExplorerAction("forward");
            }
        }
    );
}

function navigateExplorer(path) {
    if (!explorerData[path]) {
        return;
    }

    if (
        explorerCurrentPath !== path
    ) {
        explorerHistory =
            explorerHistory.slice(
                0,
                explorerHistoryIndex + 1
            );

        explorerHistory.push(path);
        explorerHistoryIndex++;
    }

    explorerCurrentPath = path;

    renderExplorer(
        path,
        true
    );
}

function renderExplorer(
    path,
    focus = true
) {
    const data =
        explorerData[path];

    const container =
        document.getElementById(
            "explorer-items"
        );

    if (!data || !container) {
        return;
    }

    explorerCurrentPath =
        path;

    container.innerHTML = "";

    const title =
        document.getElementById(
            "explorer-heading-title"
        );

    const subtitle =
        document.getElementById(
            "explorer-heading-subtitle"
        );

    const address =
        document.getElementById(
            "explorer-address-text"
        );

    const detailsName =
        document.getElementById(
            "explorer-details-name"
        );

    const detailsDescription =
        document.getElementById(
            "explorer-details-description"
        );

    const count =
        document.getElementById(
            "explorer-status-count"
        );

    const statusPath =
        document.getElementById(
            "explorer-status-path"
        );

    if (title) {
        title.textContent =
            data.title;
    }

    if (subtitle) {
        subtitle.textContent =
            data.subtitle;
    }

    if (address) {
        address.textContent =
            data.address;
    }

    if (detailsName) {
        detailsName.textContent =
            data.title;
    }

    if (detailsDescription) {
        detailsDescription.textContent =
            data.details;
    }

    if (count) {
        count.textContent =
            `${data.items.length} objects`;
    }

    if (statusPath) {
        statusPath.textContent =
            data.address;
    }

    data.items.forEach(item => {
        const element =
            document.createElement("div");

        element.className =
            "explorer-item";

        element.title =
            item.description ||
            item.name;

        element.dataset.window =
            item.window || "";

        element.dataset.path =
            item.path || "";

        const icon =
            document.createElement("div");

        icon.className =
            "explorer-item-icon";

        icon.appendChild(
            makeIconImage(
                item.icon,
                "explorer-icon-image"
            )
        );

        const name =
            document.createElement("div");

        name.className =
            "explorer-item-name";

        name.textContent =
            item.name;

        const type =
            document.createElement("div");

        type.className =
            "explorer-item-type";

        type.textContent =
            item.type;

        element.append(
            icon,
            name,
            type
        );

        element.addEventListener(
            "click",
            () => {
                container
                    .querySelectorAll(
                        ".explorer-item.selected"
                    )
                    .forEach(selected => {
                        selected.classList.remove(
                            "selected"
                        );
                    });

                element.classList.add(
                    "selected"
                );

                updateExplorerDetails(
                    item.name,
                    item.description ||
                    item.type
                );
            }
        );

        element.addEventListener(
            "dblclick",
            event => {
                event.preventDefault();

                if (item.path) {
                    navigateExplorer(
                        item.path
                    );

                    return;
                }

                if (item.window) {
                    openWindow(
                        item.window
                    );

                    buddySayExplorer(
                        `${item.name} aberto.`
                    );

                    return;
                }

                showExplorerMessage(
                    "Control Panel",
                    "As configurações do sistema ainda estão sendo desenvolvidas."
                );
            }
        );

        container.appendChild(
            element
        );
    });

    updateExplorerButtons();

    if (focus) {
        const win =
            document.getElementById(
                "computer-window"
            );

        if (win) {
            bringToFront(win);
        }
    }
}

function updateExplorerDetails(
    name,
    description
) {
    const nameElement =
        document.getElementById(
            "explorer-details-name"
        );

    const descriptionElement =
        document.getElementById(
            "explorer-details-description"
        );

    if (nameElement) {
        nameElement.textContent =
            name;
    }

    if (descriptionElement) {
        descriptionElement.textContent =
            description;
    }
}

function updateExplorerButtons() {
    const back =
        document.querySelector(
            '[data-explorer-action="back"]'
        );

    const forward =
        document.querySelector(
            '[data-explorer-action="forward"]'
        );

    const up =
        document.querySelector(
            '[data-explorer-action="up"]'
        );

    if (back) {
        back.disabled =
            explorerHistoryIndex <= 0;
    }

    if (forward) {
        forward.disabled =
            explorerHistoryIndex >=
            explorerHistory.length - 1;
    }

    if (up) {
        up.disabled =
            explorerCurrentPath ===
            "computer";
    }
}

function handleExplorerAction(
    action
) {
    if (
        action === "back" &&
        explorerHistoryIndex > 0
    ) {
        explorerHistoryIndex--;

        explorerCurrentPath =
            explorerHistory[
                explorerHistoryIndex
            ];

        renderExplorer(
            explorerCurrentPath
        );

        return;
    }

    if (
        action === "forward" &&
        explorerHistoryIndex <
            explorerHistory.length - 1
    ) {
        explorerHistoryIndex++;

        explorerCurrentPath =
            explorerHistory[
                explorerHistoryIndex
            ];

        renderExplorer(
            explorerCurrentPath
        );

        return;
    }

    if (
        action === "up" &&
        explorerCurrentPath !==
            "computer"
    ) {
        navigateExplorer(
            "computer"
        );

        return;
    }

    if (action === "folders") {
        const sidebar =
            document.querySelector(
                ".explorer-sidebar"
            );

        if (sidebar) {
            sidebar.classList.toggle(
                "explorer-sidebar-hidden"
            );
        }

        return;
    }

    if (action === "search") {
        showExplorerMessage(
            "Search",
            "Search is simulated for now.<br><br>Try opening My Projects or Installed Skills."
        );

        return;
    }

    if (action === "go") {
        const data =
            explorerData[
                explorerCurrentPath
            ];

        if (data) {
            showExplorerMessage(
                "Go",
                `Current location: ${data.address}`
            );
        }
    }
}

function initializeComputerItems() {
    bindDoubleOpen(".computer-item");
}

/* =========
   EXPLORER
============ */

function initializeExplorer() {
    const explorer =
        document.getElementById(
            "computer-window"
        );

    if (!explorer) {
        return;
    }

    renderExplorer(
        "computer",
        false
    );

    explorer.addEventListener(
        "click",
        event => {
            const actionButton =
                event.target.closest(
                    "[data-explorer-action]"
                );

            if (actionButton) {
                event.preventDefault();

                handleExplorerAction(
                    actionButton.dataset
                        .explorerAction
                );

                return;
            }

            const pathButton =
                event.target.closest(
                    "[data-explorer-path]"
                );

            if (pathButton) {
                event.preventDefault();

                navigateExplorer(
                    pathButton.dataset
                        .explorerPath
                );

                return;
            }

            const sidebarWindow =
                event.target.closest(
                    ".explorer-sidebar [data-window]"
                );

            if (sidebarWindow) {
                event.preventDefault();

                openWindow(
                    sidebarWindow.dataset.window
                );
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            const explorerFocused =
                document
                    .getElementById(
                        "computer-window"
                    )
                    ?.classList.contains(
                        "focused-window"
                    );

            if (!explorerFocused) {
                return;
            }

            if (
                event.altKey &&
                event.key === "ArrowLeft"
            ) {
                event.preventDefault();
                handleExplorerAction("back");
            }

            if (
                event.altKey &&
                event.key === "ArrowRight"
            ) {
                event.preventDefault();
                handleExplorerAction("forward");
            }
        }
    );
}

function navigateExplorer(path) {
    if (!explorerData[path]) {
        return;
    }

    if (
        explorerCurrentPath !== path
    ) {
        explorerHistory =
            explorerHistory.slice(
                0,
                explorerHistoryIndex + 1
            );

        explorerHistory.push(path);
        explorerHistoryIndex++;
    }

    explorerCurrentPath = path;

    renderExplorer(
        path,
        true
    );
}

function renderExplorer(
    path,
    focus = true
) {
    const data =
        explorerData[path];

    const container =
        document.getElementById(
            "explorer-items"
        );

    if (!data || !container) {
        return;
    }

    explorerCurrentPath =
        path;

    container.innerHTML = "";

    const title =
        document.getElementById(
            "explorer-heading-title"
        );

    const subtitle =
        document.getElementById(
            "explorer-heading-subtitle"
        );

    const address =
        document.getElementById(
            "explorer-address-text"
        );

    const detailsName =
        document.getElementById(
            "explorer-details-name"
        );

    const detailsDescription =
        document.getElementById(
            "explorer-details-description"
        );

    const count =
        document.getElementById(
            "explorer-status-count"
        );

    const statusPath =
        document.getElementById(
            "explorer-status-path"
        );

    if (title) {
        title.textContent =
            data.title;
    }

    if (subtitle) {
        subtitle.textContent =
            data.subtitle;
    }

    if (address) {
        address.textContent =
            data.address;
    }

    if (detailsName) {
        detailsName.textContent =
            data.title;
    }

    if (detailsDescription) {
        detailsDescription.textContent =
            data.details;
    }

    if (count) {
        count.textContent =
            `${data.items.length} objects`;
    }

    if (statusPath) {
        statusPath.textContent =
            data.address;
    }

    data.items.forEach(item => {
        const element =
            document.createElement("div");

        element.className =
            "explorer-item";

        element.title =
            item.description ||
            item.name;

        element.dataset.window =
            item.window || "";

        element.dataset.path =
            item.path || "";

        const icon =
            document.createElement("div");

        icon.className =
            "explorer-item-icon";

        icon.appendChild(
            makeIconImage(
                item.icon,
                "explorer-icon-image"
            )
        );

        const name =
            document.createElement("div");

        name.className =
            "explorer-item-name";

        name.textContent =
            item.name;

        const type =
            document.createElement("div");

        type.className =
            "explorer-item-type";

        type.textContent =
            item.type;

        element.append(
            icon,
            name,
            type
        );

        element.addEventListener(
            "click",
            () => {
                container
                    .querySelectorAll(
                        ".explorer-item.selected"
                    )
                    .forEach(selected => {
                        selected.classList.remove(
                            "selected"
                        );
                    });

                element.classList.add(
                    "selected"
                );

                updateExplorerDetails(
                    item.name,
                    item.description ||
                    item.type
                );
            }
        );

        element.addEventListener(
            "dblclick",
            event => {
                event.preventDefault();

                if (item.path) {
                    navigateExplorer(
                        item.path
                    );

                    return;
                }

                if (item.window) {
                    openWindow(
                        item.window
                    );

                    buddySayExplorer(
                        `${item.name} aberto.`
                    );

                    return;
                }

                showExplorerMessage(
                    "Control Panel",
                    "As configurações do sistema ainda estão sendo desenvolvidas."
                );
            }
        );

        container.appendChild(
            element
        );
    });

    updateExplorerButtons();

    if (focus) {
        const win =
            document.getElementById(
                "computer-window"
            );

        if (win) {
            bringToFront(win);
        }
    }
}

function updateExplorerDetails(
    name,
    description
) {
    const nameElement =
        document.getElementById(
            "explorer-details-name"
        );

    const descriptionElement =
        document.getElementById(
            "explorer-details-description"
        );

    if (nameElement) {
        nameElement.textContent =
            name;
    }

    if (descriptionElement) {
        descriptionElement.textContent =
            description;
    }
}

function updateExplorerButtons() {
    const back =
        document.querySelector(
            '[data-explorer-action="back"]'
        );

    const forward =
        document.querySelector(
            '[data-explorer-action="forward"]'
        );

    const up =
        document.querySelector(
            '[data-explorer-action="up"]'
        );

    if (back) {
        back.disabled =
            explorerHistoryIndex <= 0;
    }

    if (forward) {
        forward.disabled =
            explorerHistoryIndex >=
            explorerHistory.length - 1;
    }

    if (up) {
        up.disabled =
            explorerCurrentPath ===
            "computer";
    }
}

function handleExplorerAction(
    action
) {
    if (
        action === "back" &&
        explorerHistoryIndex > 0
    ) {
        explorerHistoryIndex--;

        explorerCurrentPath =
            explorerHistory[
                explorerHistoryIndex
            ];

        renderExplorer(
            explorerCurrentPath
        );

        return;
    }

    if (
        action === "forward" &&
        explorerHistoryIndex <
            explorerHistory.length - 1
    ) {
        explorerHistoryIndex++;

        explorerCurrentPath =
            explorerHistory[
                explorerHistoryIndex
            ];

        renderExplorer(
            explorerCurrentPath
        );

        return;
    }

    if (
        action === "up" &&
        explorerCurrentPath !==
            "computer"
    ) {
        navigateExplorer(
            "computer"
        );

        return;
    }

    if (action === "folders") {
        const sidebar =
            document.querySelector(
                ".explorer-sidebar"
            );

        if (sidebar) {
            sidebar.classList.toggle(
                "explorer-sidebar-hidden"
            );
        }

        return;
    }

    if (action === "search") {
        showExplorerMessage(
            "Search",
            "Search is simulated for now.<br><br>Try opening My Projects or Installed Skills."
        );

        return;
    }

    if (action === "go") {
        const data =
            explorerData[
                explorerCurrentPath
            ];

        if (data) {
            showExplorerMessage(
                "Go",
                `Current location: ${data.address}`
            );
        }
    }
}

function showExplorerMessage(
    title,
    message
) {
    document
        .getElementById(
            "explorer-message"
        )
        ?.remove();

    const box =
        document.createElement("div");

    box.id =
        "explorer-message";

    box.className =
        "gio-alert";

    box.style.left =
        `${Math.max(
            20,
            window.innerWidth / 2 - 165
        )}px`;

    box.style.top =
        `${Math.max(
            50,
            window.innerHeight / 2 - 120
        )}px`;

    box.innerHTML = `
        <div class="gio-alert-title">
            ${title}
        </div>

        <div class="gio-alert-body">
            <div class="gio-alert-icon">
                <img src="img/icons/HelpandSupport.png" alt="" aria-hidden="true" width="32" height="32">
            </div>

            <div class="gio-alert-text">
                ${message}
            </div>
        </div>

        <div class="gio-alert-footer">
            <button
                type="button"
                id="explorer-message-ok"
            >
                OK
            </button>
        </div>
    `;

    document
        .getElementById("desktop")
        ?.appendChild(box);

    box
        .querySelector(
            "#explorer-message-ok"
        )
        ?.addEventListener(
            "click",
            () => box.remove()
        );
}

function buddySayExplorer(
    message
) {
    if (
        document.getElementById(
            "giobuddy"
        )
    ) {
        buddySay(message);
    }
}

/* ================
   WINDOW DRAGGING
=================== */

function initializeWindowDragging() {
    document
        .querySelectorAll(
            ".window-titlebar, .media-player-top"
        )
        .forEach(handle => {
            handle.addEventListener(
                "pointerdown",
                startWindowDrag
            );
        });

    document.addEventListener(
        "pointermove",
        moveWindowDrag
    );

    document.addEventListener(
        "pointerup",
        endWindowDrag
    );

    document.addEventListener(
        "pointercancel",
        endWindowDrag
    );
}

function startWindowDrag(event) {
    if (event.button !== 0) {
        return;
    }

    if (
        event.target.closest(
            "button, input, select, textarea, a"
        )
    ) {
        return;
    }

    const win =
        event.currentTarget.closest(
            ".os-window"
        );

    if (!win) {
        return;
    }

    if (
        win.classList.contains(
            "maximized"
        )
    ) {
        return;
    }

    const rect =
        win.getBoundingClientRect();

    draggedWindow = win;
    windowDragPointerId =
        event.pointerId;

    dragOffsetX =
        event.clientX - rect.left;

    dragOffsetY =
        event.clientY - rect.top;

    bringToFront(win);

    event.currentTarget
        .setPointerCapture?.(
            event.pointerId
        );

    event.preventDefault();

    document.body.style.userSelect =
        "none";
}

function moveWindowDrag(event) {
    if (!draggedWindow) {
        return;
    }

    if (
        event.pointerId !==
        windowDragPointerId
    ) {
        return;
    }

    const desktop =
        document.getElementById(
            "desktop"
        );

    if (!desktop) {
        return;
    }

    const desktopRect =
        desktop.getBoundingClientRect();

    const maxX =
        Math.max(
            0,
            desktop.clientWidth -
            draggedWindow.offsetWidth
        );

    const maxY =
        Math.max(
            0,
            desktop.clientHeight -
            31 -
            draggedWindow.offsetHeight
        );

    const x =
        event.clientX -
        desktopRect.left -
        dragOffsetX;

    const y =
        event.clientY -
        desktopRect.top -
        dragOffsetY;

    draggedWindow.style.left =
        `${Math.max(
            0,
            Math.min(x, maxX)
        )}px`;

    draggedWindow.style.top =
        `${Math.max(
            0,
            Math.min(y, maxY)
        )}px`;
}

function endWindowDrag(event) {
    if (!draggedWindow) {
        return;
    }

    if (
        event &&
        windowDragPointerId !== null &&
        event.pointerId !==
            windowDragPointerId
    ) {
        return;
    }

    draggedWindow = null;
    windowDragPointerId = null;

    document.body.style.userSelect =
        "";
}

/* =========
   TASKBAR
============ */

function initializeTaskbar() {
    const startButton =
        document.getElementById(
            "start-button"
        );

    const startMenu =
        document.getElementById(
            "start-menu"
        );

    if (
        !startButton ||
        !startMenu
    ) {
        return;
    }

    startButton.addEventListener(
        "click",
        event => {
            event.preventDefault();
            event.stopPropagation();

            startMenu.classList.toggle(
                "open"
            );
        }
    );
}

function updateTaskbarButton(
    id
) {
    const taskbar =
        document.getElementById(
            "taskbar-programs"
        );

    const win =
        document.getElementById(id);

    if (!taskbar || !win) {
        return;
    }

    let button =
        taskbar.querySelector(
            `[data-task-window="${id}"]`
        );

    if (!button) {
        button =
            document.createElement(
                "button"
            );

        button.type = "button";
        button.className =
            "taskbar-button";

        button.dataset.taskWindow =
            id;

        const img =
            makeIconImage(
                TASKBAR_ICONS[id] ||
                ICONS.program,
                "taskbar-icon-image"
            );

        const title =
            win
                .querySelector(
                    ".window-title, .media-player-brand"
                )
                ?.textContent
                .trim() ||
            id;

        const cleanTitle =
            title.replace(
                /^[^\p{L}\p{N}]+/u,
                ""
            );

        button.append(
            img,
            document.createTextNode(
                ` ${cleanTitle}`
            )
        );

        button.addEventListener(
            "click",
            () => {
                const current =
                    document.getElementById(
                        id
                    );

                if (!current) {
                    return;
                }

                const hidden =
                    getComputedStyle(
                        current
                    ).display === "none";

                const focused =
                    current.classList.contains(
                        "focused-window"
                    );

                if (hidden) {
                    openWindow(id);
                } else if (focused) {
                    minimizeWindow(id);
                } else {
                    bringToFront(current);
                }
            }
        );

        taskbar.appendChild(
            button
        );
    }

    document
        .querySelectorAll(
            ".taskbar-button"
        )
        .forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.taskWindow === id
            );
        });
}

function removeTaskbarButton(
    id
) {
    document
        .querySelector(
            `[data-task-window="${id}"]`
        )
        ?.remove();
}

function updateTaskbarFromOpenWindows() {
    document
        .querySelectorAll(
            ".os-window"
        )
        .forEach(win => {
            if (
                getComputedStyle(win)
                    .display !== "none"
            ) {
                updateTaskbarButton(
                    win.id
                );
            }
        });
}

/* ============
   START MENU
=============== */

function initializeStartMenu() {
    const menu =
        document.getElementById(
            "start-menu"
        );

    if (!menu) {
        return;
    }

    menu
        .querySelectorAll(
            "[data-window]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    openWindow(
                        button.dataset.window
                    );

                    menu.classList.remove(
                        "open"
                    );
                }
            );
        });

    document.addEventListener(
        "click",
        event => {
            const start =
                document.getElementById(
                    "start-button"
                );

            if (
                start &&
                !menu.contains(
                    event.target
                ) &&
                !start.contains(
                    event.target
                )
            ) {
                menu.classList.remove(
                    "open"
                );
            }
        }
    );
}

/* ==============
   MEDIA PLAYER
================= */

function initializeMediaPlayer() {
    const player = document.getElementById("media-window");
    if (!player || player.dataset.initialized === "true") return;
    player.dataset.initialized = "true";

    mediaAudio = new Audio();
    mediaAudio.preload = "metadata";
    mediaAudio.volume = 0.75;
    mediaAudio.addEventListener("loadedmetadata", () => {
        const track = mediaTracks[mediaIndex];
        track.duration = Number.isFinite(mediaAudio.duration) ? Math.floor(mediaAudio.duration) : 0;
        updateMediaDisplay();
    });
    mediaAudio.addEventListener("timeupdate", () => {
        mediaSeconds = Math.floor(mediaAudio.currentTime || 0);
        updateMediaDisplay();
    });
    mediaAudio.addEventListener("play", () => { mediaPlaying = true; initializeMediaEqualizer(); if (mediaAudioContext && mediaAudioContext.state === "suspended") mediaAudioContext.resume(); updateMediaDisplay(); renderMediaPlaylist(); animateMediaVisualizer(); });
    mediaAudio.addEventListener("pause", () => { mediaPlaying = false; if (mediaVisualFrame) cancelAnimationFrame(mediaVisualFrame); mediaVisualFrame = null; updateMediaDisplay(); renderMediaPlaylist(); });
    mediaAudio.addEventListener("ended", () => { if (mediaRepeat) loadMediaTrack(mediaIndex, true); else changeMediaTrack(mediaShuffle ? Math.floor(Math.random() * (mediaTracks.length - 1)) + 1 : 1, true); });
    mediaAudio.addEventListener("error", () => {
        const status = document.getElementById("mp-status");
        if (status) status.textContent = "ERRO AO ABRIR ARQUIVO";
    });

    player.querySelectorAll("[data-mp-action]").forEach(button => {
        button.addEventListener("click", () => handleMediaAction(button.dataset.mpAction));
    });
    renderMediaPlaylist();
    setMediaVisualMode("psychedelic");
    player.querySelectorAll("[data-mp-menu]").forEach(button => button.addEventListener("click", event => {
        event.stopPropagation();
        const name = button.dataset.mpMenu;
        const popup = player.querySelector(`[data-mp-popup="${name}"]`);
        const wasOpen = popup && !popup.hidden;
        closeMediaMenus();
        if (popup && !wasOpen) { popup.hidden = false; button.setAttribute("aria-expanded", "true"); }
    }));
    player.querySelectorAll("[data-mp-menu-action]").forEach(button => button.addEventListener("click", () => {
        const action = button.dataset.mpMenuAction;
        closeMediaMenus();
        if (action === "open-playlist") toggleMediaDock("playlist");
        else if (action === "open-equalizer") toggleMediaDock("equalizer");
        else if (action === "close-player") handleMediaAction("close");
        else handleMediaAction(action);
    }));
    player.querySelectorAll("[data-mp-visual]").forEach(button => button.addEventListener("click", () => {
        setMediaVisualMode(button.dataset.mpVisual);
        closeMediaMenus();
    }));
    player.querySelectorAll("[data-mp-toggle]").forEach(button => button.addEventListener("click", () => {
        const key = button.dataset.mpToggle;
        if (key === "shuffle") mediaShuffle = !mediaShuffle;
        if (key === "repeat") mediaRepeat = !mediaRepeat;
        button.classList.toggle("is-enabled", key === "shuffle" ? mediaShuffle : mediaRepeat);
        button.textContent = `${key === "shuffle" ? (mediaShuffle ? "☑" : "☐") + " Reprodução aleatória" : (mediaRepeat ? "☑" : "☐") + " Repetir faixa"}`;
        const status = document.getElementById("mp-status");
        if (status) status.textContent = `${key === "shuffle" ? "ALEATÓRIA" : "REPETIÇÃO"}: ${(key === "shuffle" ? mediaShuffle : mediaRepeat) ? "ATIVADA" : "DESATIVADA"}`;
        closeMediaMenus();
    }));
    document.addEventListener("click", event => { if (!player.contains(event.target)) closeMediaMenus(); });
    player.querySelectorAll("[data-eq-band]").forEach(input => {
        input.addEventListener("input", () => {
            const band = Number(input.dataset.eqBand);
            const output = input.parentElement.querySelector("output");
            if (output) output.textContent = `${input.value} dB`;
            if (mediaEqFilters[band]) mediaEqFilters[band].gain.value = mediaEqEnabled ? Number(input.value) : 0;
        });
    });
    const eqEnabled = document.getElementById("mp-eq-enabled");
    if (eqEnabled) eqEnabled.addEventListener("change", () => {
        mediaEqEnabled = eqEnabled.checked;
        mediaEqFilters.forEach((filter, index) => {
            const slider = player.querySelector(`[data-eq-band="${index}"]`);
            filter.gain.value = mediaEqEnabled && slider ? Number(slider.value) : 0;
        });
    });
    player.querySelectorAll("[data-eq-preset]").forEach(button => button.addEventListener("click", () => applyMediaEqPreset(button.dataset.eqPreset)));

    const progress = document.getElementById("mp-progress-track");
    if (progress) {
        progress.setAttribute("role", "slider");
        progress.setAttribute("aria-label", "Progresso da música");
        progress.tabIndex = 0;
        const seek = event => {
            if (!mediaAudio || !Number.isFinite(mediaAudio.duration) || !mediaAudio.duration) return;
            const rect = progress.getBoundingClientRect();
            const clientX = event.clientX ?? (rect.left + (event.offsetX || 0));
            mediaAudio.currentTime = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * mediaAudio.duration;
        };
        progress.addEventListener("click", seek);
        progress.addEventListener("keydown", event => {
            if (event.key === "ArrowRight" && mediaAudio) mediaAudio.currentTime = Math.min(mediaAudio.duration || 0, mediaAudio.currentTime + 5);
            if (event.key === "ArrowLeft" && mediaAudio) mediaAudio.currentTime = Math.max(0, mediaAudio.currentTime - 5);
        });
    }

    const volume = document.getElementById("mp-volume-control");
    if (volume) {
        volume.addEventListener("input", () => {
            if (mediaAudio) mediaAudio.volume = Number(volume.value) / 100;
            const status = document.getElementById("mp-status");
            if (status) status.textContent = `VOLUME ${volume.value}%`;
        });
    }
    loadMediaTrack(0, false);
}

function initializeMediaEqualizer() {
    if (!mediaAudio || mediaAudioContext || !window.AudioContext && !window.webkitAudioContext) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        mediaAudioContext = new AudioContextClass();
        mediaEqSource = mediaAudioContext.createMediaElementSource(mediaAudio);
        const frequencies = [60, 170, 310, 1000, 6000, 12000];
        mediaEqFilters = frequencies.map((frequency, index) => {
            const filter = mediaAudioContext.createBiquadFilter();
            filter.type = index === 0 ? "lowshelf" : index === frequencies.length - 1 ? "highshelf" : "peaking";
            filter.frequency.value = frequency;
            filter.Q.value = 1;
            filter.gain.value = 0;
            return filter;
        });
        mediaAnalyser = mediaAudioContext.createAnalyser();
        mediaAnalyser.fftSize = 256;
        mediaEqSource.connect(mediaEqFilters[0]);
        mediaEqFilters.forEach((filter, index) => filter.connect(mediaEqFilters[index + 1] || mediaAnalyser));
        mediaAnalyser.connect(mediaAudioContext.destination);
    } catch (error) {
        mediaEqFilters = [];
        console.warn("Equalizador indisponível neste navegador:", error);
    }
}

function applyMediaEqPreset(preset) {
    const presets = {
        flat: [0, 0, 0, 0, 0, 0],
        bass: [8, 6, 3, 0, -1, 0],
        pop: [-1, 2, 5, 4, 2, -1],
        rock: [5, 3, -1, 2, 5, 4]
    };
    const values = presets[preset] || presets.flat;
    document.querySelectorAll("#media-window [data-eq-band]").forEach((input, index) => {
        input.value = values[index];
        const output = input.parentElement.querySelector("output");
        if (output) output.textContent = `${values[index]} dB`;
        if (mediaEqFilters[index]) mediaEqFilters[index].gain.value = mediaEqEnabled ? values[index] : 0;
    });
    const status = document.getElementById("mp-status");
    if (status) status.textContent = `EQUALIZADOR: ${preset.toUpperCase()}`;
}

function renderMediaPlaylist() {
    const list = document.getElementById("mp-playlist-list");
    if (!list) return;
    list.innerHTML = mediaTracks.map((track, index) => `
        <button type="button" class="mp-playlist-item${index === mediaIndex ? " is-current" : ""}" data-mp-track="${index}" aria-current="${index === mediaIndex ? "true" : "false"}">
            <span class="mp-playlist-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="mp-playlist-note">♫</span>
            <span class="mp-playlist-track"><strong>${track.title}</strong><small>${track.artist}</small></span>
            <span class="mp-playlist-state">${index === mediaIndex ? (mediaPlaying ? "▶" : "♪") : ""}</span>
        </button>`).join("");
    list.querySelectorAll("[data-mp-track]").forEach(button => button.addEventListener("click", () => loadMediaTrack(Number(button.dataset.mpTrack), true)));
}

function toggleMediaDock(mode) {
    const dock = document.getElementById("mp-dock");
    const playlist = document.getElementById("mp-playlist-panel");
    const equalizer = document.getElementById("mp-equalizer-panel");
    const title = document.getElementById("mp-dock-title");
    if (!dock || !playlist || !equalizer) return;
    const alreadyOpen = !dock.hidden && (mode === "playlist" ? !playlist.hidden : !equalizer.hidden);
    dock.hidden = alreadyOpen;
    playlist.hidden = mode !== "playlist" || alreadyOpen;
    equalizer.hidden = mode !== "equalizer" || alreadyOpen;
    if (title) title.textContent = mode === "playlist" ? "LISTA DE REPRODUÇÃO" : "EFEITOS DE ÁUDIO";
    if (mode === "playlist") renderMediaPlaylist();
    if (!alreadyOpen && mode === "equalizer") initializeMediaEqualizer();
}

function closeMediaMenus() {
    const player = document.getElementById("media-window");
    if (!player) return;
    player.querySelectorAll("[data-mp-popup]").forEach(popup => popup.hidden = true);
    player.querySelectorAll("[data-mp-menu]").forEach(button => button.setAttribute("aria-expanded", "false"));
}

function setMediaVisualMode(mode) {
    const display = document.querySelector("#media-window .media-player-display");
    if (!display) return;
    mediaVisualMode = ["bars", "wave", "orbit", "classic", "psychedelic"].includes(mode) ? mode : "bars";
    display.dataset.visualMode = mediaVisualMode;
    const status = document.getElementById("mp-status");
    const labels = { bars: "BARRAS ANIMADAS", wave: "ONDA DIGITAL", orbit: "ÓRBITA", classic: "VISUALIZAÇÃO CLÁSSICA", psychedelic: "FORMAS PSICODÉLICAS" };
    if (status) status.textContent = `VISUALIZAÇÃO: ${labels[mediaVisualMode]}`;
    display.querySelectorAll(".mp-visualizer span").forEach((bar, index) => {
        bar.style.animationDelay = `${-(index % 7) * 0.13}s`;
    });
    const canvas = document.getElementById("mp-psychedelic-canvas");
    if (canvas) canvas.hidden = mediaVisualMode !== "psychedelic";
    const bars = display.querySelectorAll(".mp-visualizer span");
    bars.forEach(bar => bar.hidden = mediaVisualMode === "psychedelic");
}

function animateMediaVisualizer() {
    if (mediaVisualFrame) cancelAnimationFrame(mediaVisualFrame);
    const bars = [...document.querySelectorAll("#mp-visualizer span")];
    const canvas = document.getElementById("mp-psychedelic-canvas");
    const ctx = canvas ? canvas.getContext("2d", { alpha: false, desynchronized: true }) : null;
    const data = mediaAnalyser ? new Uint8Array(mediaAnalyser.frequencyBinCount) : null;
    let phase = 0;
    let lastFrameAt = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let renderScale = 1;

    const resizeCanvas = () => {
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        canvasWidth = Math.max(1, Math.floor(rect.width));
        canvasHeight = Math.max(1, Math.floor(rect.height));
        renderScale = Math.min(1, 900 / canvasWidth, 560 / canvasHeight);
        const backingWidth = Math.max(1, Math.floor(canvasWidth * renderScale));
        const backingHeight = Math.max(1, Math.floor(canvasHeight * renderScale));
        if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
            canvas.width = backingWidth;
            canvas.height = backingHeight;
        }
        ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    };

    //parte psicodélica do media player
    const drawPsychedelic = (values) => {
        if (!canvas || !ctx || mediaVisualMode !== "psychedelic") return;
        const rect = canvas.getBoundingClientRect();
        if (Math.abs(rect.width - canvasWidth) > 2 || Math.abs(rect.height - canvasHeight) > 2) resizeCanvas();
        const width = canvasWidth;
        const height = canvasHeight;
        const energy = values ? values.reduce((sum, v) => sum + v, 0) / values.length / 255 : 0.38;
        const bass = values ? (values[2] || 0) / 255 : 0.35;
        const treble = values ? (values[Math.min(values.length - 1, 30)] || 0) / 255 : 0.4;
        const cx = width / 2, cy = height / 2;
        const size = Math.min(width, height);
        const base = size * (0.16 + bass * 0.15);

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(1, 2, 18, 0.22)";
        ctx.fillRect(0, 0, width, height);
        const rainbow = ctx.createRadialGradient(cx, cy, 1, cx, cy, size * .65);
        rainbow.addColorStop(0, `hsla(${(phase * 40) % 360},100%,55%,${.10 + energy * .12})`);
        rainbow.addColorStop(.55, `hsla(${(phase * 40 + 130) % 360},100%,45%,.045)`);
        rainbow.addColorStop(1, "rgba(0,0,10,0)");
        ctx.fillStyle = rainbow;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter";

        for (let layer = 0; layer < 7; layer++) {
            const points = 100;
            const hue = (phase * 68 + layer * 43 + bass * 100) % 360;
            const petalCount = 3 + (layer % 7);
            const spin = phase * (layer % 2 ? .38 : -.29) + layer * .31;
            ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const a = i / points * Math.PI * 2;
                const bin = values ? (values[Math.floor(i / points * (values.length - 1))] || 0) / 255 : .38;
                const petals = Math.sin(a * petalCount + phase * (1.5 + layer * .08) + layer) * (base * (.22 + bin * .85));
                const wave = Math.cos(a * (petalCount * 2 + 1) - phase * 1.7 + layer) * base * (.08 + treble * .2);
                const radius = base * (.55 + layer * .19) + petals + wave;
                const x = cx + Math.cos(a + spin) * radius * (1.05 + .15 * Math.sin(phase * .7 + layer));
                const y = cy + Math.sin(a + spin) * radius * (.62 + .22 * Math.cos(phase + layer));
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = `hsla(${hue},100%,${58 + energy * 30}%,${.42 + (layer % 3) * .12})`;
            ctx.lineWidth = .9 + energy * 2.4 + treble;
            ctx.stroke();
        }

        for (let ring = 0; ring < 4; ring++) {
            const radius = base * (.55 + ring * .58) * (1 + Math.sin(phase * 1.4 + ring) * (.04 + bass * .08));
            ctx.beginPath();
            ctx.ellipse(cx, cy, radius, radius * (.48 + .1 * Math.sin(phase + ring)), phase * .22 * (ring % 2 ? 1 : -1), 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${(phase * 82 + ring * 48) % 360},100%,65%,${.18 + energy * .22})`;
            ctx.lineWidth = 1 + treble * 1.5;
            ctx.stroke();
        }

        for (let i = 0; i < 22; i++) {
            const a = i / 22 * Math.PI * 2 + phase * (i % 2 ? .8 : -.55);
            const r = size * (.12 + ((i * 17) % 61) / 100 + energy * .12);
            const pulse = 1.2 + (values ? (values[i % values.length] || 0) / 255 * 3.5 : 2);
            ctx.beginPath();
            ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a * 1.12) * r * .62, pulse, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${(phase * 95 + i * 19) % 360},100%,${65 + treble * 25}%,.82)`;
            ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
    };

    const tick = (timestamp) => {
        if (!mediaPlaying) { mediaVisualFrame = null; return; }
        if (timestamp - lastFrameAt < 33) {
            mediaVisualFrame = requestAnimationFrame(tick);
            return;
        }
        lastFrameAt = timestamp;
        if (document.hidden) {
            mediaVisualFrame = requestAnimationFrame(tick);
            return;
        }
        if (mediaAnalyser && data) mediaAnalyser.getByteFrequencyData(data);
        if (mediaVisualMode === "psychedelic") drawPsychedelic(data);
        else if (mediaAnalyser && data) {
            bars.forEach((bar, index) => {
                const value = data[Math.floor(index / Math.max(1, bars.length) * data.length)] || 0;
                bar.style.height = `${Math.max(8, value / 255 * 92)}%`;
                bar.style.opacity = `${0.45 + value / 255 * 0.55}`;
            });
        }
        phase += 0.035 + (data ? (data[4] || 0) / 255 * 0.08 : 0.02);
        mediaVisualFrame = requestAnimationFrame(tick);
    };

    resizeCanvas();
    mediaVisualFrame = requestAnimationFrame(tick);
}

function loadMediaTrack(index, autoplay = false) {
    if (!mediaTracks.length || !mediaAudio) return;
    mediaIndex = (index + mediaTracks.length) % mediaTracks.length;
    mediaSeconds = 0;
    mediaAudio.pause();
    mediaPlaying = false;
    mediaAudio.src = mediaTracks[mediaIndex].src;
    mediaAudio.load();
    updateMediaDisplay();
    renderMediaPlaylist();
    if (autoplay) {
        initializeMediaEqualizer();
        if (mediaAudioContext && mediaAudioContext.state === "suspended") mediaAudioContext.resume();
        mediaAudio.play().catch(() => {
            const status = document.getElementById("mp-status");
            if (status) status.textContent = "CLIQUE EM PLAY PARA OUVIR";
        });
    }
}

function changeMediaTrack(step, autoplay = mediaPlaying) {
    loadMediaTrack(mediaIndex + step, autoplay);
}

function handleMediaAction(action) {
    switch (action) {
        case "play":
            if (!mediaAudio) return;
            if (mediaAudio.paused) {
                initializeMediaEqualizer();
                if (mediaAudioContext && mediaAudioContext.state === "suspended") mediaAudioContext.resume();
                mediaAudio.play().catch(() => {
                    const status = document.getElementById("mp-status");
                    if (status) status.textContent = "NAO FOI POSSIVEL REPRODUZIR";
                });
            } else mediaAudio.pause();
            break;
        case "stop":
            if (mediaAudio) { mediaAudio.pause(); mediaAudio.currentTime = 0; }
            mediaSeconds = 0;
            break;
        case "previous":
            changeMediaTrack(-1, true);
            break;
        case "next":
            changeMediaTrack(1, true);
            break;
        case "playlist":
            toggleMediaDock("playlist");
            break;
        case "equalizer":
            toggleMediaDock("equalizer");
            break;
        case "dock-close": {
            const dock = document.getElementById("mp-dock");
            if (dock) dock.hidden = true;
            break;
        }
        case "minimize": minimizeWindow("media-window"); break;
        case "maximize": maximizeWindow("media-window"); break;
        case "close":
            if (mediaAudio) mediaAudio.pause();
            closeWindow("media-window");
            break;
    }
    updateMediaDisplay();
}

function startMediaTimer() {
    stopMediaTimer();
}

function stopMediaTimer() {
    if (mediaTimer) clearInterval(mediaTimer);
    mediaTimer = null;
}

function formatMediaTime(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function updateMediaDisplay() {
    const track = mediaTracks[mediaIndex];
    if (!track) return;
    const title = document.getElementById("mp-track-title");
    const artist = document.getElementById("mp-track-subtitle");
    const current = document.getElementById("mp-current-time");
    const total = document.getElementById("mp-total-time");
    const fill = document.getElementById("mp-progress-fill");
    const thumb = document.getElementById("mp-progress-thumb");
    const play = document.getElementById("mp-play-button");
    const status = document.getElementById("mp-status");
    const duration = (mediaAudio && Number.isFinite(mediaAudio.duration)) ? mediaAudio.duration : track.duration;
    if (title) title.textContent = track.title;
    if (artist) artist.textContent = track.artist;
    if (current) current.textContent = formatMediaTime(mediaAudio ? mediaAudio.currentTime : mediaSeconds);
    if (total) total.textContent = formatMediaTime(duration);
    const percent = duration > 0 ? ((mediaAudio ? mediaAudio.currentTime : mediaSeconds) / duration) * 100 : 0;
    if (fill) fill.style.width = `${percent}%`;
    if (thumb) thumb.style.left = `${percent}%`;
    if (play) play.textContent = mediaPlaying ? "||" : "▶";
    if (status && !status.textContent.startsWith("ERRO") && !status.textContent.startsWith("NAO FOI") && !status.textContent.startsWith("CLIQUE")) {
        status.textContent = mediaPlaying ? "PLAYING" : "READY";
    }
    document.querySelectorAll("#mp-visualizer span").forEach(bar => {
        bar.style.animationPlayState = mediaPlaying ? "running" : "paused";
    });
}

/* ===========
   GIOBUDDY
============== */

function initializeGioBuddy() {
    injectGioBuddyStyles();
    createGioBuddy();

    setTimeout(() => {
        if (buddyEnabled) {
            buddySay(
                "Oi oi! Eu sou o GioBuddy "
            );
        }
    }, 1200);

    startBuddyRandomEvents();
    startGioBuddyWandering();
}

function injectGioBuddyStyles() {
    if (document.getElementById("giobuddy-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "giobuddy-styles";
    style.textContent = `
        #giobuddy {
            position: absolute;
            right: 18px;
            bottom: 42px;
            width: 72px;
            height: 72px;
            z-index: 9500;
            cursor: grab;
            user-select: none;
            touch-action: none;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(2px 3px 3px rgba(0,0,0,.4));
            animation: gioBuddyFloat 2.5s ease-in-out infinite;
        }

        #giobuddy.dragging {
            cursor: grabbing;
            animation: none;
        }

        #gio-sprite {
            display: block;
            width: 64px;
            height: 64px;
            max-width: 64px;
            max-height: 64px;
            object-fit: contain;
            object-position: center;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
            pointer-events: none;
            user-select: none;
            -webkit-user-drag: none;
        }

        .gio-speech {
            position: absolute;
            right: 58px;
            bottom: 48px;
            width: 220px;
            max-width: min(220px, 58vw);
            padding: 7px 9px;
            color: #111;
            background: white;
            border: 1px solid #555;
            border-radius: 4px;
            box-shadow: 3px 3px 5px rgba(0,0,0,.35);
            font: 11px/1.35 Tahoma, Arial, sans-serif;
            z-index: 2;
        }

        .gio-speech::after {
            content: "";
            position: absolute;
            right: -9px;
            bottom: 11px;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-left: 10px solid #555;
        }

        .gio-speech::before {
            content: "";
            position: absolute;
            right: -7px;
            bottom: 11px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 9px solid white;
            z-index: 2;
        }

        .gio-alert {
            position: fixed;
            z-index: 9998;
            width: 330px;
            background: #ece9d8;
            border: 1px solid #003399;
            box-shadow: 4px 4px 12px rgba(0,0,0,.5);
            font: 11px Tahoma, sans-serif;
        }

        .gio-alert-title {
            height: 25px;
            display: flex;
            align-items: center;
            padding: 0 6px;
            color: white;
            font-weight: bold;
            background: linear-gradient(#5d9ce6, #205eb6);
        }

        .gio-alert-body {
            display: flex;
            gap: 12px;
            padding: 15px;
            background: white;
        }

        .gio-alert-icon {
            font-size: 32px;
            flex-shrink: 0;
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
            background: linear-gradient(#fff, #ddd);
            font: 11px Tahoma, sans-serif;
            cursor: pointer;
        }

        .start-icon-image,
        .taskbar-icon-image,
        .tray-icon-image,
        .os-icon-image,
        .desktop-real-icon,
        .window-real-icon,
        .project-real-icon,
        .computer-real-icon,
        .skill-real-icon,
        .explorer-icon-image {
            object-fit: contain;
        }

        .start-icon-image { width: 18px; height: 18px; vertical-align: middle; }
        .taskbar-icon-image { width: 16px; height: 16px; vertical-align: middle; }
        .tray-icon-image { width: 14px; height: 14px; vertical-align: middle; }
        .os-icon-image, .desktop-real-icon, .project-real-icon, .computer-real-icon, .explorer-icon-image { width: 48px; height: 48px; }
        .window-real-icon { width: 16px; height: 16px; margin-right: 5px; vertical-align: middle; }
        .skill-real-icon { width: 42px; height: 42px; }

        .explorer-sidebar-hidden {
            display: none !important;
        }

        @keyframes gioBuddyFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }

        @keyframes gioBuddyShake {
            0% { transform: rotate(0); }
            25% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            75% { transform: rotate(-4deg); }
            100% { transform: rotate(0); }
        }

        @media (max-width: 700px) {
            #giobuddy {
                width: 60px;
                height: 60px;
                right: 10px;
                bottom: 38px;
            }

            #gio-sprite {
                width: 52px;
                height: 52px;
                max-width: 52px;
                max-height: 52px;
            }

            .gio-speech {
                right: 44px;
                bottom: 40px;
            }
        }
    `;

    document.head.appendChild(style);
}

function createGioBuddy() {
    document.getElementById("giobuddy")?.remove();

    stopGioBuddyAnimation();
    clearTimeout(gioBuddyBlinkTimer);

    const desktop = document.getElementById("desktop");
    if (!desktop) {
        return;
    }

    const buddy = document.createElement("div");
    buddy.id = "giobuddy";

    buddy.innerHTML = `
        <div class="gio-speech" id="gio-speech" style="display:none"></div>

        <img
            id="gio-sprite"
            class="gio-sprite"
            src="${GIOBUDDY_SPRITE_BASE}idle/idle-1.png"
            alt="GioBuddy - bolinha amarela sorridente"
            width="64"
            height="64"
            draggable="false"
        />
    `;

    desktop.appendChild(buddy);

    const sprite = document.getElementById("gio-sprite");

    if (sprite) {
        sprite.onerror = () => {
            sprite.onerror = null;
            sprite.src = `${GIOBUDDY_SPRITE_BASE}idle/idle-1.png`;
        };
    }

    buddy.addEventListener("pointerdown", startBuddyDrag);

    buddy.addEventListener("click", event => {
        if (buddyDragging) {
            return;
        }

        event.stopPropagation();
        playGioBuddyAnimation("happy");
        buddyRandomPhrase();
    });

    buddy.addEventListener("dblclick", event => {
        event.preventDefault();
        event.stopPropagation();
        playGioBuddyAnimation("happy", { loop: false });
        showBuddyAlert();
    });

    buddy.addEventListener("contextmenu", event => {
        playGioBuddyAnimation("happy", { loop: false });
    });

    playGioBuddyAnimation("idle");
    scheduleGioBuddyBlink();
}

function stopGioBuddyAnimation() {
    clearTimeout(gioBuddyAnimationTimer);
    gioBuddyAnimationTimer = null;
    gioBuddyAnimationToken++;
}

function getGioBuddyFramePath(relativePath) {
    return `${GIOBUDDY_SPRITE_BASE}${relativePath}`;
}

function setGioBuddyFrame(relativePath) {
    const sprite = document.getElementById("gio-sprite");
    if (!sprite || !relativePath) {
        return;
    }

    const nextSrc = getGioBuddyFramePath(relativePath);

    if (sprite.dataset.currentSrc === nextSrc) {
        return;
    }

    const testImage = new Image();

    testImage.onload = () => {
        const currentSprite = document.getElementById("gio-sprite");
        if (!currentSprite) {
            return;
        }

        currentSprite.dataset.currentSrc = nextSrc;
        currentSprite.src = nextSrc;
    };

    testImage.onerror = () => {
        // Se algum frame faltar simplesmente ignora esse frame
    };

    testImage.src = nextSrc;
}

function playGioBuddyAnimation(animationName = "idle", options = {}) {
    const animation = GIOBUDDY_SPRITES[animationName];
    const frames = animation?.[gioBuddyFacing] || animation?.right;

    if (!frames || !frames.length) {
        return;
    }

    const speed = options.speed || GIOBUDDY_ANIMATION_SPEED[animationName] || 120;
    const loop = options.loop !== undefined ? options.loop : animationName === "idle";
    const token = ++gioBuddyAnimationToken;

    clearTimeout(gioBuddyAnimationTimer);
    gioBuddyAnimationTimer = null;
    gioBuddyCurrentAnimation = animationName;

    let frameIndex = 0;

    const nextFrame = () => {
        if (token !== gioBuddyAnimationToken) {
            return;
        }

        setGioBuddyFrame(frames[frameIndex]);
        frameIndex++;

        if (frameIndex >= frames.length) {
            if (!loop) {
                gioBuddyAnimationTimer = null;
                playGioBuddyAnimation("idle");
                return;
            }

            frameIndex = 0;
        }

        gioBuddyAnimationTimer = setTimeout(nextFrame, speed);
    };

    nextFrame();
}

function scheduleGioBuddyBlink() {
    clearTimeout(gioBuddyBlinkTimer);

    gioBuddyBlinkTimer = setTimeout(() => {
        if (buddyEnabled && !buddyDragging && gioBuddyCurrentAnimation === "idle") {
            playGioBuddyAnimation("blink", {
                loop: false,
                speed: 85
            });
        }

        scheduleGioBuddyBlink();
    }, 3500 + Math.floor(Math.random() * 3500));
}

/* ===================
   GIOBUDDY MOVEMENT
====================== */

function stopGioBuddyWandering() {
    gioBuddyMoveToken++;

    if (gioBuddyMoveAnimationId !== null) {
        cancelAnimationFrame(gioBuddyMoveAnimationId);
        gioBuddyMoveAnimationId = null;
    }
}

function getGioBuddyPosition() {
    const buddy = document.getElementById("giobuddy");
    const desktop = document.getElementById("desktop");

    if (!buddy || !desktop) {
        return null;
    }

    const buddyRect = buddy.getBoundingClientRect();
    const desktopRect = desktop.getBoundingClientRect();

    return {
        x: buddyRect.left - desktopRect.left,
        y: buddyRect.top - desktopRect.top
    };
}

function setGioBuddyPosition(x, y) {
    const buddy = document.getElementById("giobuddy");
    const desktop = document.getElementById("desktop");

    if (!buddy || !desktop) {
        return false;
    }

    const maxX = Math.max(
        0,
        desktop.clientWidth - buddy.offsetWidth
    );

    const maxY = Math.max(
        0,
        desktop.clientHeight - 31 - buddy.offsetHeight
    );

    const safeX = Math.max(0, Math.min(x, maxX));
    const safeY = Math.max(0, Math.min(y, maxY));

    buddy.style.left = `${safeX}px`;
    buddy.style.top = `${safeY}px`;
    buddy.style.right = "auto";
    buddy.style.bottom = "auto";

    return true;
}

function chooseGioBuddyWalkAnimation(dx, dy) {
    return "idle";
}

function moveGioBuddyTo(targetX, targetY, duration = 2600, onComplete) {
    const buddy = document.getElementById("giobuddy");
    const desktop = document.getElementById("desktop");

    if (
        !buddy ||
        !desktop ||
        !buddyEnabled ||
        buddyDragging ||
        document.visibilityState !== "visible"
    ) {
        onComplete?.(false);
        return;
    }

    stopGioBuddyWandering();

    const start = getGioBuddyPosition();
    if (!start) {
        onComplete?.(false);
        return;
    }

    const maxX = Math.max(
        0,
        desktop.clientWidth - buddy.offsetWidth
    );

    const maxY = Math.max(
        0,
        desktop.clientHeight - 31 - buddy.offsetHeight
    );

    const end = {
        x: Math.max(8, Math.min(targetX, maxX - 8)),
        y: Math.max(8, Math.min(targetY, maxY - 8))
    };

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 18) {
        setGioBuddyPosition(end.x, end.y);
        onComplete?.(true);
        return;
    }

    if (Math.abs(dx) > 2) {
        gioBuddyFacing = dx < 0 ? "left" : "right";
    }
    const animationName = chooseGioBuddyWalkAnimation(dx, dy);
    const token = ++gioBuddyMoveToken;
    const startedAt = performance.now();

    playGioBuddyAnimation(animationName, {
        loop: true,
        speed: 105
    });

    const animate = timestamp => {
        if (
            token !== gioBuddyMoveToken ||
            !buddyEnabled ||
            buddyDragging ||
            document.visibilityState !== "visible"
        ) {
            gioBuddyMoveAnimationId = null;
            playGioBuddyAnimation("idle");
            onComplete?.(false);
            return;
        }

        const progress = Math.min(
            1,
            (timestamp - startedAt) / duration
        );

        const eased =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        setGioBuddyPosition(
            start.x + dx * eased,
            start.y + dy * eased
        );

        if (progress < 1) {
            gioBuddyMoveAnimationId = requestAnimationFrame(animate);
            return;
        }

        gioBuddyMoveAnimationId = null;
        playGioBuddyAnimation("idle");
        onComplete?.(true);
    };

    gioBuddyMoveAnimationId = requestAnimationFrame(animate);
}

function moveGioBuddyRandomly(onComplete) {
    const buddy = document.getElementById("giobuddy");
    const desktop = document.getElementById("desktop");

    if (!buddy || !desktop) {
        onComplete?.(false);
        return;
    }

    const current = getGioBuddyPosition();
    if (!current) {
        onComplete?.(false);
        return;
    }

    const maxX = Math.max(
        20,
        desktop.clientWidth - buddy.offsetWidth - 20
    );

    const maxY = Math.max(
        20,
        desktop.clientHeight - 31 - buddy.offsetHeight - 20
    );

    const targetX = 20 + Math.random() * Math.max(1, maxX - 20);
    const targetY = 20 + Math.random() * Math.max(1, maxY - 20);
    const distance = Math.hypot(
        targetX - current.x,
        targetY - current.y
    );

    const duration = Math.max(
        1400,
        Math.min(4300, distance * 7)
    );

    moveGioBuddyTo(
        targetX,
        targetY,
        duration,
        onComplete
    );
}

function startGioBuddyWandering() {
    stopGioBuddyWandering();

    const schedule = () => {
        clearTimeout(window.gioBuddyWanderTimer);

        window.gioBuddyWanderTimer = setTimeout(() => {
            if (
                buddyEnabled &&
                !buddyDragging &&
                document.visibilityState === "visible"
            ) {
                moveGioBuddyRandomly(() => {
                    if (buddyEnabled && !buddyDragging) {
                        const arrivalPhrases = [
                            "Cheguei! Eu precisava dar uma voltinha.",
                            "Pronto! Patrulha do desktop concluída.",
                            "Essa área parecia suspeita. Resolvido.",
                            "Andar pelo sistema é praticamente meu trabalho.",
                            "Olá de novo! Eu estava ali agora há pouco."
                        ];

                        buddySay(
                            arrivalPhrases[
                                Math.floor(
                                    Math.random() * arrivalPhrases.length
                                )
                            ],
                            3600
                        );
                    }
                });
            }

            schedule();
        }, 6500 + Math.floor(Math.random() * 6500));
    };

    schedule();
}

/* =================
   GIOBUDDY SPEECH
==================== */

function buddySay(
    message,
    duration = 4200
) {
    const speech =
        document.getElementById(
            "gio-speech"
        );

    if (!speech) {
        return;
    }

    speech.textContent =
        String(message).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s{2,}/g, " ").trim();

    speech.style.display =
        "block";

    playGioBuddyAnimation("talk", {
        loop: false,
        speed: 115
    });

    clearTimeout(
        window.gioSpeechTimer
    );

    window.gioSpeechTimer =
        setTimeout(() => {
            speech.style.display =
                "none";
        }, duration);
}

function buddyRandomPhrase() {
    const phrases = [
        "Você realmente clicou em mim. Interessante.",
        "Eu posso te mostrar os projetos. Confia.",
        "Você já olhou o SKILLS.EXE?",
        "Java carregado. Café não encontrado.",
        "Banco de Dados detectado. ",
        "Seu portfolio está funcionando. Eu acho.",
        "Quer abrir o ABOUT.EXE?",
        "Sistema funcionando dentro dos parâmetros.",
        "ATENÇÃO: Giovanna está programando novamente.",
        "Eu poderia fazer seu projeto por você. Mas aí não seria seu projeto.",
        "Oi! Só conferindo se você ainda está aí. ",
        "Acabei de encontrar um caminho novo pelo desktop.",
        "GioBuddy.exe: 100% amarelo e 0% silencioso.",
        "Relatório do sistema: preciso de mais atenção.",
        "Posso andar, falar e ainda não reclamar de bug. Quase perfeito.",
        "Detectei código por perto. Minha missão continua.",
        "Se você abrir o IPEMControl, eu prometo não julgar.",
        "Estação-TI detectada. Isso parece importante.",
        "GitHub aberto? Então estamos trabalhando de verdade.",
        "Só uma pergunta: cadê o café? ",
        "Eu estava quieto. Foi por aproximadamente três segundos.",
        "Você sabia que eu consigo passear pelo desktop inteiro?",
        "Status: feliz. Motivo: você clicou em mim.",
        "Vou dar mais uma voltinha e já volto.",
        "Nenhum erro crítico encontrado. Milagre.",
        "Meu combustível é Java, SQL e curiosidade.",
        "Se eu desaparecer, provavelmente estou explorando outra janela.",
        "Estou de olho nesse portfolio. "
    ];

    buddySay(
        phrases[
            Math.floor(
                Math.random() * phrases.length
            )
        ],
        3800
    );

    const buddy = document.getElementById("giobuddy");
    if (!buddy) {
        return;
    }

    buddy.style.animation = "gioBuddyShake .4s ease";

    setTimeout(() => {
        if (buddy && !buddyDragging) {
            buddy.style.animation =
                "gioBuddyFloat 2.5s ease-in-out infinite";
        }
    }, 450);
}

function startBuddyRandomEvents() {
    clearTimeout(buddyTimer);

    const schedule = () => {
        buddyTimer = setTimeout(() => {
            if (
                buddyEnabled &&
                !buddyDragging &&
                document.visibilityState === "visible"
            ) {
                const events = [
                    () =>
                        buddySay(
                            "Psst... tem alguém aí? ",
                            3600
                        ),

                    () =>
                        buddySay(
                            "Só passando para lembrar que eu existo.",
                            3600
                        ),

                    () =>
                        buddySay(
                            "SYSTEM STATUS: tudo estranhamente normal.",
                            3600
                        ),

                    () =>
                        buddySay(
                            "Clique em mim. Eu sei que você quer.",
                            3600
                        ),

                    () =>
                        buddySay(
                            "Estou patrulhando o desktop. Segurança primeiro.",
                            3600
                        ),

                    () =>
                        buddySay(
                            "Você está programando ou só olhando? ",
                            3600
                        ),

                    () =>
                        playGioBuddyAnimation("happy", {
                            loop: false,
                            speed: 115
                        }),

                    () =>
                        buddySay(
                            "Animação especial: bolinha feliz! :)",
                            3200
                        ),

                    () =>
                        buddyRandomPhrase(),

                    () =>
                        moveGioBuddyRandomly(() => {
                            buddySay(
                                "Passeio concluído. Onde eu estava mesmo?",
                                3600
                            );
                        })
                ];

                events[
                    Math.floor(
                        Math.random() * events.length
                    )
                ]();
            }

            schedule();
        }, 35000 + Math.floor(Math.random() * 20000));
    };

    schedule();
}

/* ===============
   GIOBUDDY DRAG
================== */

function startBuddyDrag(event) {
    if (
        event.button !== 0 ||
        !buddyEnabled
    ) {
        return;
    }

    const buddy =
        document.getElementById(
            "giobuddy"
        );

    const desktop =
        document.getElementById(
            "desktop"
        );

    if (!buddy || !desktop) {
        return;
    }

    const buddyRect =
        buddy.getBoundingClientRect();

    const desktopRect =
        desktop.getBoundingClientRect();

    buddyDragging = false;

    buddyDragState = {
        pointerId:
            event.pointerId,

        desktopLeft:
            desktopRect.left,

        desktopTop:
            desktopRect.top,

        offsetX:
            event.clientX -
            buddyRect.left,

        offsetY:
            event.clientY -
            buddyRect.top
    };

    buddy.setPointerCapture?.(
        event.pointerId
    );

    buddy.classList.add(
        "dragging"
    );

    event.preventDefault();
    event.stopPropagation();

    const move =
        eventMove => {
            if (!buddyDragState) {
                return;
            }

            if (
                eventMove.pointerId !==
                buddyDragState.pointerId
            ) {
                return;
            }

            const maxX =
                Math.max(
                    0,
                    desktop.clientWidth -
                    buddy.offsetWidth
                );

            const maxY =
                Math.max(
                    0,
                    desktop.clientHeight -
                    31 -
                    buddy.offsetHeight
                );

            const x =
                eventMove.clientX -
                buddyDragState.desktopLeft -
                buddyDragState.offsetX;

            const y =
                eventMove.clientY -
                buddyDragState.desktopTop -
                buddyDragState.offsetY;

            buddy.style.left =
                `${Math.max(
                    0,
                    Math.min(x, maxX)
                )}px`;

            buddy.style.top =
                `${Math.max(
                    0,
                    Math.min(y, maxY)
                )}px`;

            buddy.style.right =
                "auto";

            buddy.style.bottom =
                "auto";

            buddyDragging = true;
        };

    const end =
        eventEnd => {
            if (
                eventEnd &&
                buddyDragState &&
                eventEnd.pointerId !==
                    buddyDragState.pointerId
            ) {
                return;
            }

            document.removeEventListener(
                "pointermove",
                move
            );

            document.removeEventListener(
                "pointerup",
                end
            );

            document.removeEventListener(
                "pointercancel",
                end
            );

            buddy.classList.remove(
                "dragging"
            );

            buddyDragState = null;

            setTimeout(() => {
                buddyDragging = false;
            }, 60);
        };

    document.addEventListener(
        "pointermove",
        move
    );

    document.addEventListener(
        "pointerup",
        end
    );

    document.addEventListener(
        "pointercancel",
        end
    );
}

/* ================
   GIOBUDDY ALERT
=================== */

function showBuddyAlert() {
    if (!buddyEnabled) {
        return;
    }

    document
        .getElementById(
            "gio-buddy-alert"
        )
        ?.remove();

    const box =
        document.createElement("div");

    box.id =
        "gio-buddy-alert";

    box.className =
        "gio-alert";

    box.style.left =
        `${Math.max(
            20,
            window.innerWidth / 2 - 165
        )}px`;

    box.style.top =
        `${Math.max(
            50,
            window.innerHeight / 2 - 130
        )}px`;

    box.innerHTML = `
        <div class="gio-alert-title">
            GioBuddy.exe
        </div>

        <div class="gio-alert-body">
            <div class="gio-alert-icon">
                <img src="img/icons/HelpandSupport.png" alt="" aria-hidden="true" width="32" height="32">
            </div>

            <div class="gio-alert-text">
                <strong>
                    SYSTEM WARNING
                </strong>

                <br><br>

                GioBuddy detectou uma
                atividade suspeita:

                <br><br>

                <strong>
                    Giovanna está aprendendo Java.
                </strong>

                <br><br>

                Isso pode resultar em:

                <br>

                • mais projetos
                <br>
                • mais código
                <br>
                • menos horas de sono
            </div>
        </div>

        <div class="gio-alert-footer">
            <button
                type="button"
                data-gio="projects"
            >
                Ver projetos
            </button>

            <button
                type="button"
                data-gio="close"
            >
                OK
            </button>
        </div>
    `;

    document
        .getElementById(
            "desktop"
        )
        ?.appendChild(box);

    box
        .querySelector(
            '[data-gio="projects"]'
        )
        ?.addEventListener(
            "click",
            () => {
                box.remove();

                openWindow(
                    "projects-window"
                );

                buddySay(
                    "Eu sabia que você queria ver os projetos."
                );
            }
        );

    box
        .querySelector(
            '[data-gio="close"]'
        )
        ?.addEventListener(
            "click",
            () => {
                box.remove();
            }
        );

    setTimeout(() => {
        box.remove();
    }, 15000);
}

function disableGioBuddy() {
    buddyEnabled = false;

    clearTimeout(
        buddyTimer
    );

    stopGioBuddyWandering();
    clearTimeout(window.gioBuddyWanderTimer);

    document
        .getElementById(
            "giobuddy"
        )
        ?.remove();

    showExplorerMessage(
        "GioBuddy.exe",
        "GioBuddy foi desativado."
    );
}

function restoreGioBuddy() {
    buddyEnabled = true;

    createGioBuddy();

    buddySay(
        "EU VOLTEI. "
    );

    startBuddyRandomEvents();
    startGioBuddyWandering();
}

/* =======================
   GIOBUDDY CONTEXT MENU
========================== */

document.addEventListener(
    "contextmenu",
    event => {
        const buddy =
            document.getElementById(
                "giobuddy"
            );

        if (
            !buddy ||
            !buddy.contains(
                event.target
            )
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

function showBuddyContextMenu(
    x,
    y
) {
    document
        .getElementById(
            "gio-context-menu"
        )
        ?.remove();

    const menu =
        document.createElement(
            "div"
        );

    menu.id =
        "gio-context-menu";

    Object.assign(
        menu.style,
        {
            position: "fixed",

            left:
                `${Math.max(
                    5,
                    Math.min(
                        x,
                        window.innerWidth - 195
                    )
                )}px`,

            top:
                `${Math.max(
                    5,
                    Math.min(
                        y,
                        window.innerHeight - 180
                    )
                )}px`,

            width: "190px",
            zIndex: "99999",
            background: "#ece9d8",
            border: "1px solid #555",
            boxShadow:
                "3px 3px 8px rgba(0,0,0,.4)",
            font:
                "11px Tahoma, sans-serif"
        }
    );

    const items = [
        ["MyDocuments.png", "What are you doing?", () => buddySay("Estou ajudando. Tecnicamente.")],
        ["Run.png", "Do a trick", () => buddyRandomPhrase()],
        ["FolderClosed.png", "Show Projects", () => {
            openWindow("projects-window");
            buddySay("Projetos encontrados.");
        }],
        ["HelpandSupport.png", "System Warning", () => showBuddyAlert()],
        ["Power.png", "Disable GioBuddy", () => disableGioBuddy()]
    ];

    items.forEach(
        ([iconFile, label, action]) => {
            const item = document.createElement("div");
            const icon = document.createElement("img");
            icon.src = `img/icons/${iconFile}`;
            icon.alt = "";
            icon.setAttribute("aria-hidden", "true");
            icon.style.cssText = "width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-right:7px;";
            item.appendChild(icon);
            item.appendChild(document.createTextNode(label));

            item.style.padding =
                "7px 9px";

            item.style.cursor =
                "pointer";

            item.addEventListener(
                "mouseenter",
                () => {
                    item.style.background =
                        "#316ac5";

                    item.style.color =
                        "white";
                }
            );

            item.addEventListener(
                "mouseleave",
                () => {
                    item.style.background =
                        "";

                    item.style.color =
                        "";
                }
            );

            item.addEventListener(
                "click",
                () => {
                    action();
                    menu.remove();
                }
            );

            menu.appendChild(item);
        }
    );

    document
        .getElementById(
            "desktop"
        )
        ?.appendChild(menu);

    const closeMenu =
        event => {
            if (
                !menu.contains(
                    event.target
                )
            ) {
                menu.remove();

                document.removeEventListener(
                    "click",
                    closeMenu
                );
            }
        };

    setTimeout(() => {
        document.addEventListener(
            "click",
            closeMenu
        );
    }, 0);
}

/* ==========
   KEYBOARD
============= */

document.addEventListener(
    "keydown",
    event => {
        const tag =
            document.activeElement
                ?.tagName;

        const typing =
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT";

        if (
            !typing &&
            event.key.toLowerCase() === "g" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey
        ) {
            if (
                document.getElementById(
                    "giobuddy"
                )
            ) {
                buddyRandomPhrase();
            } else {
                restoreGioBuddy();
            }
        }

        if (
            event.key === "Escape"
        ) {
            document
                .getElementById(
                    "start-menu"
                )
                ?.classList.remove(
                    "open"
                );

            document
                .getElementById(
                    "gio-context-menu"
                )
                ?.remove();

            document
                .getElementById(
                    "gio-buddy-alert"
                )
                ?.remove();

            document
                .getElementById(
                    "explorer-message"
                )
                ?.remove();
        }
    }
);

/* ===============
   RESIZE SAFETY
================== */

window.addEventListener(
    "resize",
    () => {
        const desktop =
            document.getElementById(
                "desktop"
            );

        if (!desktop) {
            return;
        }

        document
            .querySelectorAll(
                ".os-window"
            )
            .forEach(win => {
                if (
                    getComputedStyle(win)
                        .display === "none"
                ) {
                    return;
                }

                if (
                    win.classList.contains(
                        "maximized"
                    )
                ) {
                    return;
                }

                const maxX =
                    Math.max(
                        0,
                        desktop.clientWidth -
                        win.offsetWidth
                    );

                const maxY =
                    Math.max(
                        0,
                        desktop.clientHeight -
                        31 -
                        win.offsetHeight
                    );

                const x =
                    Math.min(
                        Math.max(
                            0,
                            win.offsetLeft
                        ),
                        maxX
                    );

                const y =
                    Math.min(
                        Math.max(
                            0,
                            win.offsetTop
                        ),
                        maxY
                    );

                win.style.left =
                    `${x}px`;

                win.style.top =
                    `${y}px`;
            });
    }
);

/* Google da época */
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("google-era-search");
    const suggestions = document.getElementById("google-era-suggestions");
    const form = document.getElementById("google-era-form");
    const lucky = document.getElementById("google-era-lucky");
    const browserContent = document.querySelector("#internet-window .browser-content");
    const address = document.querySelector("#internet-window .toolbar-address");
    if (!input || !suggestions || !form || !browserContent) return;

    const profiles = {
        github: {
            label: "GitHub",
            url: "https://github.com/markeis24",
            host: "github.com/markeis24",
            title: "markeis24",
            description: "Projetos, repositórios e experiências de desenvolvimento de Giovanna.",
            icon: "⌘",
            details: ["Repositórios de projetos", "Código-fonte e estudos", "Portfólio de desenvolvimento"]
        },
        linkedin: {
            label: "LinkedIn",
            url: "https://www.linkedin.com/in/giovanna-marques-221998397",
            host: "linkedin.com/in/giovanna-marques-221998397",
            title: "Giovanna Marques",
            description: "Perfil profissional, trajetória acadêmica e experiências na área de tecnologia.",
            icon: "in",
            details: ["Perfil profissional", "Formação e experiências", "Conexões na área de tecnologia"]
        }
    };

    const showSuggestions = () => { suggestions.hidden = false; };
    const hideSuggestions = () => { suggestions.hidden = true; };
    const chooseProfile = (query) => /linkedin|linked\s*in|profissional|carreira|curr[ií]culo/i.test(query)
        ? profiles.linkedin
        : profiles.github;

    const openExternalProfile = (profile) => {
        hideSuggestions();

        window.open(profile.url, "_blank", "noopener,noreferrer");
    };

    const showHome = () => {
        input.value = "";
        hideSuggestions();
        if (address) address.textContent = "http://www.google.com";
    };

    input.addEventListener("focus", showSuggestions);
    input.addEventListener("click", showSuggestions);
    input.addEventListener("input", showSuggestions);
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".google-search-wrap")) hideSuggestions();
    });

    suggestions.querySelectorAll("a[data-search-profile]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            openExternalProfile(profiles[link.dataset.searchProfile] || profiles.github);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        openExternalProfile(chooseProfile(input.value.trim()));
    });
    if (lucky) lucky.addEventListener("click", () => {
        openExternalProfile(chooseProfile(input.value.trim()));
    });

    const homeButton = document.querySelector('#internet-window .window-toolbar button[title="Home"]');
    if (homeButton) homeButton.addEventListener("click", showHome);
});


function handleWindowCloseControl(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const closeButton = target.closest(".window-controls .window-close");
    if (!closeButton) return;

    const windowElement = closeButton.closest(".os-window");
    if (!windowElement) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
    }

    // Evita disparos duplicados quando o navegador também gera click
    if (windowElement.style.display !== "none") {
        closeWindow(windowElement.id);
    }
}

document.addEventListener("pointerdown", handleWindowCloseControl, true);
document.addEventListener("mousedown", handleWindowCloseControl, true);
document.addEventListener("click", handleWindowCloseControl, true);