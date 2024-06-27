const youtubeControlsGroup = "ytp-right-controls", twitchControlsGroup = "player-controls__right-control-group",
youtubeTimestamp = "ytp-time-current", twitchTimestamp = "ckwzla"

var website = "youtube", controls = youtubeControlsGroup, timestamp = youtubeTimestamp

var startTime = "00:00:00", stopTime = "00:00:10"

function parseTime(inTime = "00:00:00") {
    let times = inTime.split(":")

    if (times.length < 3) times.unshift("00")

    return [times[0].padStart(2, "0"), times[1].padStart(2, "0"), times[2]].join(":")
}

function getTime() {
    let currentTime = document.querySelector(`.${timestamp}`).textContent
    return parseTime(currentTime)
}

function toggleMenu() {
    let vidclipElements = document.querySelectorAll(".vcelements")
    vidclipElements.forEach(v => {
        v.classList.toggle("vchidden")
    })
}

function setStartTime() {
    startTime = getTime()
    document.querySelector(`.${timestamp}`).style.color = "green !important"
    console.log(startTime)
}

function setStopTime() {
    stopTime = getTime()
    document.querySelector(`.${timestamp}`).style.color = "red !important"
    console.log(stopTime)
}

function getCommand() {
    let command = `yt-dlp --download-sections "*${startTime}-${stopTime}" ${location.href.split("&")[0]}`
    navigator.clipboard.writeText(command)
    document.querySelector(`.${timestamp}`).style.color = "white !important"
    console.log(command)
}

function playClip() {
    let times = startTime.split(":")
    let seconds = Number(times[0]) * 60 * 60 + Number(times[1]) * 60 + Number(times[2])
    window.location.href = `${location.href.split("&")[0]}&t=${seconds}s`
}

function createButton(title, icon, func) {
    var button = document.createElement("button")
    button.classList.add("ytp-button")
    button.title = title
    button.style.display = "unset"
    if (icon != "icon") {
        button.classList.add("vcelements")
        button.classList.add("vchidden")
    }

    var img = document.createElement("img")
    img.src = browser.runtime.getURL(`icons/vidclip-${icon}.svg`)
    button.append(img)

	button.addEventListener("click", func);

    return button
}

function addButtons() {
    var buttons = document.createDocumentFragment()

    buttons.appendChild(createButton("Start Clip", "start", setStartTime))
    buttons.appendChild(createButton("Stop Clip", "stop", setStopTime))
    buttons.appendChild(createButton("Create Clip", "clip", getCommand))
    // buttons.appendChild(createButton("Play Clip", "play", playClip))
    buttons.appendChild(createButton("Toggle Menu", "icon", toggleMenu))

	let menus = document.getElementsByClassName(controls);
	for (let i = 0; i < menus.length; i++) {
		menus[i].prepend(buttons);
	}
}

/* Wait for menu to appear */
var menuLoadingInterval;
function injectMenu() {
	if(document.getElementsByClassName(controls).length !== 0) {
		clearInterval(menuLoadingInterval);
		addButtons();
	}
}

if (window.location.href.includes("twitch")) {
    website = "twitch"
    controls = twitchControlsGroup
    timestamp = twitchTimestamp
}

menuLoadingInterval = setInterval(injectMenu, 500);
