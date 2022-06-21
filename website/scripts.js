var monks;
var addy = "";
var connect_wallet_button;
var contract;
var mint_button;
var mint_num_inp;

var web3 = new Web3(Web3.givenProvider);

async function loadWeb3() {
	if (window.ethereum) {
		// Request account access if needed
		var accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		addy = accounts[0];
	}
	return;
}

async function connectWallet() {
	await loadWeb3();
	connect_wallet_button.textContent =
		addy.substring(0, 5) + "..." + addy.substring(addy.length - 4, addy.length);

	var c = new web3.eth.Contract(
		monks.abi,
		"0xA06fcD43EB625566747B9EF7c3BBD6e866944cc8"
	);
	contract = c;

	return;
}

async function mint() {
	if (addy === "") {
		await connectWallet();
	}
	var numMint = parseInt(mint_num_inp.value);
	if (numMint > parseInt(mint_num_inp.max)) {
		numMint = parseInt(mint_num_inp.max);
	} else if (numMint < parseInt(mint_num_inp.min)) {
		numMint = parseInt(mint_num_inp.min);
	}
	contract.methods
		.mint(numMint)
		.send({ from: addy, value: numMint * web3.utils.toWei("0.08", "ether") });

	return;
}

function limitInput() {
	if (parseInt(mint_num_inp.value) > parseInt(mint_num_inp.max)) {
		mint_num_inp.value = mint_num_inp.max;
	} else if (parseInt(mint_num_inp.value) < parseInt(mint_num_inp.min)) {
		mint_num_inp.value = mint_num_inp.min;
	}
	return;
}

function setup() {
	connect_wallet_button = document.getElementById("connect-wallet-btn");
	connect_wallet_button.addEventListener("click", connectWallet);
	mint_button = document.getElementById("mint-btn");
	mint_button.addEventListener("click", mint);
	mint_num_inp = document.getElementById("mint-num");
	mint_num_inp.addEventListener("change", limitInput);
	return;
}

if (document.readyState !== "loading") {
	setup();
} else {
	document.addEventListener("DOMContentLoaded", function () {
		setup();
		return;
	});
}
