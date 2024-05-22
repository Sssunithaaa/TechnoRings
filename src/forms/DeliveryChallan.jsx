import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import CalibrationDetailsForm from "./CalibrationDetails";
import "react-toastify/dist/ReactToastify.css";

const DeliveryChallan = ({}) => {
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [details, setDetails] = useState([]);
  const { data: deliveryChllan } = useQuery({
    queryKey: ["delivery"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/service-order/");
      setDetails(response?.data);
      return response.data;
    },
  });
  const { data: shedDetails } = useQuery({
    queryKey: ["shed"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/shed-details/");
      console.log(response.data);
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
      receivedDate: null,
      vendor: "",
      shed: "",
      service: "",
      
    },
    mode: "onChange",
  });

  const services = details?.service_orders;
  const [formData, setFormData] = useState();

  const handleAddCalibrationDetails = () => {

    
   
    setShowCalibrationModal(true);
  };

  const submitHandler = async (data) => {
    try {
      // Submit logic for calibration details form
      console.log("Submitting calibration details form:", data);
      
      
       const formData = {
        received_date: getValues("receivedDate"),
        vendor: getValues("vendor"),
        shed: getValues("shed"),
        service: getValues("service"),
        toolData: data, // Include tool details
      };
    console.log(formData);
        // Submit logic for calibration details form
        console.log("Submitting calibration details form:");
        const response = await axios.post("http://localhost:8000/store-delivery-challan/",formData);
        console.log(response);
      setShowCalibrationModal(false);
      
      toast.success("Calibration details added successfully", {
        position: "top-center",
        autoClose: 2000,
        closeButton: false,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error submitting calibration details:", error);
      toast.error("Failed to add calibration details. Please try again later.");
    }
  };
  const handleToolDetails = (toolDetails) => {
   
    console.log("Received tool details:", toolDetails);

  };

  const vendors = details?.vendors;
  const shed_details = shedDetails?.shed_details;
 

  return (
    <>
      <div className="w-full my-auto flex justify-center h-screen items-center">
        <div className=" w-[500px]  flex justify-center items-center  mx-auto bg-white shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]  m-2  pt-2  md:m-10 lg:mt-15  md:p-10  rounded-3xl">
          <div className="  max-w-xl w-[500px] py-10 lg:py-0  flex mx-auto justfy-center items-center rounded-lg">
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="w-[400px] flex flex-col h-[100%] pt-4 p-0 my-auto space-y-6 mx-auto"
            >
              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold text-[16px] text-gray-700 w-full">Received Date:</span>
                  <input
                    {...register("receivedDate", {
                      required: {
                        value: true,
                        message: "Received date is required",
                      },
                    })}
                    type="date"
                    name="receivedDate"
                    className="  form-input py-2 px-2 border-[2px] focus:outline-2  rounded-md mt-1 w-full"
                    required
                  />
                </label>
              </div>

              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold text-[16px] text-gray-700 w-full">Vendor:</span>
                  <select
                    {...register("vendor", {
                      required: {
                        value: true,
                        message: "Vendor name is required",
                      },
                    })}
                    name="vendor"
                    className="form-select py-2 px-2 border-[2px]  rounded-md mt-1 w-full"
                    required
                  >
                    <option value="">Select a vendor</option>
                    {vendors?.map((vendor) => (
                      <option key={vendor.vendor_id} value={vendor.vendor_id}>
                        {vendor.vendor_id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="w-[400px]">
                <label className="flex flex-row justify-center items-center">
                  <span className="font-semibold text-[16px] text-gray-700 w-full">Shed:</span>
                  <select
                    {...register("shed", {
                      required: {
                        value: true,
                        message: "Shed name is required",
                      },
                    })}
                    name="shed"
                    className="form-select py-2 px-2 border-[2px] rounded-md mt-1 w-full"
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
                  <span className="font-semibold text-[16px] text-gray-700 w-full">Select service id</span>
                  <select
                    {...register("service", {
                      required: {
                        value: true,
                        message: "Service is required",
                      },
                    })}
                    name="service"
                    className="form-select py-2 px-2 border-[2px] rounded-md mt-1 w-full"
                    required
                  >
                    <option value="">Service: </option>
                    {services?.map((service) => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.service_id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="w-[400px]">
                <button
                  type="button"
                  onClick={handleAddCalibrationDetails}
                  className="bg-indigo-700 text-white  font-semibold py-2 px-4 flex rounded-md mx-auto  "
                >
                  Add calibration details
                </button>
              </div>

              <ToastContainer />
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
          sendToolDetails={handleToolDetails}
        />
      )}
    </>
  );
};

export default DeliveryChallan;
