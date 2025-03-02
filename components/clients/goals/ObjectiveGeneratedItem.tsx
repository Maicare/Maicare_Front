import InputUncontrol from "@/common/components/InputUncontrol"
import Button from "@/components/common/Buttons/Button"
import IconButton from "@/components/common/Buttons/IconButton"
import Textarea from "@/components/common/FormFields/Textarea"
import { CreateObjective } from "@/types/goals.types"
import dayjs from "dayjs"
import { Pencil, Trash } from "lucide-react"
import { useState } from "react"


const ObjectiveGeneratedItem = ({ objective, updateObjective, deleteObjective, index }: { objective: CreateObjective, index: number, updateObjective: (id: number, updated: CreateObjective) => void, deleteObjective: (id: number) => void }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [updated, setUpdated] = useState<CreateObjective>(objective);
    if (editMode) {
        return (
            <div className="flex flex-col bg-white border border-stroke rounded-sm p-4.5 dark:border-strokedark w-full">
                <Textarea
                    label={"Doelstelling"}
                    name={"objective_description"}
                    required={true}
                    className={"w-full mb-4.5"}
                    value={updated.objective_description}
                    onChange={(e) => setUpdated({ ...updated, objective_description: e.target.value })}
                />
                <InputUncontrol
                    label={"Datum"}
                    name={"due_date"}
                    type={"date"}
                    required={true}
                    className={"w-full mb-4.5"}
                    value={dayjs(updated.due_date).format("YYYY-MM-DD")}
                    onChange={(e) => setUpdated({ ...updated, due_date: e.target.value })}
                />
                <div className="flex gap-4">
                    <Button onClick={() => setEditMode(false)} className="bg-c_red" type={"button"}>Annuleren</Button>
                    <Button onClick={() => { updateObjective(index, updated); setEditMode(false) }} className="bg-primary" type={"button"}>Opslaan</Button>
                </div>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-between bg-white border border-stroke rounded-sm p-4.5 dark:border-strokedark">
            <div>
                <h4 className="text-slate-800 dark:text-white">{objective.objective_description}</h4>
                <p className="text-slate-500 dark:text-white">{dayjs(objective.due_date).format("DD MMM YYYY")}</p>
            </div>
            <div className="flex gap-4">
                <IconButton onClick={() => deleteObjective(index)} className="bg-c_red" type={"button"}><Trash size={24} /></IconButton>
                <IconButton onClick={() => setEditMode(true)} className="bg-primary" type={"button"}><Pencil size={24} /></IconButton>
            </div>
        </div>
    )
}

export default ObjectiveGeneratedItem