
const rp = require("request-promise")

function findTitle(content, title) {
  const regex = /<title>(.+)<\/title>/g

  let newTitle = title
  let m
  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex == 1) {
        console.log(`[DEBUG] Found match, group ${groupIndex}: ${match}`)
        newTitle = match
      }
    })
  }

  return newTitle
}

const list = require("./config.json")

let allReq = list.map(item => rp(item.url))
Promise.all(allReq)
  .then(resps => {
    resps.forEach((r, i) => {
      const url = list[i].url
      const oldTitle = list[i].title
      const newTitle = findTitle(r, oldTitle)
      if (oldTitle !== newTitle) {
        console.log("\n--- found updated ---")
        console.log(`old: ${oldTitle}`)
        console.log(`new: ${newTitle}`)
        console.log(`url: ${url}`)
        console.log("---------------------\n")
      }
    })
  })
  .catch(e => {
    console.error(`request error: ${e.message}`)
  })
