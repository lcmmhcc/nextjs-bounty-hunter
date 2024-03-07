import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";

export function Counter({ id }: { id: string }) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const counterPackageId = useNetworkVariable("counterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const executeMoveCall = (method: "attack" | "burn") => {
    const txb = new TransactionBlock();

    if (method === "burn") {
      txb.moveCall({
        arguments: [txb.object(id)],
        target: `${counterPackageId}::battle::burn`,
      });
    } else {
      txb.moveCall({
        arguments: [txb.object(id), txb.pure.u64(1)],
        target: `${counterPackageId}::battle::action`,
      });
    }

    signAndExecute(
      {
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: (tx) => {
          client.waitForTransactionBlock({ digest: tx.digest }).then(() => {
            refetch();
          });
        },
      },
    );
  };

  if (isPending) return <Text>Loading...</Text>;

  if (error) return <Text>Error: {error.message}</Text>;

  if (!data.data) return <Text>Not found</Text>;

  const ownedByCurrentAccount = true;
  const fugitive = getFugitive(data.data)?.value as { hp: number; atk: number };
  const player = getPlayer(data.data)?.value as { hp: number; atk: number };
  return (
    <>
      <Heading size="3">battle {id}</Heading>
      <Flex direction="column" gap="2">
        <Text>fugitive hp: {fugitive.hp} | atk : {fugitive.atk}</Text>
        <Text>player hp: {player.hp} | atk : {player.atk}</Text>
        <Flex direction="row" gap="2">
          <Button onClick={() => executeMoveCall("attack")}>
          attack
          </Button>
          {ownedByCurrentAccount ? (
            <Button onClick={() => executeMoveCall("burn")}>Reset</Button>
          ) : null}
        </Flex>
      </Flex>
    </>
  );
}

function getFugitive(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  var fields = data.content.fields as { [key: string]: any }

  var fugitivefields = fields.fugitive.fields as { [key: string]: any };
  var base = fugitivefields.base.fields as { [key: string]: any };

  console.log(base);

  return { value : base};
}
function getPlayer(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  var fields = data.content.fields as { [key: string]: any }

  var player = fields.player.fields as { [key: string]: any };
  var base = player.base.fields as { [key: string]: any };

  console.log(base);

  return { value : base};
}