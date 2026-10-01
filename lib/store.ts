import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskFilter, View } from "./types";

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const iso = () => new Date().toISOString();
const uid = () => crypto.randomUUID();

const seed: Task[] = [
  { id: uid(), title: "Ship research agent MVP", notes: "Finish orchestration, streaming events, and the final report view.", status: "in_progress", priority: "urgent", dueDate: today, dueTime: "16:00", tags: ["work", "ai"], project: "Research Agent", assignee: "You", subtasks: [{id:uid(),title:"Wire agent events",done:true},{id:uid(),title:"Add report export",done:false}], recurring:"none", createdAt:iso(), completedAt:null },
  { id: uid(), title: "Review database indexes", notes: "Check slow query logs and remove redundant indexes.", status: "todo", priority: "high", dueDate: today, dueTime: "18:30", tags: ["backend"], project: "WhisperBox", assignee: "You", subtasks: [], recurring:"none", createdAt:iso(), completedAt:null },
  { id: uid(), title: "Plan next week's sprint", notes: "Turn backlog items into concrete deliverables.", status: "todo", priority: "medium", dueDate: tomorrow, dueTime: null, tags: ["planning"], project: "Personal", assignee: "You", subtasks: [], recurring:"weekly", createdAt:iso(), completedAt:null },
  { id: uid(), title: "Read TypeScript release notes", notes: "Capture anything relevant to the codebase.", status: "done", priority: "low", dueDate: today, dueTime: null, tags: ["learning"], project: "Personal", assignee: "You", subtasks: [], recurring:"none", createdAt:iso(), completedAt:iso() }
];

type State = { tasks: Task[]; view: View; filter: TaskFilter; selectedId: string | null; hydrated: boolean;
  setView:(view:View)=>void; setFilter:(filter:Partial<TaskFilter>)=>void; select:(id:string|null)=>void;
  add:(input:Partial<Task> & Pick<Task,"title">)=>void; update:(id:string,input:Partial<Task>)=>void; toggle:(id:string)=>void; remove:(id:string)=>void;
  duplicate:(id:string)=>void; clearCompleted:()=>void; setHydrated:(v:boolean)=>void;
};

export const useTaskStore = create<State>()(persist((set,get)=>({
  tasks: seed, view:"inbox", filter:{query:"",priority:"all",status:"all",project:"all",tag:"all"}, selectedId:seed[0]?.id??null, hydrated:false,
  setView:view=>set({view}), setFilter:filter=>set(s=>({filter:{...s.filter,...filter}})), select:selectedId=>set({selectedId}), setHydrated:hydrated=>set({hydrated}),
  add:input=>set(s=>{const task:Task={id:uid(),title:input.title,notes:input.notes??"",status:input.status??"todo",priority:input.priority??"none",dueDate:input.dueDate??null,dueTime:input.dueTime??null,tags:input.tags??[],project:input.project??"Personal",assignee:input.assignee??"You",subtasks:input.subtasks??[],recurring:input.recurring??"none",createdAt:iso(),completedAt:null}; return {tasks:[task,...s.tasks],selectedId:task.id};}),
  update:(id,input)=>set(s=>({tasks:s.tasks.map(t=>t.id===id?{...t,...input}:t)})),
  toggle:id=>set(s=>({tasks:s.tasks.map(t=>t.id===id?{...t,status:t.status==="done"?"todo":"done",completedAt:t.status==="done"?null:iso()}:t)})),
  remove:id=>set(s=>({tasks:s.tasks.filter(t=>t.id!==id),selectedId:s.selectedId===id?null:s.selectedId})),
  duplicate:id=>{const t=get().tasks.find(x=>x.id===id); if(!t)return; get().add({...t,title:`${t.title} (copy)`,status:"todo",completedAt:null,id:undefined as never});},
  clearCompleted:()=>set(s=>({tasks:s.tasks.filter(t=>t.status!=="done")}))
}),{name:"taskflow-storage",partialize:s=>({tasks:s.tasks})}));
