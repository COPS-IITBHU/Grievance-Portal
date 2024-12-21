"use client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Head from "next/head";
import { useState } from "react";
import { ClientSideRowModelModule, ColDef } from "ag-grid-community";

export default function Page() {
  const ActionCellRenderer = (props: any) => {
    const { data } = props;
    const handleAccept = () => {
      data.Status = "Approved";
      props.api.refreshCells({ rowNodes: [props.node], force: true });
      updateRowData(data);
    };

    const handleReject = () => {
      data.Status = "Rejected";
      props.api.refreshCells({ rowNodes: [props.node], force: true });
      updateRowData(data);
    };

    const updateRowData = (updatedData: any) => {
      setRowData((prevData) =>
        prevData.map((row, idx) =>
          row.Heading === updatedData.Heading &&
          row.Content === updatedData.Content
            ? updatedData
            : row
        )
      );
    };

    if (data.Status === "Pending") {
      return (
        <div className="flex items-center justify-center space-x-4 h-full ">
          <button
            onClick={handleAccept}
            className="bg-green-800 hover:bg-green-700 text-white font-semibold px-4 py-2  shadow-md transition duration-300 flex items-center justify-center  rounded-full h-8 text-sm my-auto"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2  shadow-md transition duration-300 rounded-full h-8 text-sm my-auto flex items-center justify-center"
          >
            Reject
          </button>
        </div>
      );
    } else if (data.Status === "Approved") {
      return (
        <div className="w-full flex  items-center justify-center h-full">
          <button className="bg-green-600 flex items-center justify-center text-white font-semibold px-4 py-2 rounded-full h-8 text-sm my-auto cursor-default">
            Approved
          </button>
        </div>
      );
    } else if (data.Status === "Rejected") {
      return (
        <div className="w-full  flex  items-center justify-center h-full">
          <button className="bg-red-600 flex items-center justify-center text-white font-semibold px-4 py-2 rounded-full h-8 text-sm my-auto cursor-default">
            Rejected
          </button>
        </div>
      );
    }
    return null;
  };

  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "Heading" },
    { field: "Content", flex: 1 },
    { field: "Tags" },
    { field: "Status" },
    { field: "Votes" },
    { field: "CreatedAt" },
    {
      field: "Action",
      flex: 1,
      cellRenderer: ActionCellRenderer,
    },
  ]);
  const [rowData, setRowData] = useState([
    {
      Heading: "Broken Light in Library",
      Content:
        "The light in the main reading room is broken and needs replacement.",
      Tags: "Maintenance, Library",
      Status: "Pending",
      Votes: 12,
      CreatedAt: "2023-09-15",
      Action: "Approve/Reject",
    },
    {
      Heading: "Wi-Fi Connectivity Issues",
      Content: "Wi-Fi is frequently disconnecting in the dormitory area.",
      Tags: "IT, Dormitory",
      Status: "Approved",
      Votes: 30,
      CreatedAt: "2023-09-10",
      Action: "Approve/Reject",
    },
    {
      Heading: "Cafeteria Food Quality",
      Content: "The quality of food in the cafeteria has declined recently.",
      Tags: "Cafeteria, Food",
      Status: "Rejected",
      Votes: 25,
      CreatedAt: "2023-09-20",
      Action: "Approve/Reject",
    },
    {
      Heading: "Air Conditioning in Lecture Hall",
      Content:
        "The air conditioning in Lecture Hall 3 is not working properly.",
      Tags: "Maintenance, Lecture Hall",
      Status: "Pending",
      Votes: 18,
      CreatedAt: "2023-09-18",
      Action: "Approve/Reject",
    },
    {
      Heading: "Library Book Request",
      Content: "Requesting new books for the computer science section.",
      Tags: "Library, Books",
      Status: "Pending",
      Votes: 22,
      CreatedAt: "2023-09-25",
      Action: "Approve/Reject",
    },
  ]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full flex flex-col mt-10">
        <div className="w-[50%] flex items-center flex-col justify-evenly border-2 border-gray-300 rounded-xl p-6 mx-auto my-10 shadow-lg ">
          <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">
            Approval Status
          </h1>
          <div className="flex flex-row justify-evenly w-full mt-6 space-x-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg ">
              <h2 className="text-xl text-gray-600 font-semibold">Requested</h2>
              <span className="text-4xl mt-3 text-gray-800 font-bold">255</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg ">
              <h2 className="text-xl text-gray-600 font-semibold">Approved</h2>
              <span className="text-4xl mt-3 text-gray-800 font-bold">180</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg ">
              <h2 className="text-xl text-gray-600 font-semibold">Rejected</h2>
              <span className="text-4xl mt-3 text-gray-800 font-bold">75</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg ">
              <h2 className="text-xl text-gray-600 font-semibold">Pending</h2>
              <span className="text-4xl mt-3 text-gray-800 font-bold">50</span>
            </div>
          </div>
        </div>

        {/* table */}

        <div className="w-full p-4">
          <div
            className="ag-theme-quartz "
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              modules={[ClientSideRowModelModule]}
              theme={"legacy"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
