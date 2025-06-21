"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/interceptor";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


import { Label } from "@/components/ui/label";


import { Textarea } from "@/components/ui/textarea";



export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  useEffect(() => {
    fetchTasks();
  }, [page, filter]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/v1/tasks/gettasks?filter=${filter}&page=${page}&limit=10`);
      console.log(res.data);
      setTasks(res.data.tasks || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/tasks/deletetask/${selectedTaskId}`);
      toast.success("Task deleted");
      setShowDeleteModal(false);
      fetchTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-white font-sans overflow-x-hidden">

      <Toaster />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 overflow-hidden">

            <div className="flex justify-between p-4">
              <h1 className="text-[32px] font-bold">Tasks</h1>
              <Button onClick={() => setShowCreateModal(true)}>Create New Task</Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#dbe1e6] px-4 gap-8">
              {["all", "duetoday", "overdue", "upcomming"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setFilter(tab);
                    setPage(1);
                  }}
                  className={`pb-[13px] pt-4 border-b-[3px] text-sm font-bold capitalize ${filter === tab ? "border-b-[#111518] text-[#111518]" : "border-b-transparent text-[#60768a]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <Input placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            <div className="px-4 py-3 border border-[#dbe1e6] rounded-xl">
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 420px)" }}>
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="text-left text-sm font-medium text-[#111518]">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks
                      .filter((task) =>
                        task.task_name?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((task, idx) => (
                        <tr key={idx} className="border-t border-[#dbe1e6]">
                          <td className="px-4 py-2">{task.task_name || "-"}</td>
                          <td className="px-4 py-2">{task?.lead_id.phone || "-"}</td>
                          <td className="px-4 py-2">{task.priority || "-"}</td>
                          <td className="px-4 py-2">
                            <span className="px-3 py-1 bg-[#f0f2f5] rounded-full text-sm">{task.status}</span>
                          </td>
                          <td className="px-4 py-2 w-60">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">⋮</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditTaskData(task);
                                    setShowEditModal(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => {
                                  setSelectedTaskId(task._id);
                                  setShowDeleteModal(true);
                                }}>
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast("Change Status Logic")}>
                                  Change Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 py-6">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="size-10 flex items-center justify-center text-[#121416]">
                <ChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`size-10 flex items-center justify-center rounded-full text-sm ${p === page ? "font-bold bg-[#f1f2f4]" : "font-normal"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="size-10 flex items-center justify-center text-[#121416]">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Dialog open onOpenChange={() => setShowDeleteModal(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Task?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#60768a]">Are you sure you want to delete this task?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showEditModal && (
        <EditTaskModal
          onClose={() => { setShowEditModal(false); setEditTaskData(null); }}
          task={editTaskData}
          onUpdated={fetchTasks}
        />
      )}

      {showCreateModal && <CreateTaskModal onClose={() => setShowCreateModal(false)} />}
    </main>
  );
}


function EditTaskModal({ task, onClose, onUpdated }) {
  const [taskName, setTaskName] = useState(task.task_name || "");
  const [leadId, setLeadId] = useState(task.lead_id._id || "");
  const [status, setStatus] = useState(task.status || "scheduled");
  const [dueDate, setDueDate] = useState(task.due_date?.slice(0, 16) || "");
  const [activityType, setActivityType] = useState(task.activity_type || "whatsapp");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [note, setNote] = useState(task.note || "");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/leads/getleads?filter=all")
      .then((res) => setLeads(res.data.leads || []))
      .catch(() => toast.error("Failed to load leads"));
  }, []);

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating task...");
    try {
      await axios.put(`/api/v1/tasks/edittask/${task._id}`, {
        task_name: taskName,
        lead_id: leadId,
        status,
        due_date: dueDate,
        activity_type: activityType,
        priority,
        note,
      });

      toast.success("Task updated", { id: toastId });
      onClose();
      onUpdated?.();
    } catch (err) {
      toast.error("Failed to update task", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Task Name</Label>
            <Input value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Lead</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
            >
              <option value="">Select Lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.fullname}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={status === "scheduled"}
                  onChange={() => setStatus("scheduled")}
                />
                Scheduled
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={status === "completed"}
                  onChange={() => setStatus("completed")}
                />
                Completed
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Activity Type</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              <option value="whatsapp">Whatsapp</option>
              <option value="call">Call</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



function CreateTaskModal({ onClose }) {
  const [taskName, setTaskName] = useState("");
  const [leadId, setLeadId] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [dueDate, setDueDate] = useState("");
  const [activityType, setActivityType] = useState("whatsapp");
  const [priority, setPriority] = useState("medium");
  const [note, setNote] = useState("");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/leads/getleads?filter=all")
      .then((res) => { setLeads(res.data.leads || []) })
      .catch(() => toast.error("Failed to load leads"));
  }, []);

  const handleSubmit = async () => {
    if (!taskName || !leadId || !dueDate) {
      toast.error("Task name, lead, and due date are required");
      return;
    }

    const toastId = toast.loading("Creating task...");
    try {
      await axios.post("/api/v1/tasks/createtask", {
        task_name: taskName,
        lead_id: leadId,
        status,
        due_date: dueDate,
        activity_type: activityType,
        priority,
        note,
      });
      toast.success("Task created successfully", { id: toastId });
      onClose();
    } catch (err) {
      toast.error("Failed to create task", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Task Name</Label>
            <Input value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Lead</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
            >
              <option value="">Select Lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.fullname}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={status === "scheduled"}
                  onChange={() => setStatus("scheduled")}
                />
                Scheduled
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={status === "completed"}
                  onChange={() => setStatus("completed")}
                />
                Completed
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Activity Type</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              <option value="whatsapp">Whatsapp</option>
              <option value="call">Call</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
