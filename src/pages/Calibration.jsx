import React,{useRef,useState} from "react";
import {MaskedTextBoxComponent} from "@syncfusion/ej2-react-inputs";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Selection,Group,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import {CalibrationGrid,calibrationData} from '../data/apps'
import { Header } from "../components";
const Calibration = () => {
     
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header className="Page" title="Orders" />
      <GridComponent
        id="gridcomp"
        dataSource={calibrationData}
        width="auto"
        allowGrouping
        allowPaging
        allowFiltering
        allowSorting
        toolbar={['Delete','Edit']}
        editSettings={{ allowAdding:true,allowDeleting:true,allowEditing:true}}
        allowExcelExport
        allowPdfExport
        
      >
        <ColumnsDirective>
          {CalibrationGrid.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Group,
            Toolbar,
            
            Sort,
            
            Filter,
            Page,
            Edit,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default Calibration;
