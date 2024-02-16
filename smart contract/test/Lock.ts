import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";  
import { SaveERC20, ERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

describe("SaveERC20", function () {

  let token: ERC20;
  let saveContract: SaveERC20; 
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  beforeEach(async () => {
    
    [owner, user1, user2] = await ethers.getSigners();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy("TST", "Test", 18);

  });


   describe("Deposits", () => {

    it("increases user savings balance", async () => {
      
      const amount = ethers.utils.parseEther("100");

      await token.connect(user1).approve(saveContract.address, amount);  
      await saveContract.connect(user1).deposit(amount);

      expect(await saveContract.savings(user1.address)).to.equal(amount);
      
    });

    describe("Withdrawals", () => {

      it("decreases user savings balance", async () => {
  
        const depositAmt = ethers.utils.parseEther("200");  
        const withdrawAmt = ethers.utils.parseEther("50");
  
        await token.connect(user1).approve(saveContract.address, depositAmt);
        await saveContract.connect(user1).deposit(depositAmt);
  
        await saveContract.connect(user1).withdraw(withdrawAmt);
  
        expect(await saveContract.savings(user1.address)).to.equal(depositAmt.sub(withdrawAmt));
  
      });

      describe("Owner withdraw", () => {

        it("allows owner withdraw", async () => {
          
          const amount = ethers.utils.parseEther("100");
    
          await token.connect(user1).approve(saveContract.address, amount);    
          await saveContract.connect(user1).deposit(amount);
    
          await saveContract.connect(owner).ownerWithdraw(amount);   
          
          expect(await token.balanceOf(owner.address)).to.equal(amount);
          
        });

        describe("Balance checking", () => {

          it("checks user savings balance", async () => {  
      
            const amount = ethers.utils.parseEther("150");
      
            await token.connect(user1).approve(saveContract.address, amount);
            await saveContract.connect(user1).deposit(amount);
      
            expect(await saveContract.checkUserBalance(user1.address)).to.equal(amount);
      
          });
      
          it("checks contract token balance", async () => {
      
            const user1Amt = ethers.utils.parseEther("100"); 
            const user2Amt = ethers.utils.parseEther("75");
      
            await token.connect(user1).approve(saveContract.address, user1Amt);
            await saveContract.connect(user1).deposit(user1Amt);
            
            await token.connect(user2).approve(saveContract.address, user2Amt); 
            await saveContract.connect(user2).deposit(user2Amt);
      
            expect(await saveContract.checkContractBalance()).to.equal(user1Amt.add(user2Amt));
          
          });

  });
});
