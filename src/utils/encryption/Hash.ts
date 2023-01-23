import bcrypt from 'bcrypt'

const salt = Number(process.env.SALT)

export async function hash(arg: string): Promise<string> {
  const hashed = await bcrypt.hash(arg, salt)
  return hashed
}

export async function validateHash(
  arg: string,
  hash?: string
): Promise<boolean> {
  if (hash) {
    const isValid = await bcrypt.compare(arg, hash)
    return isValid
  }
  return false
}
