import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Battle } from "./battle";
import { CreateBattle } from "./CreateBattle";

function App() {
  const currentAccount = useCurrentAccount();
  const [battleID, setBattleID] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      return isValidSuiObjectId(hash) ? hash : null;
    }
    return null;
  });

  return (
    <>
      <Flex>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
          {currentAccount ? (
            battleID ? (
              <Battle id={battleID} />
            ) : (
              <CreateBattle
                onCreated={(id) => {
                  window.location.hash = id;
                  setBattleID(id);
                }}
              />
            )
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
      </Container>
    </>
  );
}

export default App;
