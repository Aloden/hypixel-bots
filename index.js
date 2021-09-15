const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, Goal } = require('mineflayer-pathfinder').goals
var v = require('vec3')
const botlist = require("./config.json")

let bots = []
let timeout = 1000

botlist.forEach(i => {
    setTimeout(() => {
        createBot(i)
        console.log(bots)
    }, timeout)
    
    timeout = timeout + 1000
})

let bottingStatus = 0
statusI = 0
function createBot ({ username, password }) {
    const bot = mineflayer.createBot({
      host: "play.hypixel.net",
      username,
      password,
      "viewDistance": "tiny",
      "skinParts": false,
      "showRightPants": false,
      "showLeftPants": false
    })
    bot.loadPlugin(pathfinder)
    bot.on("login", async() => {
        console.log("logged in")
    })
    bot.on("spawn", () => {
        bot.chat("/p join Aloden_")
    })
    bot.on("message", async(msg) => {
        try {
            if(msg.extra[1].text.includes("start")) {
                console.log("starting")  
                botting(bot)  
                bottingStatus = 1
            }
            if(msg.extra[1].text.includes("join")) {
                bot.chat("/play pit")
            }
            if(msg.extra[1].text.includes("stop")) {
                clearInterval()
                bot.chat("/oof")
            }
            if(msg.extra[1].text.includes("lobby")) {
                bot.chat("/lobby")
            }
        } catch(e) {
            return
        }
    })
    bot.on("end", async() => {
        createBot(bot.username, bot.password)
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 

async function botting(botInfo) {
    setInterval(async() => {
        if(botInfo.entity.position.y > 100) {
            let point = v(0, 82, 0)
            botInfo.lookAt(point)
            botInfo.setControlState('forward', true)
            botInfo.setControlState("sprint", true)
        } else {
            botInfo.setControlState('forward', false)
            botInfo.setControlState("sprint", false)
            let point = v(12,82,0)
            botInfo.lookAt(point)
            botInfo.setControlState("forward", true)
            botInfo.setControlState("sprint", true)
            //botInfo.pathfinder.goto(new GoalNear(11, 82, 0, 0))
        }
    }, 100)
}

async function restart(data) {
    botting(data)
}
