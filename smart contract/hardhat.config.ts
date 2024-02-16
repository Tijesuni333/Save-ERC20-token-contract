import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';


const URL = process.env.URL;
const KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
     hardhat: {},
     sepolia: {
        url: URL,
        accounts: [`0x${KEY}`]
     }
  },
};

export default config;

