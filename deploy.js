const fs = require("fs-extra")
const { ethers } = require("ethers")
require("dotenv").config()

const main = async () => {
	// HTTP://127.0.0.1:7545

	const provider = new ethers.providers.JsonRpcProvider({
		url: process.env.RPC_URL,
	})
	// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
	const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8")
	let wallet = new ethers.Wallet.fromEncryptedJsonSync(
		encryptedJson,
		process.env.PRIVATE_KEY_PASSWORD,
	)
	wallet = wallet.connect(provider)

	const abi = fs.readFileSync("./bin/SimpleStorage.abi", "utf-8")

	const binary = fs.readFileSync("./bin/SimpleStorage.bin", "utf-8")

	const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
	console.info("Deploying contract...")
	const contract = await contractFactory.deploy()
	const deploymentReceipt = await contract.deployTransaction.wait(1)
	console.log(deploymentReceipt)

	await currentFavoriteNumber(contract)
	const txResponse = await contract.store("7")
	await txResponse.wait(1)
	await currentFavoriteNumber(contract)
}

const currentFavoriteNumber = async (contract) => {
	const number = await contract.retrieve()
	console.log(`Current Favorite Number: ${number.toString()}`)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

// const nonce = await wallet.getTransactionCount()

// const tx = {
// 	nonce,
// 	gasPrice: "20000000000",
// 	gasLimit: 1000000,
// 	to: null,
// 	value: 0,
// 	data: "0x" + binary,
// 	chainId: 1337,
// }

// const sentTxResponse = await wallet.sendTransaction(tx)
// await sentTxResponse.wait(1)
// console.log(sentTxResponse)
