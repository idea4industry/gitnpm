import fs from 'fs'

type TokenFileData = {
  token: string
}

export async function getGitToken(
  gitHubTokenFilePath: string,
): Promise<string> {
  const buffer = await fs.promises.readFile(gitHubTokenFilePath) // This read the file
  const text = buffer.toString()
  const json: TokenFileData = JSON.parse(text)
  return json.token
}