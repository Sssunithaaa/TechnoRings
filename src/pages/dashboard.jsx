import React, { useEffect, useState } from 'react';
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { FaWarehouse } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { LineChart, Stacked } from '../components';

const Homepage = () => {
  const [displayedOrders, setDisplayedOrders] = useState(5);
  const [request, setRequest] = useState("");
  const [table, setTable] = useState([]);

  const { data: toolsData } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/add-transport-order/`);
      return response.data;
    },
  });

  const { data: count } = useQuery({
    queryKey: ["counts"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/count_of/`);
      return response.data;
    },
  });
  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/vendor/`);
      return response.data.vendors;
    },
  });

  const transport_orders = toolsData?.transport_orders;
  const shed_details = toolsData?.shed_details;

  const getShedName = (shedId) => {
    const shed = shed_details.find((shed) => shed.shed_id === shedId);
    return shed ? shed.name : "Unknown Shed";
  };
  const getVendorName = (vendorId) => {
    const vendor = vendors.find((vendor)=> vendor.vendor_id === vendorId)
    return vendor ? vendor.name : "Unknown vendor"
  }
  const handleLoadMore = () => {
    setDisplayedOrders((prevCount) => prevCount + 5);
  };

  const handleLoadLess = () => {
    setDisplayedOrders((prevCount) => Math.max(prevCount - 5, 5));
  };

  const transportOrdersHeaders = [
    { label: "Movement ID", key: "movement_id" },
    { label: "Movement Date", key: "movement_date" },
    { label: "Acknowledgment", key: "acknowledgment" },
    { label: "Tool count", key: "tool_count" },
    { label: "Source shed", key: "source_shed" },
    { label: "Destination shed", key: "destination_shed" }
  ];

  const serviceOrdersHeaders = [
    { label: "Service ID", key: "service_id" },
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
    { label: "Description", key: "description" },
    { label: "Tool count", key: "tool_count" },
    { label: "Vendor", key: "vendor" }
  ];

  const deliveryChallanHeaders = [
    { label: "ID", key: "deliverychallan_id" },
    { label: "Received date", key: "received_date" },
    { label: "Vendor", key: "vendor" },
    { label: "Shed", key: "shed" },
    { label: "Service ID", key: "service" }
  ];

  useEffect(() => {
    if (request) {
      axios.get(`${process.env.REACT_APP_URL}/${request}/`)
        .then((response) => {
          const parts = request.split('_');
          const lastTwoWords = parts.slice(-2).join('_');
          setTable(response.data[lastTwoWords]);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [request]);
const convertToSentenceCase = (str) => {
  if (!str) return str;
  
  // Replace underscores with spaces
  const spacedStr = str.replace(/_/g, ' ');
  
  // Convert to sentence case
  return spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1).toLowerCase();
};

  const getHeaders = () => {
    switch (request) {
      case "recent_transport_orders":
        return transportOrdersHeaders;
      case "recent_service_orders":
        return serviceOrdersHeaders;
      case "recent_delivery_challan":
        return deliveryChallanHeaders;
      default:
        return [];
    }
  };

  const headers = getHeaders();

  return (
    <div className='bg-main-dark-bg m-10 flex flex-col gap-y-8 mt-24'>
      <div className='w-full flex flex-col gap-x-5 gap-y-2'>
        <p className='font-bold text-3xl text-white'>Dashboard</p>
        <div className='flex lg:flex-row flex-col gap-y-5 gap-x-5'>
          <div className='bg-gray-800 p-8 lg:w-[26%] w-[100%]'>
            <p className='text-light-gray-500  flex flex-row  h-10 items-center gap-x-3 text-xl text-white'>
              <span className='p-1 bg-[#8177d5] rounded-md'>
                <BsPersonWorkspace color='#2e1cc9'/>
              </span>Instruments</p>
            <p className='mt-3 font-semibold text-white text-2xl'>{count && count?.instruments_count}</p>
            <p className='text-sm text-gray-500'>Active</p>
            <p onClick={() => setRequest("")} className='text-sm text-white px-3 py-2 bg-[#2e1cc9] rounded-md my-3 mx-10 flex justify-center'>View more</p>
          </div>
          <div className='bg-gray-800 p-8 lg:w-[26%] w-[100%]'>
            <p className='text-light-gray-500 flex flex-row  h-10 items-center gap-x-3 text-xl text-white'>
              <span className='p-1 bg-[#8177d5] rounded-md'>
                <BsPersonWorkspace color='#2e1cc9'/>
              </span>Transport Orders</p>
            <p className='mt-3 font-semibold text-white text-2xl'>{count && count?.transport_order_count}</p>
            <p className='text-sm text-gray-500'>Active</p>
            <p onClick={() => setRequest("recent_transport_orders")} className='text-sm text-white px-3 py-2 bg-[#2e1cc9] rounded-md my-3 mx-10 flex justify-center'>View more</p>
          </div>
          <div className='bg-gray-800 p-8 lg:w-[26%] w-[100%]'>
            <p className='text-light-gray-500 flex flex-row  h-10 items-center gap-x-3 text-xl text-white'>
              <span className='p-1 bg-[#8177d5] rounded-md'>
                <FaWarehouse color='#2e1cc9'/>
              </span>Delivery Challan</p>
            <p className='mt-3 font-semibold text-white text-2xl'>{count && count?.deliverychallan_count}</p>
            <p className='text-sm text-gray-500'>Active</p>
            <p onClick={() => setRequest("recent_service_orders")} className='text-sm text-white px-3 py-2 bg-[#2e1cc9] rounded-md my-3 mx-10 flex justify-center'>View more</p>
          </div>
          <div className='bg-gray-800 p-8 lg:w-[26%] w-[100%]'>
            <p className='text-light-gray-500 flex flex-row  h-10 items-center gap-x-3 text-xl text-white'>
              <span className='p-1 bg-[#8177d5] rounded-md'>
                <MdOutlineMiscellaneousServices color='#2e1cc9'/>
              </span>Services</p>
            <p className='mt-3 font-semibold text-white text-2xl'>{count && count?.service_order_count}</p>
            <p className='text-sm text-gray-500'>Active</p>
            <p onClick={() => setRequest("recent_delivery_challan")} className='text-sm text-white px-3 py-2 bg-[#2e1cc9] rounded-md my-3 mx-10 flex justify-center'>View more</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <p className='font-bold text-3xl text-white mb-3'> {convertToSentenceCase(request)}</p>
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-3 text-center">{header.label}</th>
              ))}
            </tr>
          </thead>
        <tbody>
  {table?.slice(0, displayedOrders).map((row, index) => (
    <tr key={index} className="border-b bg-gray-800 text-white border-gray-700">
      {headers.map((header, colIndex) => (
        <td key={colIndex} className="px-6 py-4 text-center">
          {header.key === 'source_shed' || header.key === 'destination_shed' || header.key === "shed"
            ? getShedName(row[header.key])
            : header.key === "vendor"
            ? getVendorName(row[header.key])
            : header.key === "acknowledgment"
            ? row[header.key] ? "Acknowledged" : "Not Acknowledged"
            : row[header.key]}
        </td>
      ))}
    </tr>
  ))}
</tbody>

        </table>
      </div>

      <div className="text-center my-4">
        {table && table.length > displayedOrders && (
          <button onClick={handleLoadMore} className="text-sm text-white px-3 py-2 bg-[#2e1cc9] rounded-md my-2">
            Load More
          </button>
        )}
        {displayedOrders > 5 && (
          <button onClick={handleLoadLess} className="text-sm text-white px-3 py-2 bg-[#2e1cc9] rounded-md my-2">
            Load Less
          </button>
        )}
      </div>
    </div>
  );
};

export default Homepage;
