"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  status: boolean;
  createdAt: string;
}

export default function PreordersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">(
    (searchParams.get("filter") as "all" | "active" | "inactive") || "all",
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "createdAt",
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as "asc" | "desc") || "desc",
  );
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchPreorders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
        filter,
        sortBy,
        order,
      });

      const response = await fetch(`/api/preorders?${params}`);
      if (!response.ok) throw new Error("Failed to fetch preorders");

      const data = await response.json();
      setPreorders(data.preorders);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching preorders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, sortBy, order]);

  useEffect(() => {
    fetchPreorders();
  }, [fetchPreorders]);

  const updateUrl = useCallback(
    (
      newFilter?: string,
      newSort?: string,
      newOrder?: string,
      newPage?: number,
    ) => {
      const params = new URLSearchParams();
      params.set("filter", newFilter || filter);
      params.set("sortBy", newSort || sortBy);
      params.set("order", newOrder || order);
      params.set("page", (newPage || page).toString());
      router.push(`/?${params.toString()}`);
    },
    [filter, sortBy, order, page, router],
  );

  const handleFilterChange = (newFilter: "all" | "active" | "inactive") => {
    setFilter(newFilter);
    setPage(1);
    updateUrl(newFilter, sortBy, order, 1);
  };

  const handleSort = (newSort: string) => {
    if (newSort === sortBy) {
      const newOrder = order === "desc" ? "asc" : "desc";
      setOrder(newOrder);
      updateUrl(filter, sortBy, newOrder, page);
    } else {
      setSortBy(newSort);
      setOrder("desc");
      updateUrl(filter, newSort, "desc", page);
    }
    setShowSortMenu(false);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setToggling(id);
    try {
      const response = await fetch(`/api/preorders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setPreorders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: !currentStatus } : p)),
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Error updating status. Please try again.");
    } finally {
      setToggling(null);
    }
  };

  const deletePreorder = async (id: string) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this preorder?</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={async () => {
              toast.dismiss(t);
              setDeleting(id);
              try {
                const response = await fetch(`/api/preorders/${id}`, {
                  method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to delete preorder");

                setPreorders((prev) => prev.filter((p) => p.id !== id));
                setSelectedRows((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(id);
                  return newSet;
                });
                toast.success("Preorder deleted successfully!");
              } catch (error) {
                console.error("Error deleting preorder:", error);
                toast.error("Error deleting preorder. Please try again.");
              } finally {
                setDeleting(null);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(preorders.map((p) => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedRows);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedRows(newSet);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Preorders</h1>
          <Link
            href="/preorder/new"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Create Preorder
          </Link>
        </div>

        {/* Tabs and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            {(["all", "active", "inactive"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-4 py-2 font-medium border-b-2 ${
                  filter === tab
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Sort by
                  </p>
                  {["name", "createdAt", "startsAt", "endsAt"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSort(option)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded ${
                        sortBy === option
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option === "name" && "Name"}
                      {option === "createdAt" && "Created At"}
                      {option === "startsAt" && "Starts At"}
                      {option === "endsAt" && "Ends At"}
                    </button>
                  ))}

                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <button
                      onClick={() => handleSort(sortBy)}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      {order === "desc" ? "↓" : "↑"}
                      <span>
                        {order === "desc" ? "Descending" : "Ascending"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : preorders.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No preorders found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === preorders.length &&
                          preorders.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Preorder when
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Starts at
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Ends at
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {preorders.map((preorder) => (
                    <tr
                      key={preorder.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(preorder.id)}
                          onChange={(e) =>
                            handleSelectRow(preorder.id, e.target.checked)
                          }
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {preorder.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {preorder.products}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {preorder.preorderWhen}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {formatDate(preorder.startsAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {preorder.endsAt ? formatDate(preorder.endsAt) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleStatus(preorder.id, preorder.status)
                          }
                          disabled={toggling === preorder.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preorder.status ? "bg-gray-800" : "bg-gray-300"
                          } disabled:opacity-50`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preorder.status
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/preorder/${preorder.id}/edit`}
                            className="p-2 text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => deletePreorder(preorder.id)}
                            disabled={deleting === preorder.id}
                            className="p-2 text-gray-600 hover:text-red-600 disabled:opacity-50"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * 8 + 1} to {Math.min(page * 8, total)}{" "}
                  from {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPage(Math.max(1, page - 1));
                      updateUrl(filter, sortBy, order, Math.max(1, page - 1));
                    }}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      setPage(Math.min(totalPages, page + 1));
                      updateUrl(
                        filter,
                        sortBy,
                        order,
                        Math.min(totalPages, page + 1),
                      );
                    }}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
