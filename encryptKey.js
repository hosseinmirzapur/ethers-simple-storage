const fs = require("fs-extra")
const { ethers } = require("ethers")
require("dotenv").config()

const main = async () => {
	const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
	const encryptedJsonKey = await wallet.encrypt(
		process.env.PRIVATE_KEY_PASSWORD,
		process.env.PRIVATE_KEY,
	)
	fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey, "utf-8")
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
