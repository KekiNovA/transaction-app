import BGImage from "./assets/img/background.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import { useEffect, useState } from "react";
import { useHttpApi } from "./state";
import { CardData } from "./types";
import TransactionCard from "./components/TransactionCard";
import CreateTransactionModal from "./components/CreateTransactionModal";

function App() {
  const [data, setData] = useState<CardData[]>([]);
  console.log(data);

  const { getAllTransactions } = useHttpApi();
  useEffect(() => {
    getAllTransactions()
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div
        id="kt_app_body"
        className="app-default d-flex flex-column min-vh-100 bg-grey"
        style={{ backgroundImage: `url(${BGImage})`, backgroundSize: "cover" }}
      >
        <div className="container-fluid mt-5">
          <h1 className="text-md-center">Transaction History</h1>
          <div className="container mt-5">
            <div className="text-md-end mb-5">
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#new-transaction"
                className="btn btn-secondary"
              >
                Create Transaction
              </a>
            </div>
            {data.length !== 0 ? (
              <>
                {data.map((item, index) => (
                  <TransactionCard
                    _id={item._id}
                    createdAt={item.createdAt}
                    updatedAt={item.updatedAt}
                    sender={item.sender}
                    receiver={item.receiver}
                    details={item.details}
                    amount={item.amount}
                    key={index}
                  />
                ))}
              </>
            ) : (
              <h3 className="text-md-center">No Transactions</h3>
            )}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        tabIndex={-1}
        id="new-transaction"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <CreateTransactionModal />
      </div>
    </>
  );
}

export default App;
