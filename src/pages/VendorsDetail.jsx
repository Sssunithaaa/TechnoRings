import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateVendor from "../forms/AddVendor";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport, ExcelExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../components/BackButton";
import CreateVendorHandleData from "../forms/VendorHandle";
import { useQuery } from "@tanstack/react-query";
const VendorsDetail = () => {
  
       const [open, setOpen] = useState(false);
         const [openn,setOpenn] = useState(false)

      const [vendorName,setVendorname] = useState("")
  const id=useParams()
  const [vendorHandle,setVendorHandle] = useState([])
    const [vendor,setVendor] = useState([])


const {refetch } = useQuery({
    queryKey: ["vendorhandle",id["id"]],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/vendor_details/${id["id"]}/`);
      setVendorHandle(response?.data?.vendor_handles)
        setVendorname(response?.data?.vendor?.name)
        setVendor(response?.data?.vendor)
    },
  });

 
  let grid;

    
  

    const handleDialogClose = () => {
        setOpen(false);
        refetch()
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };

     const handleDialogClosee = () => {
        setOpenn(false);
        refetch()
    };
  const handleDialogOpenn = () => {
        setOpenn(true);
    };
  
  const vendorGridColumns = [
    {type:"checkbox",width:"50"},
      { field: "tool_name", headerText: "Tool Family", width: "150", textAlign: "Center" },
        { field: "vendor_name", headerText: "Vendor", width: "150", textAlign: "Center" },
  { field: "turnaround_time", headerText: "Turnaround Time", width: "150", textAlign: "Center" },
  { field: "cost", headerText: "Cost", width: "150", textAlign: "Center" },


];


  

const toolbarClick = (args) => {
    const exportPattern = /(excelexport|pdfexport)$/;

    if (exportPattern.test(args.item.id)) {
        if (args.item.id.endsWith('pdfexport')) {
            grid.pdfExport({
                pageOrientation: 'Landscape'
            });
        } else if (args.item.id.endsWith('excelexport')) {
            grid.excelExport();
        }
    }
};

 
  const vendor_id = id["id"]
  const navigate = useNavigate()
  const handleDelete = async ()=> {
     try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/vendor/${vendor_id}/delete/`);
      toast.success("Vendor deleted successfully")
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
   const handleActionComplete=async (args)=> {
      if (args.requestType === "delete") {
    try {
      const id=args.data[0].vendorhandle_id;
      await axios.post(`${process.env.REACT_APP_URL}/vendor_handles/${id}/delete/`);
            toast.success("Vendor handle deleted successfully")
        setTimeout(()=> {
            navigate(-1);
        },2000)
    } catch (error) {
            toast.error(error.message)

      console.error("Error deleting data:", error);
    }
  }
     }

  return (
  
          <div>
             <div className="flex justify-start ml-10 mt-10">
       <BackButton/>
     </div>
    

            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
              
        <Header className="Page" title="Vendor handle" />
        <div className="text-[20px]">
                <strong>Vendor name: </strong>{vendorName}<br/>
                <strong>Location: </strong> {vendor?.location}<br/>
                   <strong>Address: </strong> {vendor?.address}<br/>
                      <strong>Phone number: </strong> {vendor?.phone_number}<br/>
                         <strong>Email: </strong> {vendor?.email}<br/>
                         <strong>Vendor type: </strong> {vendor?.vendor_type_name}<br/>
                          <strong>Certificate: </strong> {vendor?.nabl_certificate}<br/>

                         <br/>

              </div>
         <div className="flex flex-row justify-between mb-3">
          <button       className="bg-blue-500 py-2 my-2 px-4 rounded-md text-white" 
 onClick={handleDialogOpen}>Add Vendor Handle</button>
  <button       className="bg-blue-500 rounded-md py-2 my-2 px-4 text-white" 
 onClick={handleDialogOpenn}>Update Vendor</button>
        <button type="button" className="px-5 py-2 bg-red-500 rounded-md my-2 text-white font-semibold hover:bg-red-600" onClick={handleDelete}>Delete vendor</button>
         </div>
        <ToastContainer/>
        <GridComponent
          dataSource={vendorHandle}
          width="auto"
          id="grid"
          allowGrouping
          allowPaging
          allowFiltering
          allowSorting
          editSettings={{allowDeleting:true}}
          toolbar={['PdfExport','ExcelExport','Delete']}
          allowPdfExport
          allowExcelExport
      pageSettings={{pageSize: 5}}
            ref={g => grid = g}
          toolbarClick={toolbarClick}
          actionComplete={handleActionComplete}
        >
          <ColumnsDirective>
            {vendorGridColumns.map((item, index) => (
              <ColumnDirective key={index} {...item}></ColumnDirective>
            ))}
          </ColumnsDirective>
          <Inject services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport,ExcelExport]} />
        </GridComponent>
      </div>
                        <CreateVendorHandleData open={open} handleClose={handleDialogClose} id={id} vendorName={vendorName} />
                                      <CreateVendor open={openn} handleClose={handleDialogClosee} vendorData={vendor} />

          </div>
   
  )
}

export default VendorsDetail