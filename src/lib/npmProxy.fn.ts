import { Dictionary } from 'lodash'
import { PackageJson } from 'type-fest'
import fs from 'fs'
import { exec } from 'child_process'

export async function npmProxy() {
  await new Promise<void>((resolve, reject) => {
    exec(`npm install`, async (err, stdout, stderr) => {
      if (err) reject(err)
      resolve()
    })
  })
}
