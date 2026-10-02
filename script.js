/* =========================================================
   GIOVANNA OS - SYSTEM SCRIPT
   Windows 2000 / XP inspired portfolio OS
========================================================= */

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const ICON_PATH = "img/icons/";

const ICONS = {
    computer: "windows-xp/xp-computer.ico",
    projects: "windows-xp/xp-folder-open.ico",
    about: "windows-xp/xp-documents.ico",
    skills: "windows-xp/xp-settings.ico",
    internet: "windows-xp/xp-internet.ico",
    media: "windows-xp/xp-media-player.ico",

    folder: "windows-xp/xp-folder-open.ico",
    closedFolder: "windows-xp/xp-folder.ico",

    hardDrive: "windows-xp/xp-harddrive.ico",
    network: "windows-xp/xp-network.ico",

    document: "windows-xp/xp-document.ico",
    image: "windows-xp/xp-image.ico",
    sound: "windows-xp/xp-audio-file.ico",
    video: "windows-xp/xp-video.ico",

    program: "windows-xp/xp-program.ico",
    programGroup: "windows-xp/xp-program-group.ico",

    settings: "windows-xp/xp-settings.ico",
    controlPanel: "windows-xp/xp-control-panel.ico",

    internetDoc: "windows-xp/xp-internet-document.ico",
    msdos: "windows-xp/xp-msdos.ico",

    desktop: "windows-xp/xp-desktop.ico",
    recycle: "windows-xp/xp-recycle.ico",

    configuration: "windows-xp/xp-config.ico"
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

/* =========================================================
   ESTADO DO SISTEMA
========================================================= */

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

// Cada frame tem duas versões: a normal (ex.: blink-1.png) e a invertida
// (ex.: blink-1.2.png). Usamos a versão invertida quando o GioBuddy vai para a esquerda.
let gioBuddyFacing = "right";

function makeGioBuddyFrames(folder, count) {
    return {
        right: Array.from({ length: count }, (_, i) => `${folder}/${folder}-${i + 1}.png`),
        left: Array.from({ length: count }, (_, i) => `${folder}/${folder}-${i + 1}.2.png`)
    };
}

const GIOBUDDY_SPRITES = {
    // Somente as quatro animações escolhidas: idle, blink, happy e talk.
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

/* =========================================================
   EXPLORER
========================================================= */

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
            {
                name: "C Programming",
                icon: ICONS.msdos,
                type: "Language",
                description: "C programming and algorithms."
            },
            {
                name: "Java Development Kit",
                icon: ICONS.program,
                type: "Language",
                description: "Java and object-oriented programming."
            },
            {
                name: "Spring Boot",
                icon: ICONS.program,
                type: "Framework",
                description: "Java backend and REST APIs."
            },
            {
                name: "MySQL Database",
                icon: ICONS.hardDrive,
                type: "Database",
                description: "Relational database and SQL."
            },
            {
                name: "SQLite",
                icon: ICONS.hardDrive,
                type: "Database",
                description: "Embedded relational database."
            },
            {
                name: "HTML5",
                icon: ICONS.internetDoc,
                type: "Web",
                description: "Web page structure."
            },
            {
                name: "CSS3",
                icon: ICONS.internetDoc,
                type: "Web",
                description: "Web interface styling."
            },
            {
                name: "JavaScript",
                icon: ICONS.internetDoc,
                type: "Language",
                description: "Frontend and backend scripting."
            }
        ]
    }
};

/* =========================================================
   MEDIA PLAYER
========================================================= */

const mediaTracks = [
    {
        title: "ESTACAO-TI",
        artist: "Giovanna Marques",
        duration: 222
    },
    {
        title: "PORTFOLIO.EXE",
        artist: "Giovanna OS",
        duration: 187
    },
    {
        title: "HALL OF CODE",
        artist: "System Audio",
        duration: 204
    },
    {
        title: "DATABASE DRIVE",
        artist: "FATEC SYSTEM",
        duration: 239
    }
];

let mediaIndex = 0;
let mediaSeconds = 0;
let mediaPlaying = false;
let mediaTimer = null;

/* =========================================================
   BOOT
========================================================= */

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

/* =========================================================
   INICIALIZAÇÃO GERAL
========================================================= */

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

/* =========================================================
   CLOCK
========================================================= */

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

/* =========================================================
   ICON SYSTEM
========================================================= */

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

/* =========================================================
   DESKTOP ICONS
========================================================= */

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

