const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('Token1.sol');
const Token2 = artifacts.require('Token2.sol');

async function main() {
  try {
    const [admin, _] = await web3.eth.getAccounts();
    //UNISWAP 
    // const factory = await Factory.at('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
    // const router = await Router.at('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');

    //PANCAKESWAP
    const factory = await Factory.at('0x6725F303b657a9451d8BA641348b6761A6CC7a17');
    const router = await Router.at('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');
    console.log("=======Deploying New Tokens===========")
    const token1 = await Token1.new();
    const token2 = await Token2.new();
    
    const token1Address = token1.address; 
    const token2Address = token2.address; 
    console.log("Address of tokenA ==>>>> ", token1Address);
    console.log("Address of tokenB ==>>>> ", token2Address);
    
    console.log("======= Create Pairs ===========")
    const pairAddress = await factory.createPair.call(token1Address, token2Address);
    const tx = await factory.createPair(token1Address, token2Address);
    console.log("Pair address ===>>>>> ", pairAddress);
    console.log("Create Pair Trasection ==>>> ", tx.tx)

    console.log("======= Approve Tokens ===========")
    await token1.approve(router.address, 10000);
    await token2.approve(router.address, 10000); 
    console.log("======= Adding Liquidity ===========")
    let liq = await router.addLiquidity(
      token1Address,
      token2Address,
      10000,
      10000,
      10000,
      10000,
      admin,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    console.log("liquidity ===>>>> ", liq.tx)
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf(admin); 
    console.log(`Pair balance LP: ${balance.toString()}`);
    } catch(e) {
      console.log(e);
    }
};
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})