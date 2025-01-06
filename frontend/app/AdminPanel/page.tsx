"use client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, useEffect } from "react";
import { ClientSideRowModelModule, ColDef } from "ag-grid-community";
import Image from "next/image";
import Link from "next/link";
import LOGO from "@/public/IITBHU_LOGO.png";
import { adminService } from "@/services/api";
import Footer from "@/components/Footer";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    requested: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  const ActionCellRenderer = (props: any) => {
    const { data } = props;
    const handleAccept = async () => {
      try {
        const currentTags = data.Tags.split(',').map((t: string) => t.trim());
        await adminService.verifyGrievance(data._id, false, currentTags);
        data.Status = "Approved";
        props.api.refreshCells({ rowNodes: [props.node], force: true });
        updateRowData(data);
        updateStats("approved");
        alert("Grievance approved successfully");
      } catch (error) {
        alert("Failed to approve grievance");
      }
    };

    const updateRowData = (updatedData: any) => {
      setRowData((prevData) =>
        prevData.map((row) =>
          row.Heading === updatedData.Heading &&
          row.Content === updatedData.Content
            ? updatedData
            : row
        )
      );
    };

    if (data.Status === "Pending") {
      return (
        <div className="flex items-center justify-center space-x-4 h-full">
          <button
            onClick={handleAccept}
            className="bg-green-800 hover:bg-green-700 text-white font-semibold px-4 py-2 shadow-md transition duration-300 flex items-center justify-center rounded-full h-8 text-sm my-auto"
          >
            Approve
          </button>
        </div>
      );
    } else if (data.Status === "Approved") {
      return (
        <div className="w-full flex items-center justify-center h-full">
          <button className="bg-[#5d3459] flex items-center justify-center text-white font-semibold px-4 py-2 rounded-full h-8 text-sm my-auto cursor-default">
            Approved
          </button>
        </div>
      );
    }
    return null;
  };

  const TagsCellRenderer = (props: any) => {
    const { data, api, node } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editedTags, setEditedTags] = useState(data.Tags);

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedTags(e.target.value);
    };

    const handleBlurOrEnter = async (e: React.KeyboardEvent | React.FocusEvent) => {
      if (e.type === "blur" || (e as React.KeyboardEvent).key === "Enter") {
        setIsEditing(false);
        if (editedTags !== data.Tags) {
          try {
            const tags = editedTags.split(',').map((tag: string) => tag.trim());
            await adminService.verifyGrievance(data._id, data.Status === "Pending", tags);
            data.Tags = editedTags;
            api.refreshCells({ rowNodes: [node], force: true });
          } catch (error) {
            alert('Failed to update tags');
            setEditedTags(data.Tags);
          }
        }
      }
    };

    return isEditing ? (
      <input
        type="text"
        value={editedTags}
        onChange={handleInputChange}
        onBlur={handleBlurOrEnter}
        onKeyDown={handleBlurOrEnter}
        className="w-full px-2 py-1 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#573054]"
        autoFocus
      />
    ) : (
      <div
        className="flex items-center justify-center h-full flex-wrap"
        onDoubleClick={handleDoubleClick}
      >
        {data.Tags.split(",").map((tag: string) => (
          <button
            key={tag}
            type="button"
            className="px-2 py-2 rounded-full text-sm font-medium transition-all bg-gray-300  text-black my-5 mx-5"
          >
            {tag}
          </button>
        ))}
      </div>
    );
  };
  const contentCellRenderer = (props: any) => {
    const { data } = props;
    return (
      <div className="flex flex-col w-full h-full">
        <h2 className="text-lg font-semibold text-gray-800">{data.Heading}</h2>
        <p className="text-sm text-gray-600 mt-2">{data.Content}</p>
      </div>
    );
  };
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "Grievance", flex: 2, cellRenderer: contentCellRenderer },
    { field: "Tags", flex: 1.5, cellRenderer: TagsCellRenderer },
    { field: "Status" },
    { field: "Votes" },
    { field: "CreatedAt" },
    {
      field: "Action",
      flex: 1,
      cellRenderer: ActionCellRenderer,
    },
  ]);
  interface Grievance {
    _id: string;
    Heading: string;
    Content: string;
    Tags: string;
    Status: string;
    Votes: number;
    CreatedAt: string;
  }
  
  const [rowData, setRowData] = useState<Grievance[]>([]);

  const onCellValueChanged = (params: any) => {
    const updatedData = params.data;
    setRowData((prevData) =>
      prevData.map((row) =>
        row.Heading === updatedData.Heading &&
        row.Content === updatedData.Content
          ? updatedData
          : row
      )
    );
  };
  const getRowHeight = (params: any) => {
    const tags = params.data.Tags.split(",").length;
    const baseHeight = 50;
    return baseHeight + tags * 5;
  };

  function Navbar() {
    return (
      <nav>
        <div className="flex justify-between items-center bg-[#703f6c] p-2 shadow-lg">
          <Link href="/" className="flex items-center gap-3 ml-6">
            <Image
              src={LOGO}
              alt="IIT BHU Logo"
              width={64}
              height={64}
              quality={100}
            />
          </Link>
        </div>
      </nav>
    );
  }

  const updateStats = (newStatus: "requested" | "approved" | "rejected" | "pending") => {
    setStats((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      [newStatus]: prev[newStatus] + 1,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const grievances = await adminService.getAllGrievances();

        const formattedData = grievances.map((g) => ({
          _id: g._id,
          Heading: g.heading,
          Content: g.content,
          Tags: g.tags.join(", "),
          Status: g.isPending ? "Pending" : "Approved",
          Votes: g.upvote_count || 0,
          CreatedAt: new Date(g.created_at).toLocaleDateString(),
        }));

        setRowData(formattedData);

        // Calculate stats
        setStats({
          requested: grievances.length,
          approved: grievances.filter((g) => !g.isPending).length,
          rejected: 0, // Since the interface doesn't have rejected status
          pending: grievances.filter((g) => g.isPending).length,
        });
      } catch (error) {
        alert("Failed to load grievances");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="flex flex-col h-full w-full">
          <div className="w-full flex flex-col mt-6">
            <div className="w-[50%] flex items-center flex-col justify-evenly border-2 border-gray-300 rounded-xl p-4 mx-auto my-10 shadow-lg bg-[#fcffdf]">
              <h1 className="text-center text-4xl font-bold text-gray-800 mb-4">
                Approval Status
              </h1>
              <div className="flex flex-row justify-evenly w-full mt-4 space-x-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-lg">
                  <h2 className="text-xl text-gray-600 font-semibold">
                    Requested
                  </h2>
                  <span className="text-4xl mt-3 text-gray-800 font-bold">
                    {stats.requested}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg">
                  <h2 className="text-xl text-gray-600 font-semibold">
                    Approved
                  </h2>
                  <span className="text-4xl mt-3 text-green-700 font-bold">
                    {stats.approved}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg">
                  <h2 className="text-xl text-gray-600 font-semibold">
                    Rejected
                  </h2>
                  <span className="text-4xl mt-3 text-red-700 font-bold">
                    {stats.rejected}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg">
                  <h2 className="text-xl text-gray-600 font-semibold">
                    Pending
                  </h2>
                  <span className="text-4xl mt-3 text-amber-600 font-bold">
                    {stats.pending}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full p-4">
              <div
                className="ag-theme-quartz"
                style={{ height: 500, width: "100%", backgroundColor: "#fcffdf" }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={colDefs}
                  modules={[ClientSideRowModelModule]}
                  theme={"legacy"}
                  onCellValueChanged={onCellValueChanged}
                  getRowHeight={getRowHeight}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
