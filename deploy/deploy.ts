import { HardhatRuntimeEnvironment } from "hardhat/types";

import { DeployFunction } from "hardhat-deploy/types";

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const deployResult = await deploy("CoursesPayout", {
        from: deployer,
        gasLimit: 4000000,
        args: ['0xD92E713d051C37EbB2561803a3b5FBAbc4962431'],
  });
    console.log(`CoursesPayout deployed at ${deployResult.address}`);
  return hre.network.live; // prevents re execution on live networks
};
export default deployFunc;

deployFunc.id = "deploy_CoursesPayout"; // id required to prevent reexecution
