import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateMovement = ({}) => {
  const [toolCount, setToolCount] = useState(1);
  const [tools, setTools] = useState([{ id: 1, tool: "" }]);
  const [shedTools, setShedTools] = useState([]);
  const [selectedShed, setSelectedShed] = useState(null);



  useEffect(() => {
    if (selectedShed) {
      console.log(selectedShed)
       axios.get(`http://localhost:8000/shed_detail/${selectedShed}/`)
        .then(response => {
          setShedTools(response.data.shed_tools);
        })
        .catch(error => {
          console.error("Error fetching shed tools:", error);
        });
    }
    console.log(shedTools)
  }, [selectedShed]);

  const handleToolChange = (index, value) => {
    const newTools = [...tools];
    if (!newTools[index]) {
      newTools[index] = { id: index + 1, tool: "" };
    }
    newTools[index].tool = value;
    setTools(newTools);
  };

  const addToolField = () => {
    setToolCount((prevCount) => prevCount + 1);
    setTools((prevTools) => [...prevTools, { id: toolCount + 1, tool: "" }]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      movementDate: "",
      sourceShed: 0,
      destinationShed: 0,
     
    },
    mode: "onChange",
  });

  const submitHandler = async (data) => {
    try {
      // Extract source and destination shed IDs
      const sourceShedId = shed_details.find(shed => shed.name === data.sourceShed)?.shed_id;
      const destinationShedId = shed_details.find(shed => shed.name === data.destinationShed)?.shed_id;

      const toolsArray = tools.map((tool) => ({ tool: tool.id }));

      const requestData = {
        movement_date: data.movementDate,
        source_shed: data.sourceShed,
        destination_shed: data.destinationShed,
        tool_count: toolCount,
        tools: toolsArray,
        instrument_name: data.instrumentName,
      };
      console.log(requestData)
      const response = await axios.post('http://127.0.0.1:8000/add-transport-order/', requestData);
      console.log(response)
      toast.success("Tool movement added successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  const [sheds, setSheds] = useState([]);

useEffect(() => {
  const fetchSheds = async () => {
    try {
      const response = await axios.get("http://localhost:8000/shed-details/");
      setSheds(response.data);
    } catch (error) {
      console.error("Error fetching sheds:", error);
    }
  };

  fetchSheds();
}, []);

const shed_details = sheds?.shed_details;

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="dark:text-gray-200 w-[600px]  mx-auto bg-gray-200 dark:bg-secondary-dark-bg m-2  pt-2  md:m-10 mt-24  md:p-10 rounded-3xl">
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
              </div>

              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold w-full">Source Shed:</span>
                  <select
                    {...register("sourceShed", {
                      required: {
                        value: true,
                        message: "Source shed is required",
                      },
                    })}
                    name="sourceShed"
                    className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                    onChange={(e) => setSelectedShed(e.target.value)}
                    required
                  >
                    <option value="">Select a Source Shed</option>
                    {shed_details?.map((shed) => (
                      <option key={shed.shed_id} value={shed.shed_id}>
                        {shed.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold w-full">Destination Shed:</span>
                  <select
                    {...register("destinationShed", {
                      required: {
                        value: true,
                        message: "Destination shed is required",
                      },
                    })}
                    name="destinationShed"
                    className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                    required
                  >
                    <option value="">Select a Destination Shed</option>
                    {shed_details?.map((shed) => (
                      <option key={shed.shed_id} value={shed.shed_id}>
                        {shed.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

                 <div className="lg:w-[400px] w-[300px] ">
  <label className=" relative  flex flex-row items-center">
    <span className="font-semibold w-full">Tool count:</span>
  <input
    type="number"
    value={toolCount}
    onChange={(e) => setToolCount(parseInt(e.target.value))}
    className="form-input py-2 px-4 dark:bg-main-dark-bg rounded-md mt-1 w-full"
    required
  />
  <button
    type="button"
    onClick={addToolField}
    className="ml-2 bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-950 absolute right-0"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  </button>
  </label>
</div>

              {Array.from({ length: toolCount }).map((_, index) => (
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
                      {/* Render options dynamically */}
                      {shedTools?.map((shedTool) => (
                        <option key={shedTool.shedtool_id} value={shedTool.using_tool.instrument_name}>
                          {shedTool.using_tool.instrument_name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}


              

              <div className="flex flex-row justify-center items-center my-auto">
                <button
                  type="submit"
                  className="bg-black flex mt-10 text-white font-semibold py-2 px-2 rounded-md mx-auto items-center hover:bg-gray-950"
                >
                  Add movement
                </button>
                
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMovement;
