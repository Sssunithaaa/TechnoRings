import React,{useState} from 'react'
import { useForm } from 'react-hook-form';
const Service = () => {
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
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      Date: "",
      Amount: "",
      Description: "",
      Vendor: "",
      toolCount: "",
      
    },
    mode: "onChange",
  });
  const submitHandler=(data)=> {

  }
  const isLoading = true;
  return (
    <div className='w-full flex justify-center items-center '>
    <div className=" dark:text-gray-200 w-[600px] mx-auto dark:bg-secondary-dark-bg  pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
  <div className="h-fit max-w-xl lg:w-[500px] w-[270px] mx-auto my-auto rounded-lg lg:p-5 p-2 m-5">
    <form onSubmit={handleSubmit(submitHandler)} className="lg:w-[400px] w-[270px] my-10 p-0 space-y-6 mx-auto">
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
            className="dark:bg-main-dark-bg form-input py-2 px-2 focus:outline-2 rounded-md mt-1 w-full"
            required
          />
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

      <div className="lg:w-[400px] w-[300px]">
        <label className="flex flex-row justify-center items-center">
          <span className="font-semibold w-full">Tool Count:</span>
          <input
            type="number"
            value={toolCount}
            onChange={(e) => setToolCount(parseInt(e.target.value))}
            className="form-input py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            required
          />
        </label>
      </div>

      {/* Render tool input fields based on tool count */}
      {[...Array(toolCount)].map((_, index) => (
        <div className="lg:w-[400px] w-[300px]" key={index}>
          <label className="flex flex-row justify-center items-center">
            <span className="font-semibold w-full">{`Service Tool Details ${index + 1}:`}</span>
            <select
              value={tools[index]?.tool || ""}
              onChange={(e) => handleToolChange(index, e.target.value)}
              className="form-select dark:bg-main-dark-bg rounded-md py-2 px-2 mt-1 w-full"
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

      <div className="lg:w-[400px] w-[300px]">
        <label className="flex flex-row justify-center items-center">
          <span className="font-semibold w-full">Vendor:</span>
          <input
            {...register("vendor", {
              required: {
                value: true,
                message: "Vendor is required",
              },
            })}
            type="text"
            name="vendor"
            className="form-input py-2 px-2 dark:bg-main-dark-bg rounded-md mt-1 w-full"
            required
          />
        </label>
      </div>

      <div className="flex flex-row justify-center items-center">
        <button
          type="submit"
          className="bg-black text-white font-semibold py-2 px-2 rounded-md mx-auto mt-10 hover:bg-gray-950"
        >
          {!isLoading ? "Adding..." : "Add Movement"}
        </button>
        <button onClick={addToolField} className="bg-black text-white font-semibold py-2 px-2 rounded-md mx-auto mt-10 hover:bg-gray-950">
          Add More Tools
        </button>
      </div>
    </form>
  </div>
</div>
</div>

  )
}

export default Service