/* =========================================================
   WINDOW TITLE ICONS
========================================================= */

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

/* =========================================================
   PROJECT ICONS
========================================================= */

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

/* =========================================================
   COMPUTER ICONS
========================================================= */

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

/* =========================================================
   SKILLS ICONS
========================================================= */

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

/* =========================================================
   START ICON
========================================================= */

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

/* =========================================================
   TRAY ICONS
========================================================= */

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

/* =========================================================
   APLICAÇÃO DOS ÍCONES
========================================================= */

function applyWindowsIcons() {
    applyDesktopIcons();
    applyWindowTitleIcons();
    applyProjectIcons();
    applyComputerIcons();
    applySkillIcons();
    applyStartIcon();
}

/* =========================================================
   WINDOW SYSTEM
========================================================= */

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

    win.style.display = "none";

    win.classList.remove(
        "active-window",
        "focused-window"
    );

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

/* =========================================================
   DESKTOP / PROJECTS / COMPUTER
========================================================= */

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

/* =========================================================
   EXPLORER
========================================================= */

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

/* =========================================================
   EXPLORER
========================================================= */

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
                <img src="img/icons/windows-xp/xp-help.ico" alt="" aria-hidden="true" width="32" height="32">
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

/* =========================================================
   WINDOW DRAGGING
========================================================= */

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

/* =========================================================
   TASKBAR
========================================================= */

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

/* =========================================================
   START MENU
========================================================= */

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

/* =========================================================
   MEDIA PLAYER
========================================================= */

function initializeMediaPlayer() {
    const player =
        document.getElementById(
            "media-window"
        );

    if (
        !player ||
        player.dataset.initialized ===
            "true"
    ) {
        return;
    }

    player.dataset.initialized =
        "true";

    player
        .querySelectorAll(
            "[data-mp-action]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    handleMediaAction(
                        button.dataset
                            .mpAction
                    );
                }
            );
        });

    const track =
        document.getElementById(
            "mp-progress-track"
        );

    if (track) {
        track.addEventListener(
            "click",
            event => {
                const rect =
                    track.getBoundingClientRect();

                if (!rect.width) {
                    return;
                }

                const ratio =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        )
                    );

                mediaSeconds =
                    Math.round(
                        mediaTracks[
                            mediaIndex
                        ].duration *
                        ratio
                    );

                updateMediaDisplay();
            }
        );
    }

    const volume =
        document.getElementById(
            "mp-volume-control"
        );

    if (volume) {
        volume.addEventListener(
            "input",
            () => {
                const status =
                    document.getElementById(
                        "mp-status"
                    );

                if (status) {
                    status.textContent =
                        `VOLUME ${volume.value}%`;
                }
            }
        );
    }

    updateMediaDisplay();
}

function handleMediaAction(
    action
) {
    switch (action) {
        case "play":
            mediaPlaying =
                !mediaPlaying;

            if (mediaPlaying) {
                startMediaTimer();
            } else {
                stopMediaTimer();
            }

            break;

        case "stop":
            mediaPlaying = false;
            stopMediaTimer();
            mediaSeconds = 0;
            break;

        case "previous":
            mediaIndex =
                (
                    mediaIndex -
                    1 +
                    mediaTracks.length
                ) %
                mediaTracks.length;

            mediaSeconds = 0;
            break;

        case "next":
            mediaIndex =
                (
                    mediaIndex +
                    1
                ) %
                mediaTracks.length;

            mediaSeconds = 0;
            break;

        case "playlist":
            showExplorerMessage(
                "Playlist",
                mediaTracks
                    .map(
                        (track, index) =>
                            `${index + 1}. ${track.title} — ${track.artist}`
                    )
                    .join("<br>")
            );
            break;

        case "equalizer":
            showExplorerMessage(
                "Equalizer",
                "Equalizer visual is enabled.<br><br>" +
                "Audio output is simulated in this portfolio version."
            );
            break;

        case "minimize":
            minimizeWindow(
                "media-window"
            );
            break;

        case "maximize":
            maximizeWindow(
                "media-window"
            );
            break;

        case "close":
            closeWindow(
                "media-window"
            );
            break;
    }

    updateMediaDisplay();
}

function startMediaTimer() {
    stopMediaTimer();

    mediaTimer =
        setInterval(() => {
            mediaSeconds++;

            if (
                mediaSeconds >=
                mediaTracks[
                    mediaIndex
                ].duration
            ) {
                mediaIndex =
                    (
                        mediaIndex +
                        1
                    ) %
                    mediaTracks.length;

                mediaSeconds = 0;
            }

            updateMediaDisplay();
        }, 1000);
}

