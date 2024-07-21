import React, { useState } from "react";
import { CardData } from "../types";
import { useHttpApi } from "../state";
import toast from "react-hot-toast";

const TransactionCard: React.FC<CardData> = ({
  _id,
  createdAt,
  updatedAt,
  sender,
  receiver,
  amount,
  details,
}) => {
  const [reversing, setReversing] = useState<boolean>(false);
  const { deleteTransaction } = useHttpApi();
  const handleReverse = async () => {
    try {
      setReversing(true);
      await deleteTransaction(_id)
        .then((res) => {
          toast.success("Transaction Reversed", {});
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setReversing(false);
      setTimeout(function () {
        window.location.reload();
      }, 500);
    }
  };
  return (
    <div className="card my-5" key={_id}>
      <div className="card-body">
        <div className="row">
          <div className="col-lg-6 text-dark">
            <h5>Sender: {sender.name}</h5>
            <h5>Receiver: {receiver.name}</h5>
            <h5>Amount: {amount}</h5>
          </div>
          <div className="col-lg-6 text-dark">
            <h5>Details: {details}</h5>
            <h5>Created At: {createdAt}</h5>
            <h5>Updated At: {updatedAt}</h5>
          </div>
        </div>
        <div className="text-center mt-3">
          <button
            disabled={reversing}
            type="submit"
            className="btn btn-primary"
            onClick={() => handleReverse()}
          >
            {reversing && (
              <span
                className="spinner-border spinner-border-sm mx-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {reversing ? "Reversing..." : "Reverse"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
