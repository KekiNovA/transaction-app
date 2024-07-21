import React from "react";
import { CardData } from "../types";

const TransactionCard: React.FC<CardData> = ({
  _id,
  createdAt,
  updatedAt,
  sender,
  receiver,
  amount,
  details,
}) => {
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
      </div>
    </div>
  );
};

export default TransactionCard;
