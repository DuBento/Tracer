import { deployments } from "hardhat";

describe("Governor", function () {
  beforeEach(async function () {
    await deployments.fixture("dao");
  });

  it("Succesfully deploys", async function () {
    // used to show gas report for deplpoyment
  });
});
