import { Dictionary } from 'lodash'
import { PackageJson } from 'type-fest'
import fs from 'fs'
import { exec } from 'child_process'

export async function npmProxy(
  npmDependenciesObject: Dictionary<string>,
  packageJsonObject: PackageJson,
  packagePath: string,
) {
  if (Object.values(npmDependenciesObject).length) {
    fs.writeFileSync(
      packagePath,
      JSON.stringify(
        {
          ...packageJsonObject,
          dependencies: npmDependenciesObject,
        },
        null,
        2,
      ),
    )
    await new Promise<void>((resolve, reject) => {
      exec(`npm install`, async (err, stdout, stderr) => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}
