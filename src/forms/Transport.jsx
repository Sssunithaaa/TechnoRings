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
  const [toolCount, setToolCount] = useState(1);
  const [tools, setTools] = useState([{ id: 1, tool: "" }]);
  const toolsData = [
  "Tool 1",
  "Tool 2",
  "Tool 3",
  // Add more tools as needed
];
  // Function to handle changes in tool inputs
  const handleToolChange = (index, value) => {
    const newTools = [...tools];
    if (!newTools[index]) {
    newTools[index] = { id: index + 1, tool: "" }; // Initialize the tool object if it's undefined
  }
  newTools[index].tool = value;
  setTools(newTools);
  };
  
  // Function to add a new tool input field
  const addToolField = () => {
    setToolCount((prevCount) => prevCount + 1);
    setTools((prevTools) => [...prevTools, { id: toolCount + 1, tool: "" }]);
  };
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
        <div className="w-full flex justify-center items-center">
    <div className=" dark:text-gray-200 w-[600px]  mx-auto dark:bg-secondary-dark-bg m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
        <div className="h-fit max-w-xl w-[500px] mx-auto my-auto rounded-lg  p-5">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-[400px] my-10 p-0 space-y-6 mx-auto"
          >
            <div className="w-[400px]">
              <label className="flex flex-row justify-center items-center">
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
                  className="dark:bg-main-dark-bg form-input py-2 px-2 focus:outline-2  rounded-md mt-1 w-full"
                  required
                />
              </label>
              {/* Add similar input fields for other data */}
            </div>
            

            <div className="w-[400px]">
              <label className="flex flex-row justify-center items-center">
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
                  className="form-input py-2 px-2  dark:bg-main-dark-bg  rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="w-[400px]">
              <label className="flex flex-row justify-center items-center">
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
                  className="form-input py-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="w-[400px]">
        <label className="flex flex-row justify-center items-center">
          <span className="font-semibold w-full">Tool Count:</span>
          <input
            type="number"
            value={toolCount}
            onChange={(e) => setToolCount(parseInt(e.target.value))}
            className="form-input py-2 px-2 dark:bg-main-dark-bg  rounded-md mt-1 w-full"
            required
          />
        </label>
      </div>

       {[...Array(toolCount)].map((_, index) => (
        <div className="w-[400px]" key={index}>
          <label className="flex flex-row justify-center items-center">
            <span className="font-semibold w-full">{`Tool ${index + 1}:`}</span>
            <select
        value={tools[index]?.tool || ""}
        onChange={(e) => handleToolChange(index, e.target.value)}
        className="form-select dark:bg-main-dark-bg rounded-md py-2 px-2  mt-1 w-full"
        required
      >
        <option value="">Select a tool</option>
        {toolsData.map((tool, toolIndex) => (
          <option key={toolIndex} value={tool}>
            {tool}
          </option>
        ))}
      </select>
          </label>
        </div>
      ))}

            <div className="w-[400px]">
              <label className="flex flex-row justify-center items-center">
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
                  className="form-input py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            <div className="flex flex-row justify-center items-center my-auto">
              <button
                type="submit"
                // disabled={addMovementMutation.isLoading}
                className="bg-black flex mt-10 text-white font-semibold py-2 px-2 rounded-md mx-auto items-center hover:bg-gray-950"
              >
                {!isLoading ? "Adding..." : "Add Movement"}
              </button>
               <button onClick={addToolField} className="bg-black flex mt-10 text-white font-semibold py-2 px-2 rounded-md mx-auto items-center hover:bg-gray-950">
        Add More Tools
      </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};

export default CreateMovement;
