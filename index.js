let mainUser = "Botting account ign"
let botCoords = ["0", "85", "0"]
let botMaster = "Input Bot Master IGN"
let totBot = 25
let string = ""
string = string.split("Split so each input in array has format username:password")

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, Goal } = require('mineflayer-pathfinder').goals
var v = require('vec3')

let timeout = 1000
let botNum = 0
let masterData;
let userNameList = []
let bottingStatus = "false"

string.forEach(i => {
    setTimeout(() => {
        botNum++
        if(botNum > totBot){
            return
        } else {
            data = i.split(":")
            if(data === "") return
            if(data === " ") return
            createBot(data[0], data[1], botNum)
        }
    }, timeout)
    timeout = timeout + 1000
})

function createBot (username, password, botNum) {
    if(!username) return
    const bot = mineflayer.createBot({
      host: "hypixel.net",
      version: "1.8.8",
      "username": username,
      "password": password,
      "viewDistance": "tiny"
    })
    let master = "false"
    console.log(botNum)
    bot.on("spawn", () => {
        if(botNum == totBot) {
            masterData.chat("/pc Everyone is logged in!")
        }
    })
    bot.on("message", async(msg) => {
        try {
            if(master === bot.username) {
                if(msg.extra[1].text.includes(mainUser)) {
                    bot.chat(`/p join ${mainUser}`)
                    masterData.chat("/pc Everyone is logged in!")
                }
            }
            if(msg.extra[1].text) {
                bot.chat(`/party join ${botMaster}`)
            } 
            if(msg.extra[1].text.startsWith("start")) {
                botting(bot)
                bottingStatus = "true"
            } 
            if(msg.extra[1].text.startsWith("stop")) {
                bottingStatus = "false"
                bot.chat("/oof")
            }
            if(msg.extra[1].text.startsWith("invite-bots")) {
                if(master === bot.username) {
                    bot.chat("/pc yes")
                    inviteTimeout = 200
                    userNameList.forEach(i => {
                        setTimeout(() => {
                            bot.chat(`/party invite ${i}`)
                        }, inviteTimeout)
                        inviteTimeout = 200 + inviteTimeout
                    })
                }
            }
            if(msg.extra[1].text.startsWith("hub")) {
                bot.chat("/hub")
            }
            if(msg.extra[1].text.startsWith("join")) {
                bot.chat("/play pit")
            }
            if(msg.extra[1].text.startsWith("debug")) {
                bot.chat("/hub")
                setTimeout(() => {
                    bot.chat("/play pit")
                }, 5000)
            }
            if(msg.extra[1].text.startsWith("coords")) {
                if(master === bot.username) {
                    let base = msg.extra[1].text
                    rawCoords = base.split("=")
                    rawCoords = rawCoords[1]
                    rawCoords = rawCoords.split(":")
                    bot.chat("/pc Set coords to " + `x:${rawCoords[0]} y:${rawCoords[1]} z:${rawCoords[2]}`)
                    botCoords = rawCoords
                }
            }
            if(msg.extra[1].text.startsWith("say:")) {
                bot.chat(msg.extra[1].text.split("say:"))
            }
        } catch(e) {
            return
        }
    })
    bot.on("login", () => {
        if(botNum == totBot) {
            master = bot.username
            masterData = bot
        } 
        if(master === "false") {
            userNameList.push(bot.username)
        }
        bottingStatus = "false"
        console.log(bot.username + "   " + username + ":" + password)
        if(master === bot.username) {
            console.log(`Master is ` + bot.username)
        }
    })
    bot.on("error", (err) => console.error(err))
}

async function botting(botInfo) {
    let b = setInterval(async() => {
        if(bottingStatus === "false") {
            botInfo.setControlState('forward', false)
            botInfo.setControlState("sprint", false)
            return
        } else if(bottingStatus = "true") {
            if(botInfo.entity.position.y > 50) {
                let point = v(0, 82, 0)
                botInfo.lookAt(point)
                botInfo.setControlState('forward', true)
                botInfo.setControlState("sprint", true)
            } else {
                botInfo.setControlState('forward', false)
                botInfo.setControlState("sprint", false)
                let point = v(botCoords[0], botCoords[1], botCoords[2])
                botInfo.lookAt(point)
                botInfo.setControlState("forward", true)
                botInfo.setControlState("sprint", true)
            }
        }
    }, 100)
}
