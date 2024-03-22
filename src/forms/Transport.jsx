import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
// import ErrorMessage from "../../Components/ErrorMessage";
// import { createPortal } from "react-dom";
// import SuccessMessage from "../../Components/SuccessMessage";
// // Import the service for creating the new item (e.g., createMovement)
// import { createMovement } from "../../services/movements";

const CreateMovement = ({ setAddMovement, setMovement }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createError, setCreateError] = useState(false);
  const [success, setSuccess] = useState(false);
  //   const { mutate: addMovementMutation, isLoading } = useMutation({
  //     // Change the mutation function and error handling to use createMovement service
  //     mutationFn: ({
  //       movementDate,
  //       tool,
  //       sourceShed,
  //       destinationShed,
  //       toolCount,
  //       instrumentName,
  //     }) => {
  //       return createMovement({
  //         movementDate,
  //         tool,
  //         sourceShed,
  //         destinationShed,
  //         toolCount,
  //         instrumentName,
  //       });
  //     },
  //     onSuccess: (data) => {
  //       setSuccess(true);
  //       setSuccessMessage("Movement added successfully");
  //     },
  //     onError: (error) => {
  //       console.log(error.message);
  //       window.alert(error);
  //       setCreateError(true);
  //       setErrorMessage(error.message);
  //     },
  //   });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      movementDate: "",
      tool: "",
      sourceShed: "",
      destinationShed: "",
      toolCount: "",
      instrumentName: "",
    },
    mode: "onChange",
  });
  const isLoading = true;
  const submitHandler = (data) => {
    // console.log(data);
    // const {
    //   movementDate,
    //   tool,
    //   sourceShed,
    //   destinationShed,
    //   toolCount,
    //   instrumentName,
    // } = data;
    // addMovementMutation({
    //   movementDate,
    //   tool,
    //   sourceShed,
    //   destinationShed,
    //   toolCount,
    //   instrumentName,
    // });
  };

  return (
    <>
      {/* {createError &&
        createPortal(
          <ErrorMessage
            message={errorMessage}
            setCreateError={setCreateError}
          />,
          document.getElementById("error")
        )}
      {success &&
        createPortal(
          <SuccessMessage
            message={successMessage}
            setAddElement={setAddMovement}
            setElement={setMovement}
          />,
          document.getElementById("success")
        )} */}
      <div className="fixed inset-0 z-[1000] flex justify-center w-full overflow-auto bg-black/50">
        <div className="h-fit max-w-4xl w-[500px] mx-auto my-auto rounded-lg bg-white p-5">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-[400px] my-10 p-0 space-y-6 mx-auto"
          >
            <div className="w-[400px]">
              <label className="flex flex-row">
                <span className="font-semibold w-full">Movement Date:</span>
                <input
                  {...register("movementDate", {
                    required: {
                      value: true,
                      message: "Movement date is required",
                    },
                  })}
                  type="date"
                  name="movementDate"
                  className="form-input focus:outline-2 border-gray-400 border-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
              {/* Add similar input fields for other data */}
            </div>
            <div className="w-[400px]">
              <label className="flex flex-row">
                <span className="font-semibold w-full">Tool:</span>
                <input
                  {...register("tool", {
                    required: {
                      value: true,
                      message: "Tool is required",
                    },
                  })}
                  type="text"
                  name="tool"
                  className="form-input border-gray-400 border-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="w-[400px]">
              <label className="flex flex-row">
                <span className="font-semibold w-full">Source Shed:</span>
                <input
                  {...register("sourceShed", {
                    required: {
                      value: true,
                      message: "Source shed is required",
                    },
                  })}
                  type="text"
                  name="sourceShed"
                  className="form-input border-gray-400 border-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="w-[400px]">
              <label className="flex flex-row">
                <span className="font-semibold w-full">Destination Shed:</span>
                <input
                  {...register("destinationShed", {
                    required: {
                      value: true,
                      message: "Destination shed is required",
                    },
                  })}
                  type="text"
                  name="destinationShed"
                  className="form-input border-gray-400 border-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="w-[400px]">
              <label className="flex flex-row">
                <span className="font-semibold w-full">Tool Count:</span>
                <input
                  {...register("toolCount", {
                    required: {
                      value: true,
                      message: "Tool count is required",
                    },
                  })}
                  type="number"
                  name="toolCount"
                  className="form-input border-gray-400 border-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="w-[400px]">
              <label className="flex flex-row">
                <span className="font-semibold w-full">Instrument Name:</span>
                <input
                  {...register("instrumentName", {
                    required: {
                      value: true,
                      message: "Instrument name is required",
                    },
                  })}
                  type="text"
                  name="instrumentName"
                  className="form-input border-gray-400 border-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="flex flex-row my-auto">
              <button
                type="submit"
                // disabled={addMovementMutation.isLoading}
                className="bg-black flex mt-10 text-white font-semibold py-2 px-4 rounded-md mx-auto items-center hover:bg-purple-950"
              >
                {isLoading ? "Adding..." : "Add Movement"}
              </button>
              <button
                type="button"
                // onClick={() => setAddMovement(false)}
                className="bg-black flex mt-10 text-white font-semibold py-2 px-4 rounded-md mx-auto items-center hover:bg-purple-950"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateMovement;
