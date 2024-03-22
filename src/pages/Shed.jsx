import React from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Selection,Resize,ContextMenu,Search,Inject,Edit,Toolbar,Group,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import {shedDetailsData,shedDetailsGrid,shedToolsData,shedVendorsData, shedVendorsGrid} from '../data/apps'
const Shed = () => {

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header className="Page" title="Shed" />
      <div className="my-5">
        <h2 className="font-bold text-xl my-2">Shed Details</h2>
        <GridComponent
        id="gridcomp"
        dataSource={shedDetailsData}
        width="auto"
        allowGrouping
        allowPaging
        allowSelection
        allowSorting
       
        toolbar={['Delete','Add']}
        editSettings={{ allowDeleting:true,allowEditing:true}}
        allowExcelExport
        allowPdfExport
        
      >
        <ColumnsDirective>
          {shedDetailsGrid.map((item, index) => (
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
            Group
          ]}
        />
      </GridComponent>
        </div>
        <div className="my-5">
            <h2 className="font-bold my-2 text-xl">Shed Vendors</h2>
       <GridComponent
        id="gridcomp"
        dataSource={shedVendorsData}
        width="auto"
        
        allowPaging
        allowSelection
        allowSorting
        toolbar={['Delete','Search','Add']}
        editSettings={{ allowDeleting:true,allowAdding:true,allowEditing:true}}
        allowExcelExport
        allowPdfExport
        
      >
        <ColumnsDirective>
          {shedVendorsGrid.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Toolbar,
            Resize,
            Sort,
            Search,
            ContextMenu,
            Filter,
            Page,
            Edit,
          ]}
        />
      </GridComponent>
      </div>
      <div>

        </div>
    </div>
  );
};

export default Shed;
