import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button, Container } from "@radix-ui/themes";
import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import styles from "./page.module.css";

export function CreateBattle({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const client = useSuiClient();
  const counterPackageId = useNetworkVariable("counterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  return (
    <Container>
      <Button
        onClick={() => {
          create();
        }}
        className={styles.card}
      >
        Create Battle <span>-&gt;</span>
      </Button>
    </Container>
  );

  function create() {
    const txb = new TransactionBlock();

    txb.moveCall({
      arguments: [],
      target: `${counterPackageId}::battle::create`,
    });

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
          client
            .waitForTransactionBlock({
              digest: tx.digest,
            })
            .then(() => {
              const objectId = tx.effects?.created?.[0]?.reference?.objectId;

              if (objectId) {
                onCreated(objectId);
              }
            });
        },
      },
    );
  }
}
