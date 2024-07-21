import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import { userType } from "../types";
import { useHttpApi } from "../state";
import { useFormik, FormikProvider, Form } from "formik";
import toast from "react-hot-toast";

const CreateTransactionModal = () => {
  const [users, setUsers] = useState<userType[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { getUsers, createTransaction } = useHttpApi();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const TransactionSchema = Yup.object().shape({
    sender: Yup.string().trim().required("Sender is required"),
    receiver: Yup.string().trim().required("Receiver is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(1, "Amount should be greater than 0."),
    details: Yup.string().trim().required("Details is required"),
  });
  const formik = useFormik({
    initialValues: {
      sender: "",
      receiver: "",
      amount: "",
      details: "",
    },
    validationSchema: TransactionSchema,
    validate: (values) => {
      const errors: any = {};
      if (values.sender && values.receiver) {
        if (values.sender === values.receiver) {
          errors.sender = "Sender and Receiver cannot be same.";
        }
      }
      return errors;
    },
    onSubmit: async (data, { resetForm }) => {
      try {
        setSubmitting(true);
        await createTransaction({
          amount: data.amount,
          details: data.details,
          senderId: data.sender,
          receiverId: data.receiver,
        })
          .then((res) => {
            console.log(res);
            toast.success("Transaction Completed.");
          })
          .catch((error) => {
            toast.error(error.response.data.errors[0].msg);
          });
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
        resetForm();
        modalRef.current?.click();
        setTimeout(function () {
          window.location.reload();
        }, 500);
      }
    },
  });
  const { getFieldProps, handleSubmit } = formik;
  useEffect(() => {
    getUsers()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header justify-content-between">
          <h3 className="modal-title text-dark">New Transaction</h3>
          <div
            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            ref={modalRef}
            aria-label="Close"
            onClick={() => {
              formik.resetForm();
            }}
          >
            <i className="bi bi-x-lg" style={{ color: "black" }}>
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </div>
        </div>
        <div className="modal-body">
          <FormikProvider value={formik}>
            <Form className="form" onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-lg-12">
                  <label
                    className="text-dark fs-5 fw-semibold required mb-2"
                    htmlFor=""
                  >
                    Sender
                  </label>
                  <Select
                    className="basic-single form-select-solid text-dark"
                    classNamePrefix="Select Sender"
                    isSearchable={true}
                    styles={{
                      option: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                    }}
                    options={users}
                    {...getFieldProps("sender")}
                    getOptionLabel={(option: any) => `${option?.name}`}
                    getOptionValue={(option: any) => option?._id}
                    onChange={(option: any) => {
                      formik.setFieldTouched("sender", true);
                      formik.setFieldValue("sender", option?._id);
                    }}
                    value={users?.filter(
                      (option: any) => option?._id === formik.values.sender
                    )}
                  />
                  {formik.touched.sender && formik.errors.sender ? (
                    <div
                      className="form-error"
                      style={{ fontSize: 12, color: "red" }}
                    >
                      {formik.errors.sender}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-12">
                  <label
                    className="text-dark fs-5 fw-semibold required mb-2"
                    htmlFor=""
                  >
                    Receiver
                  </label>
                  <Select
                    className="basic-single form-select-solid text-dark"
                    classNamePrefix="Select Receiver"
                    isSearchable={true}
                    styles={{
                      option: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                    }}
                    options={users}
                    {...getFieldProps("receiver")}
                    getOptionLabel={(option: any) => `${option?.name}`}
                    getOptionValue={(option: any) => option?._id}
                    onChange={(option: any) => {
                      formik.setFieldTouched("receiver", true);
                      formik.setFieldValue("receiver", option?._id);
                    }}
                    value={users?.filter(
                      (option: any) => option?._id === formik.values.receiver
                    )}
                  />
                  {formik.touched.receiver && formik.errors.receiver ? (
                    <div
                      className="form-error"
                      style={{ fontSize: 12, color: "red" }}
                    >
                      {formik.errors.receiver}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-12">
                  <label
                    className="text-dark fs-5 fw-semibold required mb-2"
                    htmlFor=""
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-solid"
                    placeholder=""
                    {...getFieldProps("amount")}
                  />
                  {formik.touched.amount && formik.errors.amount ? (
                    <div
                      className="form-error"
                      style={{ fontSize: 12, color: "red" }}
                    >
                      {formik.errors.amount}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-12">
                  <label
                    className="text-dark fs-5 fw-semibold required mb-2"
                    htmlFor=""
                  >
                    Details
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder=""
                    {...getFieldProps("details")}
                  />
                  {formik.touched.details && formik.errors.details ? (
                    <div
                      className="form-error"
                      style={{ fontSize: 12, color: "red" }}
                    >
                      {formik.errors.details}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="text-end mt-3">
                <button
                  disabled={submitting}
                  type="submit"
                  className="btn btn-primary"
                >
                  {submitting && (
                    <span
                      className="spinner-border spinner-border-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
