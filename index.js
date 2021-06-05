#!/usr/bin/env node

;(async () => {

  const fs = require('fs')
  const aes256 = require('aes256')
  const { prompt } = require('inquirer')

  console.log('\x1b[33m[AES256 CLI]: Encrypt/Decrypt with aes256! (by iMrDJAi)\x1b[0m')

  const { mode } = await prompt({
    name: 'mode',
    message: 'Select mode',
    type: 'list',
    choices: ['Encrypt', 'Decrypt']
  })

  const { type } = await prompt({
    name: 'type',
    message: 'Select type',
    type: 'list',
    choices: ['File', 'Text']
  })

  if (type === 'File') {
    var { filename } = await prompt({
      name: 'filename',
      message: 'Enter your file name to ' + mode.toLowerCase(),
      validate: input => input.length > 0
    })
    if (!fs.existsSync(filename) || !fs.lstatSync(filename).isFile()) return console.log('\x1b[31mFile not found!\x1b[0m')
  }

  if (type === 'Text') {
    var { text } = await prompt({
      name: 'text',
      message: 'Enter text to ' + mode.toLowerCase(),
      type: 'editor',
      validate: input => input.length > 0
    })
  }

  const { key } = await prompt({
    name: 'key',
    message: 'Enter your key',
    validate: input => input.length > 0
  })
  
  if (type === 'File') {
    const input = fs.readFileSync(filename)

    if (mode === 'Encrypt') {
      try {
        var output = aes256.encrypt(key, input)
      } catch(err) {
        return console.log('\x1b[31m' + err + '\x1b[0m')
      }
      var prefix = 'encrypted'
    }

    if (mode === 'Decrypt') {
      try {
        var output = aes256.decrypt(key, input)
      } catch(err) {
        return console.log('\x1b[31m' + err + '\x1b[0m')
      }
      var prefix = 'decrypted'
    }

    var number = 0
    var done = false
    while (!done) {
      try {
        fs.writeFileSync(`${prefix}${number ? number : ''}-${filename}`, output, { flag: 'wx' })
        done = true
      } catch(err) {
        if (err.message.startsWith('EEXIST')) {
          number++
        } else {
          return console.error('\x1b[31m' + err + '\x1b[0m')
        }
      }
    }
  }

  if (type === 'Text') {
    if (mode === 'Encrypt') {
      try {
        var output = aes256.encrypt(key, text).toString('base64')
      } catch(err) {
        return console.log('\x1b[31m' + err + '\x1b[0m')
      }
    }

    if (mode === 'Decrypt') {
      try {
        var output = aes256.decrypt(key, Buffer.from(text, 'base64')).toString()
      } catch(err) {
        return console.log('\x1b[31m' + err + '\x1b[0m')
      }
    }

    console.log(output)
  }

  console.log('\x1b[33mDone!\x1b[0m')

})()
