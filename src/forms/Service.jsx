import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Service = () => {
  const [toolCount, setToolCount] = useState(1);
  const [tools, setTools] = useState([{ id: 1, tool: "" }]);
    const [vendorTools, setVendorTools] = useState([]);


    const [selectedVendor, setSelectedVendor] = useState(null);

   useEffect(() => {
    if (selectedVendor) {
      console.log(selectedVendor)
       axios.get(`http://localhost:8000/vendor_details/${selectedVendor}/`)
        .then(response => {
          setVendorTools(response.data.vendor_handles);
        })
        .catch(error => {
          console.error("Error fetching shed tools:", error);
        });
    }
    console.log(vendorTools)
  }, [selectedVendor]);
  const handleToolChange = (index, value) => {
    const newTools = [...tools];
    if (!newTools[index]) {
      newTools[index] = { id: index + 1, tool: "" };
    }
    newTools[index].tool = value;
    setTools(newTools);
  };

  const addToolField = () => {
    setToolCount(prevCount => prevCount + 1);
    setTools(prevTools => [...prevTools, { id: toolCount + 1, tool: "" }]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: "",
      amount: "",
      description: "",
      vendor: "",
    },
    mode: "onChange",
  });
  

  const submitHandler = async (data) => {
    console.log(data)
    const requestData = {
      date: data.date,
      amount: parseFloat(data.amount),
      description: data.description,
      tool_count: toolCount,
      vendor: parseInt(data.vendor),
      tools: tools.map(tool => ({
        tool: parseInt(tool.id), // Assuming tool is stored as an ID
        vendor: parseInt(data.vendor), // Vendor ID
        service: 9 // Service ID, replace with actual service ID
      })),
    };
    console.log(requestData)

    try {
      const response = await axios.post('http://localhost:8000/service-order/', requestData);
      toast.success("Service order added successfully", {
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
    const [vendors, setVendors] = useState([]);

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
    <div className='w-full mt-12 my-5 flex justify-center items-center'>
      <div className="dark:text-gray-200 w-[550px] bg-[#eeedf0] shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]  mx-auto dark:bg-secondary-dark-bg pt-2 md:m-10 mt-12 md:p-10  rounded-3xl">
        <div className="h-fit max-w-xl lg:w-[500px] w-[300px] py-10 mx-auto my-auto rounded-lg lg:p-2 p-2 m-5">
          <form onSubmit={handleSubmit(submitHandler)} className="lg:w-[400px] w-[300px] my-5 p-0 space-y-6 mx-auto">
            <div className="lg:w-[400px] w-[300px]">
              <label className="flex flex-row justify-center items-center">
                <span className="font-semibold w-full">Date:</span>
                <input
                  {...register("date", {
                    required: {
                      value: true,
                      message: "Date is required",
                    },
                  })}
                  type="date"
                  name="date"
                  className="dark:bg-main-dark-bg form-input py-2 px-4 focus:outline-2 rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>

            {/* Add other input fields (Amount, Description, Vendor) */}

            <div className="lg:w-[400px] w-[300px]">
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
                  className="form-select py-2 px-4 dark:bg-main-dark-bg rounded-md mt-1 w-full"
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  required
                >
                  <option value="">Select a vendor</option>
                  {vendors["vendor"]?.map((vendor) => (
                    <option key={vendor.vendor_id} value={vendor.vendor_id}>
                      {vendor.name} - {vendor.location}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="lg:w-[400px] w-[300px]">
  <label className="flex flex-row justify-center items-center">
    <span className="font-semibold w-full">Amount:</span>
    <input
      {...register("amount", {
        required: {
          value: true,
          message: "Amount is required",
        },
      })}
      type="number"
      name="amount"
      className="form-input py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
      required
    />
  </label>
</div>


<div className="lg:w-[400px] w-[300px]">
  <label className="flex flex-row justify-center items-center">
    <span className="font-semibold w-full">Description:</span>
    <input
      {...register("description", {
        required: {
          value: true,
          message: "Description is required",
        },
      })}
      type="text"
      name="description"
      className="form-input py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
      required
    />
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


            {/* Render tool input fields based on tool count */}
            {[...Array(toolCount)].map((_, index) => (
              <div className="lg:w-[400px] w-[300px]" key={index}>
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold w-full">{`Service Tool
Details ${index + 1}:`}</span>
                  <select
                    value={tools[index]?.tool || ""}
                    onChange={(e) => handleToolChange(index, e.target.value)}
                    className="form-select dark:bg-main-dark-bg rounded-md py-2 px-4 mt-1 w-full"
                    required
                  >
                    <option value="">Select a tool</option>
                    {vendorTools?.map((tool, toolIndex) => (
                      <option key={toolIndex} value={tool.tool}>
                        {tool.tool_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}

            <div className="flex flex-row justify-center items-center">
              <button
                type="submit"
                className="bg-black text-white font-semibold py-2 px-4 rounded-md mx-auto mt-10 hover:bg-gray-950"
              >
                 Add Service
              </button>
              
            </div>
            <ToastContainer className="z-[100001]"/>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Service;
