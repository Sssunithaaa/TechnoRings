import React, { useState, useEffect } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Resize, ContextMenu, Inject, Edit, Toolbar, Sort, Filter, PdfExport, ExcelExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AddInstrumentGroupDialog from "../forms/GroupMaster";
import { Button } from "@mui/material";
import {  useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { toast,ToastContainer } from "react-toastify";
import AddInstrumentFamilyDialog from "../forms/InstrumentGroup";
const GroupMaster = () => {
  const { id } = useParams();  // Extracting the id from URL params
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [name,setName] = useState()
  const [instrumentGroup,setInstrumentGroup] = useState()
  const { data, refetch } = useQuery({
    queryKey: ["masters", id],  // Adding id to the query key
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instruments_by_instrument_family/${id}/`);
      setInstrumentGroup({
        instrument_family_id:id,
        instrument_family_name: response.data.tool_family
      })
      setName(response.data.tool_family)
      return response.data.tools;
    },
  });

  const handleDialogClose = () => {
    setOpen(false);
    refetch();
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleRowClick = (args) => {
    const id = args.data.tool_group_id;
    navigate(`/instrument-family/master/tools/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const transportGridColumns = [
    { field: "tool_group_id", headerText: "Tool Group ID", width: "150", textAlign: "Center" },
    { field: "tool_group_name", headerText: "Tool Group Name", width: "150", textAlign: "Center" },
    { field: "tool_group_code", headerText: "Tool Group Code", width: "150", textAlign: "Center" },
  ];

  const toolbarClick = (args) => {
    console.log(args.item.id);
    if (args.item.id === 'gridcomp_pdfexport') {
      grid.pdfExport({
                pageOrientation: 'Landscape'
            });
    } else if (args.item.id === 'gridcomp_excelexport') {
      grid.excelExport();
    }
  };

  const handleDelete=async ()=> {
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/instrument_family/${id}/delete/ `);
      console.log(response)
      if(response.data.success){
        toast.success(response.data.message)
        setTimeout(()=> {
          navigate(-1);
        },2000)
    } else {
            toast.error("Error deleting instrument family ")

    }
   } catch (error) {
      toast.error("Error deleting instrument family ")
    }
  }
  const [openn,setOpenn] = useState(false);
 const handleDialogOpenn = ()=> {
  setOpenn(true);
 }
  const handleDialogClosee = ()=> {
  setOpenn(false);
  refetch();
 }

  let grid;
  return (
    <div>
       <div className="flex justify-start ml-10 mt-10">
        <BackButton />
      </div>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
       <div className="my-3 text-[22px] flex justify-between">
    <div>
      <strong>Family name: </strong>{name}
    </div>
    <div>
               <button className="px-5 py-2 bg-blue-500 text-[18px] rounded-md text-white font-semibold" onClick={handleDialogOpenn}>   Update instrument family
</button>
    </div>
    <div>
      
                <button className="px-5 py-2 bg-red-500 text-[18px] rounded-md text-white font-semibold" onClick={handleDelete}>   Delete instrument family
</button>
    
    </div>
  </div>
                <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold" onClick={handleDialogOpen}>        Add Instrument Group
</button>
<ToastContainer/>
    

      <AddInstrumentGroupDialog open={open} handleClose={handleDialogClose} family={name} mode="add" id={id} />

      <Header className="Page" title="Instrument Group Masters" />

      <GridComponent
        id="gridcomp"
        dataSource={data}
        width="auto"
        allowPaging
        allowSelection
        allowSorting
        toolbarClick={toolbarClick}
        toolbar={["ExcelExport", "PdfExport"]}
        pageSettings={{ pageSize: 10 }}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        allowExcelExport
        sortSettings={{ columns: [{ field: 'tool_group_id', direction: 'Descending' }] }}
        allowPdfExport
        rowSelected={handleRowClick}
        ref={g => grid = g}
      >
        <ColumnsDirective>
          {transportGridColumns.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Toolbar,
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
            Edit,
            PdfExport,
            ExcelExport
          ]}
        />
      </GridComponent>
      <AddInstrumentFamilyDialog open={openn} handleClose={handleDialogClosee} instrumentGroup={instrumentGroup}/>
    </div>
    </div>
  );
};

export default GroupMaster;
