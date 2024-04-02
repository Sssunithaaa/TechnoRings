import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorHandle = ({}) => {
  const [toolCount, setToolCount] = useState(1);
  const [tools, setTools] = useState([{ id: 1, tool: "" }]);
  const [vendorTools, setVendorTools] = useState([]);

  const [vendors,setVendors] = useState([])

  useEffect(() => {

       const fetchTools = async () => {
    try {
      const response = await axios.get("http://localhost:8000/instrument-tools/");
      setVendorTools(response.data);
    } catch (error) {
      console.error("Error fetching sheds:", error);
    }
  };

  fetchTools();
  }, []);

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
      const requestData = {
      vendor_id: data.vendor,
      tool_id: data.tool,
      cost: data.cost,
      turnaround_time: data.turnaround_time
    };
      console.log(requestData)
      const response = await axios.post('http://127.0.0.1:8000/add_vendor_handles/', requestData);
      console.log(response)
      toast.success("Vendor handled successfully", {
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

useEffect(() => {
  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/vendor/");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching sheds:", error);
    }
  };

  fetchVendors();
}, []);


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
                  <span className="font-semibold w-full">Vendor:</span>
                  <select
                    {...register("vendor", {
                      required: {
                        value: true,
                        message: "Vendor is required",
                      },
                    })}
                    name="vendor"
                    className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                  
                    required
                  >
                    <option value="">Select a vendor</option>
                    {vendors?.vendor?.map((vendor) => (
                      <option key={vendor.vendor_id} value={vendor.vendor_id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold w-full">Tool:</span>
                  <select
                    {...register("tool", {
                      required: {
                        value: true,
                        message: "Source shed is required",
                      },
                    })}
                    name="tool"
                    className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                  
                    required
                  >
                    <option value="">Select a tool</option>
                    {vendorTools?.instrument_models?.map((tool) => (
                      <option key={tool.instrument_no} value={tool.instrument_no}>
                        {tool.instrument_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold w-full">Turn around time:</span>
                  <input
                    {...register("turnaround_time", {
                      required: {
                        value: true,
                        message: "Turnaround time name is required",
                      },
                    })}
                    type="number"
                    name="turnaround_time"
                    className="dark:bg-main-dark-bg form-input py-2 px-2 focus:outline-2  rounded-md mt-1 w-full"
                    required
                  />
                </label>
              </div>

                 <div className="lg:w-[400px] w-[300px] ">
  <label className=" relative  flex flex-row items-center">
    <span className="font-semibold w-full">Cost:</span>
  <input
                    {...register("cost", {
                      required: {
                        value: true,
                        message: "cost is required",
                      },
                    })}
                    type="number"
                    name="cost"
                    className="dark:bg-main-dark-bg form-input py-2 px-2 focus:outline-2  rounded-md mt-1 w-full"
                    required
                  />

  </label>
</div>

           


              

              <div className="flex flex-row justify-center items-center my-auto">
                <button
                  type="submit"
                  className="bg-black flex mt-10 text-white font-semibold py-2 px-2 rounded-md mx-auto items-center hover:bg-gray-950"
                >
                  Add vendor handle
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

export default VendorHandle;
