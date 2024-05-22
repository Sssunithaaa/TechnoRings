import React, { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import axios from "axios"
import Select from 'react-select'
const InstrumentGroup = () => {
    const { data: masterData } = useQuery({
    queryKey: ["master"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/instrument-group-master-tools/");
      console.log(response.data);
      return response.data;
    },
  });

  
  const [familyName,setFamilyName] = useState();
  const [group,setGroup] = useState();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: familyName,
        instrument_group_master: group.value
      };
      console.log(data)
      const response = await axios.post("https://techno.pythonanywhere.com/add_instrument_family/", data);
      console.log(response);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  const options = masterData.instrument_group_masters.map((instrument)=> ({label: instrument.tool_group_name, value: instrument.tool_group_name}));
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <form className="space-y-6" onSubmit={submitHandler}  method="post">
          <div>
            <label htmlFor="familyName" className="block text-lg font-medium text-gray-700">
            Instrument Family Name:
            </label>
            <input
              type="text"
              name="familyName"
              id="familyName"
              required
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="groupMaster" className="block text-lg font-medium text-gray-700">
              Instrument Group Master:
            </label>
            <Select
              options={options}
              value={group}
              onChange={(selectedOption) => setGroup(selectedOption)}
              placeholder="Select Instrument Group Master"
            />
          </div>

          

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default InstrumentGroup