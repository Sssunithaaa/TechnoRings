import React from 'react'
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import {FaWarehouse} from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query';
import axios from "axios"
import { LineChart } from '../components';
import {Stacked} from '../components';
const Homepage = () => {
    const { data: toolsData } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/add-transport-order/`);
      console.log(response)
      return response.data;
    },
  });
    const transport_orders = toolsData?.transport_orders;
    const shed_details = toolsData?.shed_details;

    // Function to get shed name based on shed ID
    const getShedName = (shedId) => {
        const shed = shed_details.find((shed) => shed.shed_id === shedId);
        return shed ? shed.name : "Unknown Shed";
    };
 
  return (
    <div className='bg-main-dark-bg m-10 flex flex-col gap-y-8 mt-24'>
        
        <div className='w-full flex flex-col gap-x-5 gap-y-2'>
          <p className='font-bold text-3xl text-white '>Dashboard</p>
          <div className='flex lg:flex-row flex-col gap-y-5 gap-x-5'>
            <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
            <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><BsPersonWorkspace color='#2e1cc9'/></span>Total Employees</p>
            <p className='mt-3 font-semibold text-white text-2xl'>12345</p>
            <p className='text-sm text-gray-500'>Active</p>
          </div>
          <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
            <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><BsPersonWorkspace color='#2e1cc9'/></span>Total Vendors</p>
            <p className='mt-3 font-semibold text-white text-2xl'>12345</p>
            <p className='text-sm text-gray-500'>Active</p>
          </div>
          <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
            <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><FaWarehouse color='#2e1cc9'/></span>Total Sheds</p>
            <p className='mt-3 font-semibold text-white text-2xl'>12345</p>
            <p className='text-sm text-gray-500'>Active</p>
          </div>
          <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
            <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><MdOutlineMiscellaneousServices color='#2e1cc9'/></span>Total Services</p>
            <p className='mt-3 font-semibold text-white text-2xl'>12345</p>
            <p className='text-sm text-gray-500'>Active</p>
          </div>
          </div>
        </div>
    
        
            

<div class="relative overflow-x-auto">
    <p className='font-bold text-3xl text-white mb-3 '>Recent Transactions</p>
    <table class="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead class="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3 text-center">
                    Movement Date
                </th>
                <th scope="col" class="px-6 py-3 text-center">
                    Tool count
                </th>
                <th scope="col" class="px-6 py-3 text-center">
                    Source shed
                </th>
                <th scope="col" class="px-6 py-3 text-center">
                    Destination shed
                </th>
            </tr>
        </thead>
        <tbody>
            { 

            

                transport_orders?.map((tool,index)=> (
                    
                    <tr id={index} class=" border-b bg-gray-800 text-white border-gray-700">

                <th scope="row" class="px-6 py-4 text-center font-medium  whitespace-nowrap text-white">
                    {tool.movement_date}
                </th>
                <td class="px-6 py-4 text-center">
                    {tool.tool_count}
                </td>
                <td class="px-6 py-4 text-center">
                    {getShedName(tool.source_shed)}
                </td>
                <td class="px-6 py-4 text-center">
                    {getShedName(tool.destination_shed)}
                </td>
                
            </tr>
                ))
            }
          
            
        </tbody>
    </table>
</div>

<div>
<LineChart/>
</div>


       <div className='flex gap-10 flex-wrap justify-center'>
            <div className='rounded-2xl md:w-[780px] bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4'>
                    <p className='font-semibold text-xl'>Revenue updates</p>
                    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
<div className=" mb-10">
    <div>
      <p className="text-lg text-gray-400">Chart</p>
      <p className="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-slate-900">Stacked</p>
    </div>
    <p className="text-center dark:text-gray-200 text-xl mb-2 mt-3">Revenue breakdown</p>
  </div>    <div className="w-full">
      <Stacked />
    </div>
  </div>
                </div>
            </div>
       </div>
  )
}

export default Homepage