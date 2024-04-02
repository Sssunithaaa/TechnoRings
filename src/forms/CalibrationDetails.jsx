import React from "react";

const CalibrationDetailsForm = ({ onClose, onSubmit,formData,getValues, register, reset }) => {
    console.log(formData)
    const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const combinedData = getValues();
    onSubmit(combinedData); // Call onSubmit function with form data
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white dark:text-gray-200 text-gray-500  flex mx-auto flex-col justify-center items-center  dark:bg-secondary-dark-bg rounded-lg shadow-lg p-6 w-[500px]">
        <h2 className="text-lg font-semibold mb-4">Add Calibration Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-md">
          {/* Tool Name Drop Down */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Tool Name:</span>
            <select
              {...register("toolName", {
                required: "Tool name is required",
              })}
              name="toolName"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            >
              <option value="">Select Tool Name</option>
              {/* Add options dynamically */}
              <option value="tool1">Tool 1</option>
              <option value="tool2">Tool 2</option>
              {/* Add more options as needed */}
            </select>
            </label>
          </div>

          {/* Calibration Date */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Calibration Date:</span>
            <input
              {...register("calibrationDate", {
                required: "Calibration date is required",
              })}
              name="calibrationDate"
              type="date"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            />
            </label>
          </div>

          {/* Calibration Report Number */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Calibration Report Number:</span>
            <input
              {...register("calibrationReportNumber", {
                required: "Calibration report number is required",
              })}
              name="calibrationReportNumber"
              type="text"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            />
            </label>
          </div>

          {/* Calibration Agency */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Calibration Agency:</span>
            <input
              {...register("calibrationAgency", {
                required: "Calibration agency is required",
              })}
              name="calibrationAgency"
              type="text"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            />
            </label>
          </div>

          {/* Result */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Result:</span>
            <select
              {...register("result", {
                required: "Result is required",
              })}
              name="result"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            >
              <option value="">Select Result</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
            </label>
          </div>

          {/* Action */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Action:</span>
            <input
              {...register("action", {
                required: "Action is required",
              })}
              type="text"
              name="action"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            />
            </label>
          </div>

          {/* Next Calibration Date */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Next Calibration Date:</span>
            <input
              {...register("nextCalibrationDate", {
                required: "Next calibration date is required",
              })}
              type="date"
              name="nextCalibrationDate"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            />
            </label>
          </div>

          {/* Remark */}
          <div className="w-[400px] ">
            <label className=" flex flex-row justify-center items-center mb-1 font-semibold"><span className="font-semibold w-full">Remark:</span>
            <textarea
              {...register("remark")}
              name="remark"
              className="form-select border-2 border-gray-300 dark:border-0 py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
              rows="3"
            ></textarea>
            </label>
          </div>

          <div className="flex justify-between">
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Submit
            </button>
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className=" bg-red-600 text-yellow-200 font-semibold py-2 px-4 rounded-md hover:text-white focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalibrationDetailsForm;
