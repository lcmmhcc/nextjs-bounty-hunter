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
import styles from "./page.module.css";

export function Battle({ id }: { id: string }) {
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
      <div className={styles.center}>
        <Heading>battle {id}</Heading>
      </div>
      <div className={styles.center}>
        <Text>fugitive hp: {fugitive.hp} | atk : {fugitive.atk}</Text>
      </div>
      <div className={styles.center}>
        <Text>player hp: {player.hp} | atk : {player.atk}</Text>
      </div>
      <div className={styles.grid}>
        <a
          onClick={() => executeMoveCall("attack")}
          className={styles.card}
        >
          <h2>
          attack <span>-&gt;</span>
          </h2>
        </a>

        <a
          className={styles.card}
        >
          <h2>
          magic <span>-&gt;</span>
          </h2>
        </a>

        <a
          onClick={() => executeMoveCall("burn")}
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            burn <span>-&gt;</span>
          </h2>
        </a>
      </div>
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