function stopMediaTimer() {
    if (mediaTimer) {
        clearInterval(mediaTimer);
    }

    mediaTimer = null;
}

function formatMediaTime(
    seconds
) {
    return (
        `${String(
            Math.floor(
                seconds / 60
            )
        ).padStart(2, "0")}:` +
        `${String(
            seconds % 60
        ).padStart(2, "0")}`
    );
}

function updateMediaDisplay() {
    const track =
        mediaTracks[mediaIndex];

    if (!track) {
        return;
    }

    const title =
        document.getElementById(
            "mp-track-title"
        );

    const artist =
        document.getElementById(
            "mp-track-subtitle"
        );

    const current =
        document.getElementById(
            "mp-current-time"
        );

    const total =
        document.getElementById(
            "mp-total-time"
        );

    const fill =
        document.getElementById(
            "mp-progress-fill"
        );

    const thumb =
        document.getElementById(
            "mp-progress-thumb"
        );

    const play =
        document.getElementById(
            "mp-play-button"
        );

    const status =
        document.getElementById(
            "mp-status"
        );

    if (title) {
        title.textContent =
            track.title;
    }

    if (artist) {
        artist.textContent =
            track.artist;
    }

    if (current) {
        current.textContent =
            formatMediaTime(
                mediaSeconds
            );
    }

    if (total) {
        total.textContent =
            formatMediaTime(
                track.duration
            );
    }

    const percent =
        track.duration
            ? (
                mediaSeconds /
                track.duration
            ) * 100
            : 0;

    if (fill) {
        fill.style.width =
            `${percent}%`;
    }

    if (thumb) {
        thumb.style.left =
            `${percent}%`;
    }

    if (play) {
        play.textContent =
            mediaPlaying
                ? "||"
                : "▶";
    }

    if (status) {
        status.textContent =
            mediaPlaying
                ? "PLAYING"
                : "READY";
    }

    document
        .querySelectorAll(
            "#mp-visualizer span"
        )
        .forEach(bar => {
            bar.style.animationPlayState =
                mediaPlaying
                    ? "running"
                    : "paused";
        });
}

/* =========================================================
   GIOBUDDY
========================================================= */

function initializeGioBuddy() {
    injectGioBuddyStyles();
    createGioBuddy();

    setTimeout(() => {
        if (buddyEnabled) {
            buddySay(
                "Oi! Eu sou o GioBuddy.exe "
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
        // Se algum frame faltar, simplesmente ignora esse frame.
        // Isso evita o ícone quebrado do navegador.
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

/* =========================================================
   GIOBUDDY MOVEMENT
========================================================= */

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
    // O GioBuddy se desloca pelo desktop, mas não usa frames de caminhada
    // gerados por IA; assim evitamos sprites tortos ou quebrados.
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

    // As imagens .2.png são a versão virada para a esquerda.
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
                            "Cheguei. Eu precisava dar uma voltinha.",
                            "Pronto. Patrulha do desktop concluída.",
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

/* =========================================================
   GIOBUDDY SPEECH
========================================================= */

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
        }, 9000 + Math.floor(Math.random() * 7000));
    };

    schedule();
}

/* =========================================================
   GIOBUDDY DRAG
========================================================= */

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

/* =========================================================
   GIOBUDDY ALERT
========================================================= */

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
                <img src="img/icons/windows-xp/xp-help.ico" alt="" aria-hidden="true" width="32" height="32">
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

/* =========================================================
   GIOBUDDY CONTEXT MENU
========================================================= */

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
        ["windows-xp/xp-write.ico", "What are you doing?", () => buddySay("Estou ajudando. Tecnicamente.")],
        ["windows-xp/xp-run.ico", "Do a trick", () => buddyRandomPhrase()],
        ["windows-xp/xp-folder.ico", "Show Projects", () => {
            openWindow("projects-window");
            buddySay("Projetos encontrados.");
        }],
        ["windows-xp/xp-help.ico", "System Warning", () => showBuddyAlert()],
        ["windows-xp/xp-shutdown.ico", "Disable GioBuddy", () => disableGioBuddy()]
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

/* =========================================================
   KEYBOARD
========================================================= */

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

        /* G = GioBuddy */
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

        /* ESC = fechar menus */
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

/* =========================================================
   RESIZE SAFETY
========================================================= */

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