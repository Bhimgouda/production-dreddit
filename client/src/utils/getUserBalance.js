import { toastInfo } from "./toastWrapper";

export const getUserBalance = async (provider, address) => {
  try {
    const balance = await provider.getBalance(
      address,
      "0x000000004cd973c4eb83cdb8870c0de209736270491b7acc99873da1eddced5826c3b548"
    );

    if (balance < 1000) {
      toastInfo("Please claim KMOI tokens to interact");
    }
    return balance;
  } catch (error) {
    toastInfo("Please claim KMOI tokens to interact");
    return 0;
  }
};
