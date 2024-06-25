import React,{useState} from "react";
import { ToastContainer } from "react-toastify";
import Select from "react-select";
const CalibrationDetailsForm = ({ onClose, onSubmit, getValues, register,tools, reset,sendToolDetails,caVendors }) => {
  const [toolCount, setToolCount] = useState(1); // State to track the number of tools
      const date=new Date().toISOString().split('T')[0]

   const [toolDetails, setToolDetails] = useState([
    {
      toolName: "",
      calibrationDate: "",
      calibrationReportNumber: "",
      calibrationAgency: "",
      result: "",
      action: "",
      nextCalibrationDate: "",
      remark: "",
    },
  ]);

  // useEffect(async ()=> {
  //  const tools =await axios.get("http://localhost:8000/instrument-tools/");
  //  console.log(tools)

  // },[])
 
    const handleAddTool = () => {
        setToolCount(toolCount + 1);
        setToolDetails([
      ...toolDetails,
      {
        toolName: "",
        calibrationDate: date,
        calibrationReportNumber: "",
        calibrationAgency: "",
        result: "",
        action: "",
        nextCalibrationDate: "",
        remark: "",
        file: null
      },
    ]);
    };
    const handleRemoveTool = () => {
        setToolCount(toolCount - 1);
        setToolDetails([
      ...toolDetails.slice(0, toolCount - 1),
        ])
    };
   const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct JSON object to store details of all tools
    const toolsData = toolDetails.map((tool, index) => ({
        // calibration_tool: e.target[`toolName${index}`].value,
        calibration_tool: e.target[`toolName${index}`].value,
        calibration_date: e.target[`calibrationDate${index}`].value,
        calibration_report_no: e.target[`calibrationReportNumber${index}`].value,
        calibration_agency: e.target[`calibrationAgency${index}`].value,
        // result: e.target[`result${index}`].value,
        result: e.target[`result${index}`].value,
        action: e.target[`action${index}`].value,
        notification_date: '2024-05-19',
        next_calibration_date: '2024-05-19',
        remark: e.target[`remark${index}`].value,
        file: e.target[`file${index}`].files[0],
        file2: e.target[`file2${index}`].files[0]
    }));

    console.log(toolsData);
  
    onSubmit(toolsData);

   
};

     const renderToolRows = () => {
        const rows = [];
        for (let i = 0; i < toolCount; i++) {
            rows.push(
                <tr key={i}>
                    <td className="px-5 py-0 text-sm bg-white border-b border-gray-200">
                        <select
                            {...register(`toolName${i}`, {
                                required: "Tool name is required",
                            })}
                            name={`toolName${i}`}
                            className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
                        >
                              {tools?.map((tool) => (
                      <option key={tool.tool} value={tool.tool}>
                        {tool.tool_name}
                      </option>
                    ))}
                        </select>
                    </td>
                     <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                    <input
                                        {...register(`calibrationDate${i}`, {
                                            required: "Calibration date is required",
                                        })}
                                        name={`calibrationDate${i}`}
                                        defaultValue={date}
                                        type="date"
                                        className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
                                    />
                                </td>
                                <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                   <input
              {...register(`calibrationReportNumber${i}`, {
                required: "Calibration report number is required",
              })}
              name={`calibrationReportNumber${i}`}
              type="text"
              className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
            />
                                </td>
                            <td className="px-3 py-0 text-sm bg-white border-b border-gray-200">
            <Select
              options={caVendors?.map(vendor => ({
                value: vendor.vendor_id,
                label: vendor.vendor_name
              }))}
              name={`calibrationAgency${i}`}
              placeholder="Calibration Agency"
              className="form-select border-2 border-gray-300 border-b py-2 px-2 rounded-md mt-1 w-full"
            />
          </td>
                                <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                    <input
              {...register(`result${i}`, {
                required: "Result is required",
              })}
              type="text"
              name={`result${i}`}  
              className="form-input border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
            >
             
            </input>
                                </td>
                                <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                   <input
              {...register(`action${i}`, {
                required: "Action is required",
              })}
              type="text"
              name={`action${i}`}
              className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
            />
                                </td>
                                {/* <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                  <input
              {...register(`nextCalibrationDate${i}`, {
                required: "Next calibration date is required",
              })}
              type="date"
        name={`nextCalibrationDate${i}`}
              className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
            />
                                </td> */}
                                <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                   <textarea
              {...register(`remark${i}`)}
              name={`remark${i}`}
              className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
              rows="3"
            ></textarea>
                                </td>
                                <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                  <input
              {...register(`file${i}`, {
                required: "File is required",
              })}
              type="file"
        name={`file${i}`}
              className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
            ></input>
            </td>
             <td class="px-3 py-0 text-sm bg-white border-b border-gray-200">
                                  <input
              {...register(`file2${i}`, {
                required: "File is required",
              })}
              type="file"
        name={`file2${i}`}
              className="form-select border-2 border-gray-300 border-b py-2 px-2  rounded-md mt-1 w-full"
            ></input>
            </td>
                </tr>
            );
        }
        return rows;
    };

    return (
      
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-[100]">
            <div className="bg-white flex mx-auto flex-col justify-center items-center rounded-lg shadow-lg p-6 w-[95%]">
              <ToastContainer/>
                <h2 className="text-lg font-semibold mb-4">Add Calibration Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-md">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Tool Name</th>
                                <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Calibration date</th>
                         <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Calibration Report Number</th>
                         <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Calibration Agency</th> 
                        <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Result</th> 
                        <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Action</th> 
                        {/* <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Next Calibration Date</th> */}
                         <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">Remark</th>
                        <th  scope="col"
                        class="px-5 py-3 text-sm text-center text-gray-800 uppercase bg-white border-b border-gray-200">File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderToolRows()}
                            
                        </tbody>
                    </table>

                    <div className="flex justify-between">
                       <button
                            type="button"
                            onClick={handleAddTool}
                            className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 "
                        >
                            Add Tool

                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveTool}
                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 "
                        >
                            Remove Tool
                        </button>
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
                            className=" bg-red-600 text-gray-200 font-semibold py-2 px-4 rounded-md hover:text-white focus:outline-none"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalibrationDetailsForm