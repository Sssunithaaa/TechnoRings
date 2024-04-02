import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import CalibrationDetailsForm from "./CalibrationDetails";
import "react-toastify/dist/ReactToastify.css";
const DeliveryChallan = ({  }) => {
   const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  
   const { data: deliveryChllan } = useQuery({
    queryKey: ["delivery"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/delivery_challan/");
      return response.data;
    },
  });
   
 

  


  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      receivedDate:null,
      vendor:"",
      shed:"",
      service:"",
      toolName: "",
      calibrationDate: null,
      calibrationReportNumber: "",
      calibrationAgency: "",
      result: "",
      action: "",
      nextCalibrationDate: null,
      remark: "",
    },
    mode: "onChange",
  });
   const services=[
    {
      service_id:1,
      service_name:"Name"
    }
   ]
   const [formData,setFormData] = useState();
   const handleAddCalibrationDetails = () => {
    // Save form data to state
    setFormData(getValues())
    // Show the calibration details modal
    setShowCalibrationModal(true);
  };

   const submitHandler = async (data) => {
    try {
      // Submit logic for calibration details form
      console.log("Submitting calibration details form:", data);
      const requestData ={
        receivedDate:data.receivedDate,
      vendor:data.vendor,
      shed:data.shed,
      service:data.service,
      toolName: data.toolName,
      calibrationDate: data.calibrationDate,
      calibrationReportNumber: data.calibrationReportNumber,
      calibrationAgency: data.calibrationAgency,
      result: data.result,
      action: data.action,
      nextCalibrationDate: data.nextCalibrationDate,
      remark: data.remark,
      }
      console.log(requestData)
      // reset();

      // Close the modal
      setShowCalibrationModal(false);

      // Show success message
      toast.success("Calibration details added successfully", {
        position: "top-center",
        autoClose: 2000,
        closeButton: false,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error submitting calibration details:', error);
      // Show error message
      toast.error("Failed to add calibration details. Please try again later.");
    }
  };
  const vendors =[
    {
      vendor_id: 1,
      name: "Sunitha"
    }
  ]
  const shed_details = [
  {
    shed_id:1,
    name:"Shed 1"
  }
  ]

  return (
    <>
      
     
        <div className="w-full my-auto flex justify-center h-screen items-center">
    <div className=" dark:text-gray-200 w-[500px]  flex justify-center items-center  mx-auto bg-[#eeedf0] shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] dark:bg-secondary-dark-bg m-2  pt-2  md:m-10 lg:mt-15  md:p-10  rounded-3xl">
        <div className= "  max-w-xl w-[500px] py-10 lg:py-0  flex mx-auto justfy-center items-center rounded-lg">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-[400px] flex flex-col h-[100%] pt-4 p-0 my-auto space-y-6 mx-auto"
          >
            <div className="w-[400px]">
              <label className="flex flex-row justify-center items-center">
                <span className="font-semibold w-full">Received Date:</span>
                <input
                  {...register("receivedDate", {
                    required: {
                      value: true,
                      message: "Received date is required",
                    },
                  })}
                  type="date"
                  name="receivedDate"
                  className="dark:bg-main-dark-bg  form-input py-2 px-2 focus:outline-2  rounded-md mt-1 w-full"
                  required
                />
              </label>
            </div>
            

            <div className="w-[400px]">
  <label className="flex flex-row justify-center items-center">
    <span className="font-semibold w-full">Vendor:</span>
    <select
      {...register("vendor", {
        required: {
          value: true,
          message: "Vendor name is required",
        },
      })}
      name="vendor"
      className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
      required
    >
      <option value="">Select a vendor</option>
      {vendors?.map((vendor) => (
        <option key={vendor.vendor_id} value={vendor.name}>
          {vendor.name}
        </option>
      ))}
    </select>
  </label>
</div>


            <div className="w-[400px]">
              <label className="flex flex-row justify-center items-center">
                <span className="font-semibold w-full">Shed:</span>
                <select
      {...register("shed", {
        required: {
          value: true,
          message: "Shed name is required",
        },
      })}
      name="shed"
      className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
      required
    >
      <option value="">Select shed</option>
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
                <span className="font-semibold w-full">Select service id</span>
                <select
      {...register("service", {
        required: {
          value: true,
          message: "Service is required",
        },
      })}
      name="service"
      className="form-select py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
      required
    >
      <option value="">Service: </option>
      {services?.map((service) => (
        <option key={service.service_id} value={service.service_id}>
          {service.service_name}
        </option>
      ))}
    </select>
              </label>
            </div>
            
            <div className="w-[400px]">
              <button
                type="button"
                onClick={handleAddCalibrationDetails}
                className="bg-black text-white  font-semibold py-2 px-4 flex rounded-md mx-auto  hover:bg-gray-950"
              >
                 Add calibration details
              </button>
            </div>

            <ToastContainer/>
          </form>
        </div>
      </div>
      </div>
       {showCalibrationModal && (
        <CalibrationDetailsForm
          onClose={() => setShowCalibrationModal(false)}
          onSubmit={submitHandler}
          register={register}
          getValues={getValues}
          formData={formData}
          reset={reset}
        />
      )}
    </>
  );
};

export default DeliveryChallan;
