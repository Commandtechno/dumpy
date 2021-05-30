# Among Us Dumpy GIF Generator
but its like good and effecient (note: not pure js like https://github.com/Cynosphere/dumpy.js)

inspired by https://github.com/ThatOneCalculator/Among-Us-Dumpy-Gif-Maker but in node and good

![Banner](https://cdn.discordapp.com/attachments/825265084270903306/847964996956192818/dumpy.gif)

# Usage

```js
const url = 'https://cdn.discordapp.com/emojis/839575637051703296.png' // Image to use (HTML image source)
const options = {
    size: 16, // Amount of rows and columns (Number | Default: 10)
    speed: 10, // Delay between frames in ms (Number | Default: 10)
    resolution: 512 // Width and height of the output (Number | Default: 1080)
}

dumpy(url, options)
    .then(gif => fs.writeFileSync('sus.gif', gif))
    .catch(console.log)
```

# Use the Discord Bot

If you just want to generate images quickly, and easily you can join the server below to use the `.dumpy` command with the bot

[![Invite](http://inv.wtf/widget/qs)](https://inv.wtf/qs)