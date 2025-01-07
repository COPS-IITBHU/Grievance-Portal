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
        <div className="flex items-center justify-center space-x-2 h-full">
          <button
            onClick={handleAccept}
            className="bg-green-800 hover:bg-green-700 text-white font-semibold px-3 md:px-4 py-1.5 md:py-2 shadow-md transition duration-300 flex items-center justify-center rounded-full text-xs md:text-sm"
          >
            Approve
          </button>
        </div>
      );
    } else if (data.Status === "Approved") {
      return (
        <div className="w-full flex items-center justify-center h-full">
          <button className="bg-[#5d3459] flex items-center justify-center text-white font-semibold  px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm cursor-default">
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
        className="w-full px-2 py-1 text-xs md:text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#573054]"
        autoFocus
      />
    ) : (
      <div
        className="flex items-center justify-start md:justify-center h-full flex-wrap gap-1 md:gap-2 px-1"
        onDoubleClick={handleDoubleClick}
      >
        {data.Tags.split(",").map((tag: string) => (
          <button
            key={tag}
            type="button"
            className="px-2 py-0.5 rounded-full text-xs md:text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap"
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
      <div className="flex flex-col w-full h-full p-2">
        <h2 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-2">{data.Heading}</h2>
        <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{data.Content}</p>
      </div>
    );
  };
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "Grievance", flex: 2, minWidth: 200, cellRenderer: contentCellRenderer },
    { field: "Tags", flex: 1.5, minWidth: 150, cellRenderer: TagsCellRenderer },
    { field: "Status", minWidth: 100 },
    { field: "Votes", minWidth: 80 },
    { field: "CreatedAt", minWidth: 100 },
    {
      field: "Action",
      flex: 1,
      minWidth: 120,
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
    const baseHeight = window.innerWidth < 640 ? 50 : 75;
    const tagHeight = window.innerWidth < 640 ? 2 : 3;
    return baseHeight + (tags * tagHeight);
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

  function StatsCard({ title, value, color }: { title: string; value: number; color: string }) {
    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-lg">
        <h2 className="text-lg md:text-xl text-gray-600 font-semibold text-center">
          {title}
        </h2>
        <span className={`text-3xl md:text-4xl mt-2 ${color} font-bold`}>
          {value}
        </span>
      </div>
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-gray-900" />
        </div>
      ) : (
        <main className="flex-1 py-4 px-2">
          <div className="max-w-7xl mx-auto">
            <div className="w-full md:w-[80%] lg:w-[70%] mx-auto bg-[#fcffdf] rounded-xl shadow-lg border-2 border-gray-300 p-3 my-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                Approval Status
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard title="Requested" value={stats.requested} color="text-gray-800" />
                <StatsCard title="Approved" value={stats.approved} color="text-green-700" />
                <StatsCard title="Rejected" value={stats.rejected} color="text-red-700" />
                <StatsCard title="Pending" value={stats.pending} color="text-amber-600" />
              </div>
            </div>

            <div className="mt-6 mb-14 w-full">
              <div
                className="ag-theme-quartz"
                style={{
                  height: '100%',
                  width: "100%",
                  backgroundColor: "#fcffdf"
                }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={colDefs}
                  modules={[ClientSideRowModelModule]}
                  theme={"legacy"}
                  onCellValueChanged={onCellValueChanged}
                  getRowHeight={getRowHeight}
                  domLayout="autoHeight"
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
