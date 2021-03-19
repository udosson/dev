import React, { useCallback, useEffect, useState } from "react";
import { Heading, Box, Flex, Card, Button } from "theme-ui";
import { Decimal, Decimalish, Difference } from "@liquity/lib-base";
// import { Decimal, Decimalish, Difference, MiningDeposit } from "@liquity/lib-base";
import { LP, GT } from "../../../../strings";
import { Icon } from "../../../Icon";
import { EditableRow, StaticRow } from "../../../Trove/Editor";
import { LoadingOverlay } from "../../../LoadingOverlay";
import { useMineView } from "../../context/MineViewContext";
import { Transaction, useMyTransactionState } from "../../../Transaction";
import { ConfirmButton } from "./ConfirmButton";
import { StakeActionDescription } from "./StakeActionDescription";

export const Stake: React.FC = () => {
  const { dispatchEvent } = useMineView();
  const [amount, setAmount] = useState<string>("0");
  const isDirty = amount !== "0";
  const editingState = useState<string>();

  const transactionId = "mine-stake";
  const transactionState = useMyTransactionState(transactionId);
  const isTransactionPending =
    (transactionState.type === "waitingForApproval" ||
      transactionState.type === "waitingForConfirmation") &&
    transactionState.id === transactionId;

  const hasApprovedUniLpSpend = false;

  const handleCancelPressed = useCallback(() => {
    dispatchEvent("CANCEL_PRESSED");
  }, [dispatchEvent]);

  useEffect(() => {
    if (transactionState.type === "confirmedOneShot") {
      dispatchEvent("STAKE_CONFIRMED");
    }
  }, [transactionState.type, dispatchEvent]);

  return (
    <Card>
      <Heading>
        Liquidity mine
        {isDirty && (
          <Button
            variant="titleIcon"
            sx={{ ":enabled:hover": { color: "danger" } }}
            onClick={() => setAmount("0")}
          >
            <Icon name="history" size="lg" />
          </Button>
        )}
      </Heading>

      {isTransactionPending && <LoadingOverlay />}

      <Box sx={{ p: [2, 3] }}>
        <EditableRow
          label="Stake"
          inputId="amount-lp"
          amount={amount || "0"}
          unit={LP}
          editingState={editingState}
          editedAmount={amount || "0"}
          setEditedAmount={amount => setAmount(amount)}
        ></EditableRow>

        <StakeActionDescription amount={amount} />
        <Flex variant="layout.actions">
          <Button variant="cancel" onClick={handleCancelPressed}>
            Cancel
          </Button>
          {!hasApprovedUniLpSpend && <Button sx={{ width: "60%" }}>Approve UNI LP</Button>}
          <ConfirmButton isDisabled={!hasApprovedUniLpSpend} amount={amount || "0"} />
        </Flex>
      </Box>
    </Card>
  );
};